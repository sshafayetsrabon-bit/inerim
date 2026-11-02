// Shared site copy. Used by the React pages and by the build-time prerender (scripts/prerender.ts),
// so search engines see the same words visitors do. Facts follow the INERIM onboarding document.
import { render } from './seed';

export const PAIN = [
  ['Tight budget?', 'Four packages, and every design is worked out around the number you give us.'],
  ['Limited space?', 'Space planning and custom storage that use every corner of a city apartment.'],
  ['Too many contractors?', 'One team coordinates suppliers, production and installation for you.'],
  ['Unsure about quality?', 'Materials are checked before purchase, and the work is inspected at every stage.'],
];

export const PROCESS = [
  ['Requirement analysis', 'We get to know your budget, lifestyle, space and design preferences, then agree on the brief and scope.'],
  ['Site visit & measurement', 'We check actual dimensions, wall measurements, utility points, existing conditions and installation needs.'],
  ['Design & materials', 'You see the layout, a 3D concept and the proposed materials before anything is produced.'],
  ['Quotation & approval', 'You get a written quotation with the scope, price, exclusions and timeline, ready for your approval.'],
  ['Confirmation & execution', 'Once terms are agreed, we produce to approved drawings, install, and check quality at each stage.'],
  ['Inspection & handover', 'We test every door, hinge and drawer, walk through the space with you, and hand over care instructions.'],
];

export const QC = [
  'Approved quotation & specifications verified',
  'Material type, thickness, finish & quantity checked before purchase',
  'Production follows approved measurements & drawings',
  'Board pasting, edge finishing & hardware fitting inspected',
  'Alignment, finishing & function checked on install',
  'Final inspection before handover',
];

export const FAQS = [
  ['How is the price calculated?', 'Our packages are priced per square foot. Your final price depends on project type, dimensions, design complexity, materials, hardware, finishing and installation needs, and is confirmed after we measure the site.'],
  ['Is the calculator price final?', 'No. It is an indicative estimate to help you plan. Full-apartment quotations are prepared project by project, after requirement analysis and site measurement.'],
  ['What is not included by default?', 'Your written quotation states clearly whether electrical work, plumbing, civil work, countertops and appliances are included or excluded.'],
  ['Can I buy materials only?', 'Yes. We supply HPL, acrylic and laminate sheets, offer board pasting, and provide panels, louvers, profile handles and glass profile frames. See the shop.'],
  ['Do you work on commercial projects?', 'Yes. We mainly serve homes, and also take on offices, showrooms, retail outlets, restaurants, cafés and conference rooms.'],
  ['What should I prepare for the first consultation?', 'Your project location, property size, a floor plan if you have one, the rooms and services you need, design references, an approximate budget and your timeline.'],
];

export const SERVICE_GROUPS = [
  {
    no: '01',
    title: 'Design',
    lead: 'Plan the space before anything gets built.',
    items: ['Interior design & space planning', '3D interior visualisation', 'Living, dining, bedroom & foyer interiors', 'Material & colour selection'],
    image: render(18, 'lg'),
    bg: '#ffffff',
  },
  {
    no: '02',
    title: 'Build',
    lead: 'Custom cabinets and furniture, made to your measurements.',
    items: ['Modular kitchen design & execution', 'Wardrobes & bedroom cabinets', 'TV cabinets, wall cabinets & custom storage', 'Custom furniture design & manufacturing'],
    image: render(27, 'lg'),
    bg: '#ebe5db',
  },
  {
    no: '03',
    title: 'Supply',
    lead: 'The finishing materials, supplied and pasted.',
    items: ['HPL, acrylic & laminate sheet supply', 'HPL / acrylic board pasting service', 'Decorative wall panels & louvers', 'Aluminium profile handles & glass profile frames'],
    image: render(15, 'lg'),
    bg: '#dbeae7',
  },
  {
    no: '04',
    title: 'Execute',
    lead: 'One coordinated team from sourcing to handover.',
    items: ['Project-based material sourcing', 'Installation & interior execution', 'Stage-by-stage quality checks', 'Final inspection & handover walkthrough'],
    image: render(21, 'lg'),
    bg: '#171614',
  },
];

export const SIGNATURE_ELEMENTS = ['Walnut veneer', 'Fluted panels', 'Decorative louvers', 'Brass strips', 'Marble-pattern surfaces', 'Arch designs', 'Glass & wood', 'Modular kitchens', 'Custom wardrobes'];

export const PARTNER_TYPES = [
  {
    id: 'Architect / Designer',
    title: 'Architects & interior designers',
    pitch: 'You design it, and we make and install it the way you drew it.',
    offers: ['Custom cabinets, wardrobes & furniture made to your drawings', 'HPL, acrylic & laminate supply with finish samples', 'Site measurement and installation by our team', 'One point of contact for production updates'],
    image: render(19),
  },
  {
    id: 'Developer / Real estate',
    title: 'Developers & real estate',
    pitch: 'Interior packages for show flats and handovers that help units sell.',
    offers: ['Package-based interiors for repeat unit types', 'Show-flat design, 3D visualisation and execution', 'Consistent specifications across buildings', 'Coordinated scheduling with your site team'],
    image: render(22),
  },
  {
    id: 'Dealer / Retailer',
    title: 'Material dealers & retailers',
    pitch: 'Add finishing materials and pasting services to your own range.',
    offers: ['HPL, acrylic & laminate sheet supply', 'HPL / acrylic board pasting service', 'Decorative panels & louvers', 'Aluminium profile handles & glass profile frames'],
    image: render(27),
  },
  {
    id: 'Contractor / Carpenter',
    title: 'Contractors & carpenters',
    pitch: 'Ready-pasted boards, profiles and hardware so your team builds faster.',
    offers: ['Board pasting with a clean, inspected finish', 'Profile handles, glass frames and brass strips', 'Help choosing finishes for your clients', 'Material sourcing for project-based work'],
    image: render(9),
  },
];

/** Title + description per static page (descriptions kept under ~155 characters so search results don't cut them). */
export const PAGE_META = {
  home: {
    title: 'INERIM Interior | Your Dream Space. Our Responsibility.',
    description: 'Modern interior design, modular kitchens, wardrobes, custom furniture and HPL/acrylic supply in Bangladesh. Packages from ৳1,350/sft. Get your price now.',
  },
  shop: {
    title: 'Shop furniture, sheets, panels & hardware',
    description: 'Modular furniture, HPL, acrylic and laminate sheets, wall panels, louvers and profile hardware from INERIM Interior. Add items and request a quote.',
  },
  pricing: {
    title: 'Interior design pricing & packages',
    description: 'INERIM interior packages from ৳1,350 to ৳2,350 per sq ft: Essential, Comfort, Elite and Signature. Estimate your interior cost instantly online.',
  },
  projects: {
    title: 'Interior design projects',
    description: 'Homes designed, built and installed by INERIM Interior in Bangladesh, room by room: living rooms, bedrooms, dining areas and modular kitchens.',
  },
  services: {
    title: 'Interior design, furniture & supply services',
    description: 'Space planning, 3D visualisation, modular kitchens, wardrobes, custom furniture, HPL/acrylic sheets, board pasting and installation in Bangladesh.',
  },
  about: {
    title: 'About INERIM Interior',
    description: 'INERIM designs and builds modern, premium interiors in Bangladesh around each client’s budget, lifestyle and space, with checks at every stage.',
  },
  contact: {
    title: 'Book a consultation',
    description: 'Book a studio meeting, site visit or video call with INERIM Interior in Dhaka. Call or WhatsApp +88 01603-000411, or send your project details online.',
  },
  partnership: {
    title: 'Partnership for architects & dealers',
    description: 'Partner with INERIM for HPL/acrylic supply, board pasting, custom cabinets and interior execution. For architects, developers, dealers and contractors.',
  },
  journal: {
    title: 'Journal: interior ideas & material guides',
    description: 'Practical advice on planning, materials and pricing from the INERIM studio: cabinet finishes, modular kitchens, storage and package pricing.',
  },
  colourStudio: {
    title: 'Colour Studio: try colours on real rooms',
    description: 'Choose wall paint, upholstery and fabric colours and see them on real INERIM room renders with true light and shadow. Download or share your look.',
  },
} as const;
