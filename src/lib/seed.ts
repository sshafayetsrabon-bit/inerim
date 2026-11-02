// Starter content. Everything here can be edited, replaced or deleted from the CMS at /admin.
// Products and posts flagged `sample: true` are placeholders: prices are deliberately left
// "on request" until INERIM enters real figures.
import type { Colour, Content, Post, Product, Project, Settings } from './types';

export const render = (n: number, size: 'sm' | 'lg' = 'sm') => `/designs/${size === 'sm' ? 'sm/' : ''}d${String(n).padStart(2, '0')}.jpg`;

export const CATEGORIES = ['Furniture', 'Kitchen & Storage', 'Sheets & Boards', 'Panels & Louvers', 'Hardware & Profiles', 'Services'];

const WOODS = [
  { name: 'Natural Walnut', hex: '#6b4a33', texture: 'wood' as const },
  { name: 'Light Oak', hex: '#c9a57a', texture: 'wood' as const },
  { name: 'Smoked Ash', hex: '#8a7a6b', texture: 'wood' as const },
];
const GLOSS = [
  { name: 'Pure White', hex: '#f4f2ee', texture: 'gloss' as const },
  { name: 'Greige', hex: '#cbbfb2', texture: 'gloss' as const },
  { name: 'Mocha', hex: '#7a5f4e', texture: 'gloss' as const },
  { name: 'Slate Grey', hex: '#7b7f84', texture: 'gloss' as const },
  { name: 'Midnight Blue', hex: '#253247', texture: 'gloss' as const },
  { name: 'Emerald', hex: '#1f5a4a', texture: 'gloss' as const },
];
const METALS = [
  { name: 'Matte Black', hex: '#222222', texture: 'metal' as const },
  { name: 'Brushed Gold', hex: '#c6a15b', texture: 'metal' as const },
  { name: 'Champagne', hex: '#d8c3a0', texture: 'metal' as const },
  { name: 'Silver', hex: '#b9bcc0', texture: 'metal' as const },
];
const FABRICS = [
  { name: 'Dusty Rose', hex: '#b97f7c', texture: 'fabric' as const },
  { name: 'Sage', hex: '#8f9f82', texture: 'fabric' as const },
  { name: 'INERIM Teal', hex: '#0b7875', texture: 'fabric' as const },
  { name: 'Mustard', hex: '#c99a3b', texture: 'fabric' as const },
  { name: 'Powder Blue', hex: '#8ba3c1', texture: 'fabric' as const },
  { name: 'Charcoal', hex: '#4a4a4c', texture: 'fabric' as const },
  { name: 'Sand', hex: '#d6c4aa', texture: 'fabric' as const },
];

const made = [
  { label: 'Made to measure', value: 'Yes, built to your site dimensions' },
  { label: 'Price', value: 'Confirmed in your written quotation' },
];

const p = (o: Partial<Product> & Pick<Product, 'id' | 'name' | 'category' | 'summary'>): Product => ({
  slug: o.id,
  description: '',
  price: null,
  unit: 'piece',
  images: [],
  finishes: [],
  specs: made,
  tags: [],
  featured: false,
  inStock: true,
  sample: true,
  ...o,
});

export const SEED_PRODUCTS: Product[] = [
  p({
    id: 'velvet-shell-dining-chair',
    name: 'Velvet Shell Dining Chair',
    category: 'Furniture',
    summary: 'A curved shell-back dining chair in soft velvet, on slim black legs.',
    description:
      'The curved back hugs you through a long dinner, and the slim black legs keep it light in a compact dining space.\n\nPick a fabric colour above to see it on the chair. Fabric options are confirmed when you order.',
    images: ['/products/dining-chair.jpg', '/products/dining-set.jpg'],
    mask: '/products/dining-chair-mask.png',
    maskLum: 0.38,
    finishes: FABRICS,
    featured: true,
    tags: ['dining', 'upholstered'],
  }),
  p({
    id: 'marble-look-dining-set',
    name: 'Marble-look Dining Set',
    category: 'Furniture',
    summary: 'A marble-pattern table with six velvet shell chairs, made to fit your dining area.',
    description: 'A marble-pattern table top on a dark metal base, with six matching shell chairs. The table size is set to your room and walkways.',
    images: ['/products/dining-set.jpg', '/products/crockery.jpg'],
    mask: '/products/dining-set-mask.png',
    maskLum: 0.38,
    finishes: FABRICS,
    unit: 'set',
    featured: true,
    tags: ['dining', 'marble'],
  }),
  p({
    id: 'scallop-headboard-kids-bed',
    name: 'Scallop Headboard Kids Bed',
    category: 'Furniture',
    summary: 'A playful scalloped, upholstered headboard that runs the full width of the wall.',
    description: 'Soft scalloped panels make the headboard a feature wall, and the upholstered base keeps edges child-friendly.',
    images: ['/products/kids-bed.jpg', '/products/window-seat.jpg'],
    mask: '/products/kids-bed-mask.png',
    maskLum: 0.41,
    finishes: FABRICS,
    featured: true,
    tags: ['kids', 'bedroom'],
  }),
  p({
    id: 'floating-bed-cove-light',
    name: 'Floating Bed with Cove Light',
    category: 'Furniture',
    summary: 'A platform bed that seems to float, lit from below with a warm LED cove.',
    images: ['/products/floating-bed.jpg'],
    finishes: WOODS,
    featured: true,
    tags: ['bedroom', 'lighting'],
  }),
  p({
    id: 'lounge-sofa-set',
    name: 'Lounge Sofa Set',
    category: 'Furniture',
    summary: 'A deep-seated sofa arrangement for the living room, upholstered to order.',
    images: ['/products/sofa.jpg'],
    finishes: FABRICS,
    unit: 'set',
    tags: ['living'],
  }),
  p({
    id: 'u-shaped-modular-kitchen',
    name: 'U-shaped Modular Kitchen',
    category: 'Kitchen & Storage',
    summary: 'Shaker-profile shutters, lit glass-front uppers and a marble-look backsplash.',
    description: 'A U-shaped layout gives you the most counter space and storage in a typical apartment kitchen. Countertops and appliances are quoted separately.',
    images: ['/products/u-kitchen.jpg'],
    finishes: GLOSS,
    unit: 'project',
    featured: true,
    tags: ['kitchen', 'modular'],
  }),
  p({
    id: 'gloss-wardrobe-display-niche',
    name: 'Gloss Wardrobe with Display Niche',
    category: 'Kitchen & Storage',
    summary: 'A floor-to-ceiling gloss wardrobe with lit open shelving and a built-in vanity.',
    images: ['/products/gloss-wardrobe.jpg', '/products/master-wardrobe.jpg'],
    finishes: GLOSS,
    featured: true,
    tags: ['wardrobe', 'bedroom'],
  }),
  p({
    id: 'louvred-wardrobe',
    name: 'Louvred Wardrobe',
    category: 'Kitchen & Storage',
    summary: 'Textured louvre-panel shutters with full-height aluminium profile handles.',
    images: ['/products/louvre-wardrobe.jpg'],
    finishes: [...GLOSS.slice(0, 4), ...WOODS.slice(0, 1)],
    tags: ['wardrobe'],
  }),
  p({
    id: 'glass-crockery-unit',
    name: 'Glass Crockery Unit',
    category: 'Kitchen & Storage',
    summary: 'A lit glass-front display unit for crockery, with closed storage below.',
    images: ['/products/crockery.jpg'],
    finishes: GLOSS,
    tags: ['dining', 'storage'],
  }),
  p({
    id: 'floating-vanity-backlit-mirror',
    name: 'Floating Vanity & Backlit Mirror',
    category: 'Kitchen & Storage',
    summary: 'A wall-hung vanity with under-glow lighting and an organic backlit mirror.',
    images: ['/products/vanity.jpg'],
    finishes: GLOSS.slice(0, 4),
    tags: ['bath', 'lighting'],
  }),
  p({
    id: 'tv-wall-unit',
    name: 'TV Wall Unit',
    category: 'Kitchen & Storage',
    summary: 'A wave-fluted TV wall with floating media storage and concealed wiring.',
    images: ['/products/tv-unit.jpg'],
    finishes: [...GLOSS.slice(0, 3), ...WOODS],
    featured: true,
    tags: ['living', 'fluted'],
  }),
  p({
    id: 'study-desk-wall-storage',
    name: 'Study Desk & Wall Storage',
    category: 'Kitchen & Storage',
    summary: 'A compact wall-mounted study desk with overhead cabinets and a lit shelf.',
    images: ['/products/kids-study.jpg'],
    finishes: GLOSS,
    tags: ['kids', 'study'],
  }),
  p({
    id: 'hpl-sheet',
    name: 'HPL Sheet',
    category: 'Sheets & Boards',
    summary: 'High-pressure laminate in wood, solid and marble-look finishes for cabinets and panels.',
    description: 'HPL is a hard-wearing surface that suits kitchen shutters, wardrobes and wall panels. Ask us for the current finish catalogue and stock.',
    finishes: [...WOODS, { name: 'Frost White', hex: '#eeece8', texture: 'solid' }, { name: 'Statuario', hex: '#ece9e4', texture: 'marble' }, { name: 'Nero Marble', hex: '#2b2a2a', texture: 'marble' }],
    unit: 'sheet',
    featured: true,
    tags: ['supply', 'hpl'],
  }),
  p({
    id: 'acrylic-high-gloss-sheet',
    name: 'Acrylic High-Gloss Sheet',
    category: 'Sheets & Boards',
    summary: 'Mirror-like acrylic in rich colours: the finish behind our gloss wardrobes and kitchens.',
    finishes: GLOSS,
    unit: 'sheet',
    featured: true,
    tags: ['supply', 'acrylic'],
  }),
  p({
    id: 'laminate-sheet',
    name: 'Laminate Sheet',
    category: 'Sheets & Boards',
    summary: 'An everyday laminate range in woodgrains and solids for budget-friendly furniture.',
    finishes: [...WOODS, { name: 'Ivory', hex: '#ede4d3', texture: 'solid' }, { name: 'Ash Grey', hex: '#9b9b98', texture: 'solid' }],
    unit: 'sheet',
    tags: ['supply', 'laminate'],
  }),
  p({
    id: 'board-pasting-service',
    name: 'HPL / Acrylic Board Pasting',
    category: 'Services',
    summary: 'We press your chosen HPL or acrylic sheet onto board, ready for cutting and edging.',
    description: 'Bring your boards, or source them through us. We paste HPL or acrylic sheets onto them with a clean, bubble-free finish, then inspect the result before it leaves.',
    finishes: GLOSS.slice(0, 3),
    unit: 'board',
    featured: true,
    tags: ['service', 'pasting'],
  }),
  p({
    id: 'fluted-wall-panel',
    name: 'Fluted Wall Panel',
    category: 'Panels & Louvers',
    summary: 'Vertical fluted panels that add rhythm and texture to bed walls and TV walls.',
    images: ['/products/moon-panel.jpg'],
    finishes: [...WOODS, { name: 'Soft White', hex: '#e9e4dc', texture: 'solid' }],
    unit: 'sft',
    featured: true,
    tags: ['panel', 'fluted'],
  }),
  p({
    id: 'decorative-louvers',
    name: 'Decorative Louvers',
    category: 'Panels & Louvers',
    summary: 'Slatted louvers for partitions, ceilings and feature walls.',
    finishes: WOODS,
    unit: 'rft',
    tags: ['panel', 'louver'],
  }),
  p({
    id: 'arch-feature-wall',
    name: 'Arch Feature Wall',
    category: 'Panels & Louvers',
    summary: 'A wood-panelled arch with brass strips and an art panel inside.',
    images: ['/products/arch-wall.jpg'],
    finishes: WOODS,
    unit: 'project',
    tags: ['arch', 'brass'],
  }),
  p({
    id: 'aluminium-profile-handle',
    name: 'Aluminium Profile Handle',
    category: 'Hardware & Profiles',
    summary: 'Slim edge-profile handles for a clean, handle-less look on shutters and wardrobes.',
    finishes: METALS,
    unit: 'rft',
    tags: ['hardware', 'handle'],
  }),
  p({
    id: 'glass-profile-frame',
    name: 'Glass Profile Shutter Frame',
    category: 'Hardware & Profiles',
    summary: 'Aluminium frames for glass shutters on crockery units, wardrobes and partitions.',
    finishes: METALS,
    unit: 'rft',
    featured: true,
    tags: ['hardware', 'glass'],
  }),
  p({
    id: 'brass-inlay-strip',
    name: 'Brass Inlay Strip',
    category: 'Hardware & Profiles',
    summary: 'Fine metal strips inlaid into panels and arches: the signature INERIM detail.',
    finishes: [{ name: 'Brass', hex: '#b8914f', texture: 'metal' }, { name: 'Rose Gold', hex: '#c99482', texture: 'metal' }, METALS[0]],
    unit: 'rft',
    tags: ['hardware', 'brass'],
  }),
];

export const SEED_POSTS: Post[] = [
  {
    id: 'hpl-vs-acrylic-vs-laminate',
    slug: 'hpl-vs-acrylic-vs-laminate',
    title: 'HPL, acrylic or laminate: choosing the right cabinet finish',
    excerpt: 'Three finishes, three personalities. Here is how to choose for your kitchen and wardrobes.',
    cover: render(27),
    category: 'Materials',
    author: 'INERIM Studio',
    date: '2026-09-28',
    readMinutes: 4,
    published: true,
    sample: true,
    body: `Your cabinet shutters are the biggest surface in a kitchen or bedroom, so the finish sets the mood of the whole room.

## Acrylic: the high-gloss statement
Acrylic gives a deep, mirror-like shine that bounces light around a room. It suits modern kitchens and wardrobes where you want a premium, seamless look. Gloss shows fingerprints more than matte, so it rewards a quick wipe now and then.

## HPL: the hard-working all-rounder
High-pressure laminate stands up well to daily use and comes in convincing woodgrains, solids and stone looks. It is a strong choice for busy family kitchens and for anywhere you want a wood-look without real veneer.

## Laminate: smart on a budget
Standard laminates cover a wide range of colours and woodgrains at a friendlier price. They are ideal for secondary rooms, kids' rooms and storage that does not take heavy wear.

## Mixing them
Many of our designs combine finishes: acrylic on the doors you see first, HPL where hands and pans meet, and laminate inside. Ask us for samples. Seeing a finish in your own light makes the choice easy.`,
  },
  {
    id: 'modular-kitchen-small-apartment',
    slug: 'modular-kitchen-small-apartment',
    title: 'Planning a modular kitchen for a compact apartment',
    excerpt: 'Layouts, storage tricks and the questions to answer before you get a quotation.',
    cover: render(28),
    category: 'Space Planning',
    author: 'INERIM Studio',
    date: '2026-09-14',
    readMinutes: 5,
    published: true,
    sample: true,
    body: `A good kitchen layout is mostly about the distance between where you store, wash and cook.

## Pick the right shape
- **U-shaped** layouts give the most counter space and storage in a typical apartment kitchen.
- **L-shaped** layouts open up a corner for a small dining spot.
- **Parallel** layouts suit long, narrow kitchens.

## Go vertical
Tall units and upper cabinets that run to the ceiling stop dust gathering on top and add a surprising amount of storage. Glass-front uppers with a strip of light keep a small kitchen from feeling closed in.

## Decide what is in scope
Before you compare quotations, be clear whether countertops, appliances, plumbing and electrical points are included. At INERIM we list these clearly in every quotation, so you are comparing like with like.

## Measure first
Every wall, window and utility point affects the design. That is why a site measurement comes before a final price.`,
  },
  {
    id: 'how-package-pricing-works',
    slug: 'how-package-pricing-works',
    title: 'How our per-square-foot package pricing works',
    excerpt: 'Essential, Comfort, Elite and Signature: what the rate means and what changes the final price.',
    cover: render(17),
    category: 'Guides',
    author: 'INERIM Studio',
    date: '2026-08-30',
    readMinutes: 3,
    published: true,
    sample: true,
    body: `Our four packages give you a clear starting point before you even meet us.

## Four levels
**Essential**, **Comfort**, **Elite** and **Signature** each have a per-square-foot rate. Multiply the rate by your area and you have a planning figure. Our online calculator does this instantly.

## What moves the final number
Your final price depends on project type, dimensions, design complexity, the materials and hardware you choose, finishing, and what installation needs. These are confirmed after we measure your site.

## What is quoted separately
Electrical work, plumbing, civil work, countertops and appliances are listed clearly in your quotation as included or excluded, so nothing comes as a surprise.

## The steps
1. Tell us your requirements and approximate budget.
2. We assess the dimensions and scope.
3. We finalise the design concept and materials together.
4. You receive a package-based or customised quotation.
5. Scope and commercial terms are confirmed after your approval.`,
  },
  {
    id: 'storage-small-flat',
    slug: 'storage-small-flat',
    title: 'Five ways to find more storage in a small flat',
    excerpt: 'Window seats, full-height wardrobes and other space-saving ideas from our recent projects.',
    cover: render(6),
    category: 'Space Planning',
    author: 'INERIM Studio',
    date: '2026-08-12',
    readMinutes: 4,
    published: true,
    sample: true,
    body: `City apartments rarely have space to spare. These five ideas come straight from our recent designs.

## 1. Window seats with drawers
A window seat gives you a reading nook on top and deep drawers underneath, in space that usually goes unused.

## 2. Floor-to-ceiling wardrobes
Taking a wardrobe all the way up adds a full row of storage for luggage and seasonal clothes.

## 3. Built-in study corners
A wall-mounted desk with overhead cabinets fits a workspace into a bedroom without crowding it.

## 4. Lit display niches
A few open, lit shelves inside a wardrobe wall show off favourite things and break up a large run of doors.

## 5. Laundry built into cabinetry
Building the washing machine into a dining or kitchen unit keeps it out of sight and makes the space feel calmer.`,
  },
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'residence-01',
    slug: 'residence-01',
    title: 'Residence 01: Full Apartment Interior',
    category: 'Residential',
    location: '',
    area: '',
    year: '2026',
    cover: render(17, 'lg'),
    summary:
      'A complete apartment designed room by room: an arched living room with brass detailing, a blush master suite, a playful kids’ room, a marble-look dining area and a U-shaped modular kitchen.',
    highlights: ['Arch feature walls with brass strips', 'Fluted and louvred panels', 'Gloss wardrobes with lit niches', 'U-shaped modular kitchen'],
    featured: true,
    rooms: [
      { name: 'Living Room', note: 'Arch wall, stone cladding and a fluted-glass partition.', images: [17, 18, 19, 20, 26].map((n) => render(n, 'lg')) },
      { name: 'Master Bedroom', note: 'Floating bed, wood-texture wall and a gloss wardrobe.', images: [7, 8, 9, 10, 11, 12].map((n) => render(n, 'lg')) },
      { name: 'Guest Bedroom', note: 'Back-lit moon feature in a fluted wall.', images: [13, 14, 15, 16].map((n) => render(n, 'lg')) },
      { name: "Kids' Room", note: 'Scalloped headboard, window seat and study corner.', images: [1, 2, 3, 4, 5, 6].map((n) => render(n, 'lg')) },
      { name: 'Dining', note: 'Marble-look table under a lit glass crockery unit.', images: [21, 22, 23, 25, 24].map((n) => render(n, 'lg')) },
      { name: 'Modular Kitchen', note: 'Shaker shutters and lit glass uppers.', images: [27, 28].map((n) => render(n, 'lg')) },
    ],
  },
];

export const SEED_COLOURS: Colour[] = [
  ['Linen White', '#efe9df', 'Neutrals'],
  ['Warm Greige', '#cdbfae', 'Neutrals'],
  ['Mushroom', '#a89a8a', 'Neutrals'],
  ['Stone Grey', '#9a9a94', 'Neutrals'],
  ['Charcoal', '#3f4144', 'Neutrals'],
  ['Blush', '#d9a9a0', 'Earth & Blush'],
  ['Dusty Rose', '#b97f7c', 'Earth & Blush'],
  ['Terracotta', '#b5603f', 'Earth & Blush'],
  ['Clay', '#a87458', 'Earth & Blush'],
  ['Mocha', '#6f5546', 'Earth & Blush'],
  ['Sage', '#9cab8e', 'Greens'],
  ['Olive', '#6e7350', 'Greens'],
  ['Eucalyptus', '#5f7f73', 'Greens'],
  ['INERIM Teal', '#0b7875', 'Greens'],
  ['Forest', '#2f4a3a', 'Greens'],
  ['Powder Blue', '#a9bcd0', 'Blues'],
  ['Dusk Blue', '#6e86a3', 'Blues'],
  ['Denim', '#48607e', 'Blues'],
  ['Navy', '#22324a', 'Blues'],
  ['Butter', '#e8d49a', 'Warm'],
  ['Mustard', '#c99a3b', 'Warm'],
  ['Ochre', '#b07c2c', 'Warm'],
].map(([name, hex, family]) => ({ id: name.toLowerCase().replace(/\W+/g, '-'), name, hex, family }));

export const SEED_SETTINGS: Settings = {
  phone: '+88 01603-000411',
  whatsapp: '8801603000411',
  email: 'hello@inerimbd.com',
  address: 'Dhaka, Bangladesh',
  hours: 'Sat – Thu, 10am – 7pm',
  facebook: '',
  instagram: '',
  youtube: '',
  announcement: 'Packages from ৳1,350/sft. See your price instantly with our calculator.',
  packages: [
    { id: 'essential', name: 'Essential', rate: 1350, tone: 'Smart & functional', bestFor: 'First homes and practical makeovers that need clean, modern, hard-working interiors.', image: render(3) },
    { id: 'comfort', name: 'Comfort', rate: 1650, tone: 'The balanced upgrade', bestFor: 'Families who want more storage detailing and richer textures without overspending.', image: render(10) },
    { id: 'elite', name: 'Elite', rate: 1900, tone: 'Premium combinations', bestFor: 'Homes that want a statement: feature walls, layered lighting, glass and wood together.', image: render(13) },
    { id: 'signature', name: 'Signature', rate: 2350, tone: 'Our flagship', bestFor: 'A fully customised home with INERIM’s signature walnut, brass and marble-look detailing.', image: render(17) },
  ],
};

export const SEED: Content = {
  settings: SEED_SETTINGS,
  products: SEED_PRODUCTS,
  posts: SEED_POSTS,
  projects: SEED_PROJECTS,
  colours: SEED_COLOURS,
};
