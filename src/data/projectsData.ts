import { Project } from '../types';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'sinthia-chowdhury-residence',
    title: "Mrs. Sinthia Chowdhury's Residence",
    client: 'Sinthia Chowdhury (Tech Entrepreneur)',
    category: 'residential',
    subCategory: 'Luxury Duplex Apartment',
    location: 'Gulshan Diplomatic Zone, Dhaka',
    area: '3,850 sq.ft',
    completionTime: '44 Days',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A seamless blend of warm Japandi minimalism and Scandinavian serenity. Designed for a modern entrepreneur family seeking calm acoustic balance, natural walnut accents, and custom concealed storage throughout.',
    highlights: [
      'Custom fluted walnut wall panels with indirect 3000K warm LED channels',
      'Italian Statuario marble dining focal island with brass inlays',
      'Acoustically isolated study pod integrated into the master library',
      'Smart circadian lighting automation throughout living zones'
    ],
    materials: ['American Walnut', 'Statuario Marble', 'Blum Aventos Hardware', 'Microcement Flooring', 'Low-VOC Matte Emulsion'],
    style: 'Warm Japandi & Modern Organic',
    testimonialQuote: 'Inerim delivered our complete duplex in 44 days without a single compromise on finish quality. The concealed joinery is world-class.',
    featured: true
  },
  {
    id: 'iftekhar-grand-penthouse',
    title: "Mr. Iftekhar's Grand Penthouse",
    client: 'Engr. Iftekhar Ahmed',
    category: 'residential',
    subCategory: 'Sky Penthouse & Terrace',
    location: 'Banani Lakefront, Dhaka',
    area: '4,500 sq.ft',
    completionTime: '45 Days',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Panoramic skyline living executed with clean geometric lines, smoked glass partitions, and bespoke architectural cove ceilings.',
    highlights: [
      'Double-height formal lounge with cantilevered brass chandelier',
      'Modular German kitchen with touch-to-open servo-drive cabinets',
      'Private glass conservatory overlooking lake view'
    ],
    materials: ['Smoked Oak', 'Bronze Mirror', 'Brushed Champagne Gold', 'Quartz Countertops'],
    style: 'Modern Contemporary Luxury',
    testimonialQuote: 'The team handled everything from 3D renders to the final vacuuming before handover. Flawless execution.',
    featured: true
  },
  {
    id: 'hasnat-modern-apartment',
    title: "Mr. Hasnat's Contemporary Flat",
    client: 'Mr. Hasnat & Family',
    category: 'residential',
    subCategory: 'Urban Family Home',
    location: 'Dhanmondi Heritage District',
    area: '2,650 sq.ft',
    completionTime: '40 Days',
    year: '2024',
    heroImage: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Compact space optimization featuring dual-purpose bespoke furniture, bright neutral earth tones, and warm organic textures.',
    highlights: [
      'Bespoke TV media console with hidden wiring and magnetic latches',
      'Kid-friendly rounded edge woodwork with non-toxic botanical oil finishes',
      'Custom window bay daybeds with integrated under-seat storage'
    ],
    materials: ['Natural Birch Plywood', 'Linen Textiles', 'Warm Terrazzo', 'Brushed Nickel'],
    style: 'Scandinavian Minimalist',
    testimonialQuote: 'Every corner of our 2,650 sq.ft apartment is now both aesthetically peaceful and deeply practical.',
    featured: true
  },
  {
    id: 'bettex-bd-office',
    title: 'Bettex BD Corporate Headquarters',
    client: 'Bettex Global Ltd.',
    category: 'commercial',
    subCategory: 'Corporate Headquarters',
    location: 'Tejgaon Industrial Commercial Hub',
    area: '8,200 sq.ft',
    completionTime: '45 Days',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An open-collaboration corporate space engineered for high productivity, featuring biophilic green walls, acoustic felt baffles, and private focus pods.',
    highlights: [
      '60-person open workstation layout with ergonomic height-adjustable desks',
      'Boardroom with 4K interactive display integration and hidden acoustic baffling',
      'Lush indoor vertical garden and central barista-style breakout cafe'
    ],
    materials: ['Industrial Black Steel', 'White Oak Millwork', 'Acoustic PET Felt', 'Polished Concrete'],
    style: 'Modern Biophilic Corporate',
    testimonialQuote: 'Inerim completed our 8,200 sq.ft corporate hub on the exact 45th day promised. Our employee satisfaction leaped immediately.',
    featured: true
  },
  {
    id: 'funded-next-hq',
    title: 'Funded Next Innovation Studio',
    client: 'Next Venture Holdings',
    category: 'commercial',
    subCategory: 'FinTech Tech Hub',
    location: 'Gulshan 2 Tech Park',
    area: '10,500 sq.ft',
    completionTime: '52 Days',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A cutting-edge tech campus with dark mode accents, vibrant neon identity zones, 24/7 trading war-rooms, and relaxing wellness lounges.',
    highlights: [
      'Triple-glazed soundproof podcast and recording broadcast studios',
      'Modular amphitheater for all-hands engineering demos',
      'Smart badge-operated executive wing with biometric privacy glass'
    ],
    materials: ['Anodized Matte Charcoal Aluminum', 'LED Neon Accent Ribbons', 'Hard Rock Maple'],
    style: 'Futuristic High-Tech & Minimalist',
    testimonialQuote: 'Inerim transformed our 10,000+ sq.ft office with exceptional speed and precision. Their project management is unparalleled.',
    featured: true
  },
  {
    id: 'one-little-web-studio',
    title: 'One Little Web Creative Agency',
    client: 'One Little Web Co.',
    category: 'commercial',
    subCategory: 'Digital Agency Office',
    location: 'Banani Creative Quarter',
    area: '7,000 sq.ft',
    completionTime: '42 Days',
    year: '2024',
    heroImage: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A vibrant yet minimal digital agency workplace balancing open brainstorming islands with intimate design retreat booths.',
    highlights: [
      'Bespoke curved meeting pods inspired by organic sculpture',
      'Custom pegboard equipment walls and client presentation showcase',
      'Warm ambient floor-to-ceiling wooden dividers'
    ],
    materials: ['Baltic Birch', 'Charcoal Acoustic Panels', 'Brass Hardware', 'Textured Plaster'],
    style: 'Industrial Loft & Warm Scandinavian',
    testimonialQuote: 'Delivered our 7,000 sq.ft office project right on schedule, with creative space-efficient solutions throughout.',
    featured: true
  },
  {
    id: 'al-faisal-villa',
    title: 'The Al-Faisal Lake Residence',
    client: 'Al-Faisal Private Residence',
    category: 'residential',
    subCategory: 'Private Villa',
    location: 'Baridhara Diplomatic Enclave',
    area: '6,200 sq.ft',
    completionTime: '60 Days',
    year: '2024',
    heroImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An architectural tribute to monolithic stone, floating staircases, and seamless indoor-outdoor courtyards.',
    highlights: [
      'Custom wine cellar and tasting lounge with climate-controlled glass',
      'Spa bathroom with freestanding volcanic limestone soaking tub',
      'Integrated hidden AV home theater with Dolby Atmos tuning'
    ],
    materials: ['Travertine Stone', 'Solid Teakwood', 'Bronze Hardware', 'Hand-knotted Silks'],
    style: 'Modern Monolithic Luxury',
    testimonialQuote: 'The level of detail Inerim puts into custom stone cuts and concealed lighting is second to none.',
    featured: false
  },
  {
    id: 'lumina-boutique-retail',
    title: 'Lumina Luxury Flagship Store',
    client: 'Lumina Apparel Group',
    category: 'commercial',
    subCategory: 'Boutique Retail & Showroom',
    location: 'Gulshan Avenue Retail Mile',
    area: '3,200 sq.ft',
    completionTime: '35 Days',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An ethereal retail gallery where minimalist plaster arches and gallery-grade spotlighting highlight seasonal apparel collections.',
    highlights: [
      'Sculptural curved microcement display plinths',
      'VIP lounge fitting suite with customizable light temperature settings',
      'Frameless glass facade entrance with concealed magnetic pivots'
    ],
    materials: ['Microcement', 'Brushed Brass', 'Fluted Glass', 'Italian Terrazzo'],
    style: 'Minimalist Gallery Retail',
    testimonialQuote: 'Sales increased by 40% in our first quarter after reopening. The atmosphere makes clients want to linger.',
    featured: false
  },
  {
    id: 'komorebi-dining-bistro',
    title: 'Komorebi Artisan Dining & Wine Bar',
    client: 'Komorebi Hospitality Group',
    category: 'commercial',
    subCategory: 'Restaurant & Hospitality Interior',
    location: 'Gulshan 2 Fine Dining Row',
    area: '4,500 sq.ft',
    completionTime: '42 Days',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An intimate dining experience inspired by Japanese komorebi (sunlight filtering through trees), featuring custom curved fluted banquettes, warm 2200K amber lighting, and acoustic timber baffles.',
    highlights: [
      'Custom curved booth banquettes upholstered in stain-resistant Danish wool',
      'Acoustic ceiling baffles tuned to keep restaurant noise comfortable at full capacity',
      'Show kitchen chef counter with flamed black granite and brass reveal details'
    ],
    materials: ['Charred Shou Sugi Ban Wood', 'Flamed Granite', 'Acoustic Wood Slats', 'Warm Brass'],
    style: 'Warm Japandi Hospitality',
    testimonialQuote: 'Inerim created an unforgettable dining ambiance. Guests constantly photograph the woodwork and praise the comfortable acoustics.',
    featured: true
  }
];
