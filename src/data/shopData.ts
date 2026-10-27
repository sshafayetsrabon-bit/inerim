export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  shortDescription: string;
  description: string;
  dimensions: string;
  materials: string[];
  features: string[];
  images: string[];
  warranty: string;
  deliveryTime: string;
}

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'floating-bed-cove-light',
    slug: 'floating-bed-cove-light',
    name: 'Floating King Bed with Ambient Cove Light',
    category: 'Bedroom Joinery',
    price: 85000,
    originalPrice: 95000,
    badge: 'Signature Piece',
    shortDescription: 'Cantilevered architectural floating platform bed with 3000K warm circadian LED cove lighting.',
    description:
      'Engineered with a concealed steel-reinforced subframe, the INERIM Floating Bed creates the mesmerizing illusion of weightlessness. Integrated 3000K warm perimeter cove lighting illuminates the floor with zero glare, creating the ultimate evening retreat. Built using moisture-resistant Action TESA HDHMR and Italian walnut veneer.',
    dimensions: '78" W × 84" L × 42" H (Mattress 72" × 78")',
    materials: ['Action TESA HDHMR Core', 'Italian Walnut Veneer', 'Powder-coated Steel Subframe', 'Philips Warm LED Strip'],
    features: ['Concealed wire management', 'Soft-touch upholstered backrest', 'Integrated wireless phone charging docks', 'Zero floor touch cantilever'],
    images: ['/products/floating-bed.jpg', '/designs/d18.jpg'],
    warranty: '5-Year Structural Warranty',
    deliveryTime: '21 Working Days',
  },
  {
    id: 'scallop-headboard-kids-bed',
    slug: 'scallop-headboard-kids-bed',
    name: 'Scallop Headboard Bed with Integrated Storage',
    category: 'Kids & Youth',
    price: 62000,
    badge: 'Bestseller',
    shortDescription: 'Playful yet architectural scalloped profile bed with hydraulic under-bed mattress lift.',
    description:
      'Designed for growing children and teen rooms, this bed pairs an architectural scalloped headboard with heavy-duty gas hydraulic lift storage. Upholstered in spill-resistant, anti-stain velvet with rounded child-safe radius edges throughout.',
    dimensions: '54" W × 78" L × 48" H (Mattress 48" × 72")',
    materials: ['Anti-Stain Performance Velvet', 'E1 Low-VOC Board', 'Heavy-duty German Hydraulic Gas Struts'],
    features: ['Child-safe rounded corner detailing', 'Deep dust-free hydraulic under-bed cavity', 'Reinforced slatted base'],
    images: ['/products/kids-bed.jpg', '/products/kids-study.jpg'],
    warranty: '3-Year Warranty',
    deliveryTime: '18 Working Days',
  },
  {
    id: 'velvet-shell-dining-chair',
    slug: 'velvet-shell-dining-chair',
    name: 'Velvet Shell Ergonomic Dining Chair',
    category: 'Dining & Seating',
    price: 14500,
    originalPrice: 16500,
    badge: 'Popular',
    shortDescription: 'Sculptural curved shell chair wrapped in high-density foam and tactile velvet.',
    description:
      'The Velvet Shell Dining Chair blends mid-century organic curves with contemporary architectural lightness. Features high-resilience memory foam support with matte black or brushed brass steel legs.',
    dimensions: '22" W × 24" D × 32" H (Seat Height 18")',
    materials: ['Brushed Brass Plated Steel', 'High-Density 40-Density Foam', 'Commercial-Grade Performance Velvet'],
    features: ['Ergonomic lumbar support curve', 'Scratch-resistant floor glide feet', 'Tested to 150kg load capacity'],
    images: ['/products/dining-chair.jpg', '/products/dining-set.jpg'],
    warranty: '2-Year Warranty',
    deliveryTime: '7 - 10 Working Days',
  },
  {
    id: 'marble-look-dining-set',
    slug: 'marble-look-dining-set',
    name: 'Statuario Marble-Look 6-Seater Dining Set',
    category: 'Dining & Seating',
    price: 125000,
    originalPrice: 140000,
    badge: 'Luxury Suite',
    shortDescription: 'Engineered sintered stone tabletop with champagne brass frame and 6 matching shell chairs.',
    description:
      'Non-porous, heat-proof, and scratch-resistant sintered stone tabletop mimicking natural Italian Statuario marble. Paired with a geometric chamfered steel base and 6 matching dining chairs.',
    dimensions: '72" L × 36" W × 30" H',
    materials: ['12mm Sintered Porcelain Stone', 'Electroplated Champagne Brass PVD Frame'],
    features: ['Stain and heat proof up to 1200°C', 'Seats 6 to 8 comfortably', 'Zero maintenance sealing required'],
    images: ['/products/dining-set.jpg', '/products/crockery.jpg'],
    warranty: '5-Year Finish Warranty',
    deliveryTime: '15 Working Days',
  },
  {
    id: 'louvre-wardrobe',
    slug: 'louvre-wardrobe',
    name: 'Architectural Louvre Floor-to-Ceiling Wardrobe',
    category: 'Wardrobes & Storage',
    price: 145000,
    badge: 'Custom Sized',
    shortDescription: 'Ventilated slatted louvre timber doors with Blum Sensys soft-close hardware and warm LED sensors.',
    description:
      'Inspired by tropical modernism, this floor-to-ceiling modular wardrobe allows continuous air circulation to protect delicate luxury garments in Bangladesh’s humid climate. Fitted with automated sensor lights and modular internal organizers.',
    dimensions: 'Custom width × 96" H × 24" D',
    materials: ['Solid Teak Wood Slats', 'Moisture-proof Action TESA HDHMR', 'Blum CLIP top BLUMOTION Hinges'],
    features: ['Natural air ventilation slats', 'Automatic wardrobe sensor illumination', 'Full extension pull-out trouser racks'],
    images: ['/products/louvre-wardrobe.jpg', '/products/gloss-wardrobe.jpg'],
    warranty: '5-Year Warranty',
    deliveryTime: '25 Working Days',
  },
  {
    id: 'modular-u-kitchen',
    slug: 'modular-u-kitchen',
    name: 'Bespoke Acrylic U-Shaped Modular Kitchen',
    category: 'Modular Kitchens',
    price: 240000,
    originalPrice: 275000,
    badge: 'Turnkey Package',
    shortDescription: 'High-gloss anti-scratch acrylic shutters, Blum Tandembox drawers, and quartz countertops.',
    description:
      'Engineered for intensive culinary use with high-gloss 2mm European acrylic shutters, waterproof marine-grade plywood carcass, and heavy-duty Blum soft-close pullout larders. Includes quartz composite anti-bacterial countertop.',
    dimensions: 'Tailored to site measurements (Typical 12ft × 10ft U-Layout)',
    materials: ['Marine Ply Core Grade 710', 'Senosan Austrian Acrylic 2mm', 'Blum Tandembox Antaro', 'Engineered Quartz'],
    features: ['100% waterproof carcass', 'Zero finger-joint delamination guarantee', 'Integrated built-in oven & hob provisions'],
    images: ['/products/u-kitchen.jpg', '/designs/d01.jpg'],
    warranty: '10-Year Water Resistance Warranty',
    deliveryTime: '30 Working Days',
  },
];
