/**
 * Dev-only: runs public/api/index.php inside WebAssembly PHP so `npm run dev`
 * uses exactly the same CMS backend as production (cPanel/Apache + PHP).
 * Data is stored in ./.cms-data (git-ignored).
 */
import type { Plugin } from 'vite';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export function cmsDevServer(): Plugin {
  let handlerPromise: Promise<{ php: any; h: any }> | null = null;
  const root = process.cwd();
  const apiFile = path.join(root, 'public/api/index.php');
  const dataDir = path.join(root, '.cms-data');

  const boot = async () => {
    const { PHP, PHPRequestHandler } = await import('@php-wasm/universal');
    const { loadNodeRuntime, createNodeFsMountHandler } = await import('@php-wasm/node');
    mkdirSync(dataDir, { recursive: true });
    const php = new PHP(await loadNodeRuntime('8.2', { emscriptenOptions: { processId: 1 } }));
    php.mkdirTree('/home/dev/public_html/api');
    php.mkdirTree('/home/dev/inerim-data');
    await php.mount('/home/dev/inerim-data', createNodeFsMountHandler(dataDir));
    const h = new PHPRequestHandler({ php, documentRoot: '/home/dev/public_html', absoluteUrl: 'http://localhost:3000' });
    return { php, h };
  };

  return {
    name: 'inerim-cms-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/index.php')) return next();
        try {
          handlerPromise ??= boot();
          const { php, h } = await handlerPromise;
          php.writeFile('/home/dev/public_html/api/index.php', readFileSync(apiFile, 'utf8')); // pick up edits
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const headers: Record<string, string> = {};
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers[k] = v;
          const response = await h.request({
            url: req.url,
            method: req.method as 'GET',
            headers,
            body: chunks.length ? new Uint8Array(Buffer.concat(chunks)) : undefined,
          });
          res.statusCode = response.httpStatusCode;
          for (const [k, v] of Object.entries(response.headers as Record<string, string[]>)) res.setHeader(k, v);
          res.end(Buffer.from(response.bytes));
        } catch (e) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Dev PHP failed: ${(e as Error).message}` }));
        }
      });
    },
  };
}
