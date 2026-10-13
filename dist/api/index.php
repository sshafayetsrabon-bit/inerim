<?php
/**
 * INERIM CMS API
 * ---------------------------------------------------------------------------
 * One file, no database. Content is stored as JSON in a data folder that lives
 * OUTSIDE public_html (default: /home/<user>/inerim-data), so a deploy that
 * replaces public_html never touches content, uploads or enquiries.
 *
 * Override the location with the INERIM_DATA_DIR environment variable.
 *
 * Routes (?r=...):
 *   GET  content          public: all site content
 *   POST inquiry          public: submit an enquiry / quote / booking
 *   GET  file&f=<name>    public: serve an uploaded image
 *   GET  status           is the CMS set up? is this token valid?
 *   POST setup            first run only: choose the admin password
 *   POST login            password -> token
 *   POST save&c=<name>    admin: replace a collection
 *   GET  inquiries        admin
 *   POST inquiry-update   admin
 *   POST inquiry-delete   admin
 *   POST upload           admin: multipart "file"
 *   GET  uploads          admin: list uploaded images
 *   POST password         admin: change password
 */
declare(strict_types=1);

const COLLECTIONS = ['settings', 'products', 'posts', 'projects', 'colours'];
const INQUIRY_TYPES = ['contact', 'booking', 'quote', 'partnership', 'estimate', 'visualizer'];
const TOKEN_TTL = 60 * 60 * 12; // 12 hours
const MAX_UPLOAD = 8 * 1024 * 1024;

header('X-Content-Type-Options: nosniff');

$DATA = getenv('INERIM_DATA_DIR') ?: dirname(__DIR__, 2) . '/inerim-data';

function out($data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $msg, int $code = 400): void
{
    out(['error' => $msg], $code);
}

function ensure_dir(string $dir): void
{
    if (!is_dir($dir) && !@mkdir($dir, 0750, true)) {
        fail('The CMS data folder could not be created. Check permissions for ' . $dir, 500);
    }
}

function path(string $name): string
{
    global $DATA;
    return $DATA . '/' . $name . '.json';
}

function read_json(string $file, $default = null)
{
    if (!is_file($file)) return $default;
    $fh = fopen($file, 'r');
    if (!$fh) return $default;
    flock($fh, LOCK_SH);
    $raw = stream_get_contents($fh);
    flock($fh, LOCK_UN);
    fclose($fh);
    $data = json_decode((string) $raw, true);
    return $data === null ? $default : $data;
}

function write_json(string $file, $data): void
{
    $tmp = $file . '.' . bin2hex(random_bytes(4)) . '.tmp';
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false || file_put_contents($tmp, $json, LOCK_EX) === false || !rename($tmp, $file)) {
        @unlink($tmp);
        fail('Could not save data.', 500);
    }
}

function body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode((string) $raw, true);
    return is_array($data) ? $data : [];
}

function client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/** Simple per-IP rate limit kept in a JSON file. */
function rate_limit(string $bucket, int $max, int $window): void
{
    global $DATA;
    $file = $DATA . '/ratelimit.json';
    $all = read_json($file, []);
    $now = time();
    $key = $bucket . ':' . hash('sha256', client_ip());
    $hits = array_values(array_filter($all[$key] ?? [], fn($t) => $t > $now - $window));
    if (count($hits) >= $max) fail('Too many requests. Please try again later.', 429);
    $hits[] = $now;
    $all[$key] = $hits;
    foreach ($all as $k => $v) {
        if (!array_filter($v, fn($t) => $t > $now - 86400)) unset($all[$k]);
    }
    write_json($file, $all);
}

function config(): array
{
    return read_json(path('config'), []);
}

function b64u(string $s): string
{
    return rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
}

function make_token(array $cfg): string
{
    $payload = b64u(json_encode(['exp' => time() + TOKEN_TTL, 'v' => $cfg['version'] ?? 1]));
    return $payload . '.' . hash_hmac('sha256', $payload, $cfg['secret']);
}

function request_token(): string
{
    $h = $_SERVER['HTTP_X_ADMIN_TOKEN']
        ?? $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';
    return trim(preg_replace('/^Bearer\s+/i', '', (string) $h));
}

function token_valid(): bool
{
    $cfg = config();
    $t = request_token();
    if (!$t || empty($cfg['secret']) || !str_contains($t, '.')) return false;
    [$payload, $sig] = explode('.', $t, 2);
    if (!hash_equals(hash_hmac('sha256', $payload, $cfg['secret']), $sig)) return false;
    $data = json_decode((string) base64_decode(strtr($payload, '-_', '+/')), true);
    return is_array($data) && ($data['exp'] ?? 0) > time() && ($data['v'] ?? 0) === ($cfg['version'] ?? 1);
}

function require_admin(): void
{
    if (!token_valid()) fail('Please sign in again.', 401);
}

function require_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') fail('POST required', 405);
}

function clean_str($v, int $max): string
{
    return mb_substr(trim(strip_tags((string) $v)), 0, $max);
}

function backup(string $c): void
{
    global $DATA;
    $src = path($c);
    if (!is_file($src)) return;
    $dir = $DATA . '/backups';
    ensure_dir($dir);
    copy($src, $dir . '/' . $c . '-' . date('Ymd-His') . '.json');
    $files = glob($dir . '/' . $c . '-*.json') ?: [];
    sort($files);
    while (count($files) > 30) @unlink(array_shift($files));
}

function notify(array $inq): void
{
    $settings = read_json(path('settings'), []);
    $to = $settings['email'] ?? '';
    if (!$to || !filter_var($to, FILTER_VALIDATE_EMAIL) || !function_exists('mail')) return;
    $lines = ["New {$inq['type']} enquiry from the website", '', "Name: {$inq['name']}", "Phone: {$inq['phone']}"];
    if (!empty($inq['email'])) $lines[] = "Email: {$inq['email']}";
    if (!empty($inq['message'])) $lines[] = "Message: {$inq['message']}";
    if (!empty($inq['data'])) {
        $lines[] = '';
        $lines[] = json_encode($inq['data'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
    $host = preg_replace('/[^a-z0-9.\-]/i', '', $_SERVER['HTTP_HOST'] ?? 'localhost');
    @mail($to, 'INERIM website: new ' . $inq['type'] . ' enquiry', implode("\n", $lines), "From: INERIM Website <no-reply@{$host}>\r\nContent-Type: text/plain; charset=utf-8");
}

/* ------------------------------------------------------------------------ */

ensure_dir($DATA);
$route = $_GET['r'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($route) {
    case 'content':
        $res = [];
        foreach (COLLECTIONS as $c) $res[$c] = read_json(path($c));
        out($res);

    case 'status':
        out(['setup' => empty(config()['hash']), 'authed' => token_valid()]);

    case 'setup':
        require_post();
        if (!empty(config()['hash'])) fail('The CMS is already set up.', 403);
        $pw = (string) (body()['password'] ?? '');
        if (strlen($pw) < 10) fail('Use at least 10 characters for the admin password.');
        $cfg = ['hash' => password_hash($pw, PASSWORD_DEFAULT), 'secret' => bin2hex(random_bytes(32)), 'version' => 1];
        write_json(path('config'), $cfg);
        out(['token' => make_token($cfg)]);

    case 'login':
        require_post();
        rate_limit('login', 10, 900);
        $cfg = config();
        if (empty($cfg['hash'])) fail('The CMS has not been set up yet.', 409);
        if (!password_verify((string) (body()['password'] ?? ''), $cfg['hash'])) {
            sleep(1);
            fail('Wrong password.', 401);
        }
        out(['token' => make_token($cfg)]);

    case 'password':
        require_post();
        require_admin();
        $b = body();
        $cfg = config();
        if (!password_verify((string) ($b['current'] ?? ''), $cfg['hash'])) fail('Current password is wrong.', 401);
        if (strlen((string) ($b['next'] ?? '')) < 10) fail('Use at least 10 characters.');
        $cfg['hash'] = password_hash((string) $b['next'], PASSWORD_DEFAULT);
        $cfg['version'] = ($cfg['version'] ?? 1) + 1; // signs out every other session
        write_json(path('config'), $cfg);
        out(['ok' => true]);

    case 'save':
        require_post();
        require_admin();
        $c = $_GET['c'] ?? '';
        if (!in_array($c, COLLECTIONS, true)) fail('Unknown collection.');
        $data = json_decode((string) file_get_contents('php://input'), true);
        if (!is_array($data)) fail('Invalid data.');
        if ($c !== 'settings' && !array_is_list($data)) fail('Expected a list.');
        backup($c);
        write_json(path($c), $data);
        out(['ok' => true]);

    case 'inquiry':
        require_post();
        $b = body();
        if (!empty($b['website'])) out(['ok' => true]); // honeypot
        rate_limit('inquiry', 20, 3600);
        $type = in_array($b['type'] ?? '', INQUIRY_TYPES, true) ? $b['type'] : 'contact';
        $name = clean_str($b['name'] ?? '', 120);
        $phone = clean_str($b['phone'] ?? '', 40);
        if ($name === '' || $phone === '') fail('Name and phone are required.');
        $data = is_array($b['data'] ?? null) ? $b['data'] : [];
        if (strlen((string) json_encode($data)) > 20000) fail('Too much data.');
        $inq = [
            'id' => bin2hex(random_bytes(8)),
            'type' => $type,
            'createdAt' => gmdate('c'),
            'status' => 'new',
            'name' => $name,
            'phone' => $phone,
            'email' => clean_str($b['email'] ?? '', 160),
            'message' => clean_str($b['message'] ?? '', 4000),
            'data' => $data,
        ];
        $all = read_json(path('inquiries'), []);
        $all[] = $inq;
        write_json(path('inquiries'), $all);
        notify($inq);
        out(['ok' => true]);

    case 'inquiries':
        require_admin();
        $all = read_json(path('inquiries'), []);
        usort($all, fn($a, $b) => strcmp($b['createdAt'], $a['createdAt']));
        out($all);

    case 'inquiry-update':
        require_post();
        require_admin();
        $b = body();
        $all = read_json(path('inquiries'), []);
        foreach ($all as &$i) {
            if ($i['id'] === ($b['id'] ?? '')) {
                if (isset($b['status']) && in_array($b['status'], ['new', 'contacted', 'won', 'closed'], true)) $i['status'] = $b['status'];
                if (isset($b['note'])) $i['note'] = clean_str($b['note'], 2000);
            }
        }
        unset($i);
        write_json(path('inquiries'), $all);
        out(['ok' => true]);

    case 'inquiry-delete':
        require_post();
        require_admin();
        $id = body()['id'] ?? '';
        $all = array_values(array_filter(read_json(path('inquiries'), []), fn($i) => $i['id'] !== $id));
        write_json(path('inquiries'), $all);
        out(['ok' => true]);

    case 'upload':
        require_post();
        require_admin();
        $f = $_FILES['file'] ?? null;
        if (!$f || $f['error'] !== UPLOAD_ERR_OK) fail('Upload failed.');
        if ($f['size'] > MAX_UPLOAD) fail('Images must be under 8 MB.');
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
        $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$mime] ?? null;
        if (!$ext || !@getimagesize($f['tmp_name'])) fail('Only JPG, PNG or WebP images are allowed.');
        $dir = $DATA . '/uploads';
        ensure_dir($dir);
        $name = bin2hex(random_bytes(8)) . '.' . $ext;
        if (!move_uploaded_file($f['tmp_name'], $dir . '/' . $name)) fail('Could not store the image.', 500);
        out(['url' => '/api/index.php?r=file&f=' . $name]);

    case 'uploads':
        require_admin();
        $files = array_values(array_filter(glob($DATA . '/uploads/*') ?: [], fn($f) => preg_match('/^[a-f0-9]{16}\.(jpg|png|webp)$/', basename($f))));
        usort($files, fn($a, $b) => filemtime($b) <=> filemtime($a));
        out(array_map(fn($f) => '/api/index.php?r=file&f=' . basename($f), $files));

    case 'file':
        $name = (string) ($_GET['f'] ?? '');
        if (!preg_match('/^[a-f0-9]{16}\.(jpg|png|webp)$/', $name, $m)) fail('Not found', 404);
        $file = $DATA . '/uploads/' . $name;
        if (!is_file($file)) fail('Not found', 404);
        header('Content-Type: ' . ['jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp'][$m[1]]);
        header('Cache-Control: public, max-age=31536000, immutable');
        header('Content-Length: ' . filesize($file));
        readfile($file);
        exit;

    default:
        fail('Unknown route', 404);
}
