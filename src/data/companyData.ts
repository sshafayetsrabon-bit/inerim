import { WorkflowStep, ComparisonFactor, Testimonial, TeamMember } from '../types';

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    stepNumber: '01',
    title: 'Meet & Discover',
    subtitle: 'Free Discovery Session',
    duration: 'Day 1 - 2',
    description: 'We meet at your space or our studio to analyze your lifestyle, functional needs, architectural aspirations, and budget boundaries.',
    deliverables: ['Site measurement scan', 'Space audit & preliminary zoning', 'Budget alignment framework'],
    icon: 'Users'
  },
  {
    stepNumber: '02',
    title: 'Book & Plan',
    subtitle: 'Scope Locking & Agreement',
    duration: 'Day 3 - 5',
    description: 'Sign transparent service agreements with an itemized Bill of Quantities (BOQ). No vague estimates, no hidden extras.',
    deliverables: ['Transparent price lock', 'Project schedule calendar', 'Dedicated project manager assignment'],
    icon: 'CalendarCheck'
  },
  {
    stepNumber: '03',
    title: 'Design & Render',
    subtitle: '3D Photorealism & Material Selection',
    duration: 'Day 6 - 15',
    description: 'Our senior interior architects create bespoke 3D renders, VR walkthroughs, and tangible material moodboard palettes with real wood and stone swatches.',
    deliverables: ['Photorealistic 3D visualization', 'Electrical & plumbing MEP blueprints', 'Material swatch sign-off'],
    icon: 'Compass'
  },
  {
    stepNumber: '04',
    title: 'Precision Execution',
    subtitle: 'Factory Prefabrication & Civil Works',
    duration: 'Day 16 - 40',
    description: 'Bespoke modular joinery is cut and edged in our state-of-the-art CNC manufacturing plant while civil and MEP work proceeds cleanly on-site.',
    deliverables: ['Off-site dustless manufacturing', '146-step quality checkpoint audits', 'Weekly digital photo & video milestone reports'],
    icon: 'Hammer'
  },
  {
    stepNumber: '05',
    title: 'Move On & Handover',
    subtitle: 'Snag-Free Handover & 2-Yr Warranty',
    duration: 'Day 41 - 45',
    description: 'Deep sanitary cleaning, final architectural snagging inspection, key handover, and activation of your 2-Year Comprehensive Warranty certificate.',
    deliverables: ['Turnkey move-in ready handover', '2-Year Warranty booklet', 'Lifetime after-sales service access'],
    icon: 'KeyRound'
  }
];

export const COMPARISON_FACTORS: ComparisonFactor[] = [
  {
    factor: 'Price & Transparency',
    inerimExperience: ['Itemized BOQ with 100% price lock guarantee', 'Zero hidden costs or post-agreement surprises', 'Direct factory-to-site pricing'],
    typicalExperience: 'Vague ballpark quotes with 30-50% budget overruns midway through execution'
  },
  {
    factor: 'Convenience & Hassle',
    inerimExperience: ['Single point of contact: dedicated Architect Project Lead', 'Complete turnkey handling from civil to loose styling', 'Zero running around markets for handles or paints'],
    typicalExperience: 'Client forced to negotiate with 6+ separate carpenters, electricians, plumbers, and paint contractors'
  },
  {
    factor: 'Design Quality',
    inerimExperience: ['Original architectural concepts tailored to personal acoustics and lighting', 'True-to-life 3D renders matching the exact delivered outcome', 'Smart storage engineering in every inch'],
    typicalExperience: 'Generic cookie-cutter catalog copies with mismatched proportions and jarring colors'
  },
  {
    factor: 'Project Timeline',
    inerimExperience: ['Guaranteed delivery within 45 days', 'Liquidated damages penalty paid by Inerim if delayed', 'Clear daily milestone tracking'],
    typicalExperience: 'Projects perpetually delayed, dragging 6 to 12 months with frequent unattended job sites'
  },
  {
    factor: 'Communication',
    inerimExperience: ['Weekly digital photo & video progress digest', 'Dedicated customer success manager on WhatsApp & phone', 'Real-time issue resolution in 24 hours'],
    typicalExperience: 'Poor communication, unanswered calls, excuses, and unexplained work halts'
  },
  {
    factor: 'Materials & Craftsmanship',
    inerimExperience: ['Imported Blum / Hettich soft-close hardware', 'Boiling-water-resistant (BWR) eco-grade boards', '146-step structural quality inspection before handover'],
    typicalExperience: 'Low-grade unbranded commercial plywood that bends, bubbles, and peels within months'
  },
  {
    factor: 'Warranty & Protection',
    inerimExperience: ['Flat 2-Year comprehensive warranty on all woodwork and hardware', 'Complimentary 6-month & 12-month wellness checkups', 'Emergency maintenance team on standby'],
    typicalExperience: 'Zero post-handover accountability; contractors vanish as soon as final payment clears'
  },
  {
    factor: 'Space Optimization',
    inerimExperience: ['Custom ergonomic storage maximizing vertical space and awkward corners', 'Dual-purpose furniture and concealed wire raceways', 'Scientifically balanced lumens and airflow'],
    typicalExperience: 'Bulky standard furniture creating dead zones, visible messy wiring, and dark uninviting rooms'
  }
];

export const WHY_CHOOSE_US = [
  {
    title: 'Best Price In Market',
    description: 'Get premium designs at competitive prices tailored to your budget with zero hidden cost.',
    icon: 'BadgePercent',
    badge: 'Fair & Transparent'
  },
  {
    title: '45-Days Delivery',
    description: 'We ensure timely project completion without compromising on quality, backed by a written guarantee.',
    icon: 'Timer',
    badge: 'On-Time Guarantee'
  },
  {
    title: 'Flat 2-Years Warranty',
    description: 'Enjoy peace of mind with our comprehensive 2-year warranty covering all carpentry, hardware, and structural elements.',
    icon: 'ShieldCheck',
    badge: 'Complete Protection'
  },
  {
    title: 'After Sale Service',
    description: 'Our relationship continues even after the project is complete, ensuring long-term satisfaction and prompt servicing.',
    icon: 'Headset',
    badge: 'Dedicated Support'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'sinthia-c',
    clientName: 'Sinthia Chowdhury',
    role: 'Tech Entrepreneur & Founder',
    companyOrProject: "Mrs. Sinthia Chowdhury's Residence",
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    review: 'Inerim transformed our 3,850 sq.ft home within 44 days! Their efficient space planning, concealed millwork, and top-notch materials made everything look effortlessly serene. Highly recommended!',
    projectType: 'Luxury Duplex'
  },
  {
    id: 'abdullah-j',
    clientName: 'Abdullah Jayed',
    role: 'CEO, Next Venture Holdings',
    companyOrProject: 'Funded Next Innovation Studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    review: 'Inerim transformed our 10,500 sq.ft office in just 52 days with exceptional quality and design. Their dedication to acoustic pods, lighting zones, and executive comfort exceeded all our international expectations.',
    projectType: 'FinTech Corporate HQ'
  },
  {
    id: 'sujon-s',
    clientName: 'Sujon Sarkar',
    role: 'Co-Founder, One Little Web',
    companyOrProject: 'Creative Agency Studio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    review: 'Inerim delivered our 7,000 sq.ft office project on time, with creative, space-efficient solutions throughout. Our team productivity and client reception has skyrocketed.',
    projectType: 'Digital Agency Space'
  },
  {
    id: 'iftekhar-a',
    clientName: 'Engr. Iftekhar Ahmed',
    role: 'Principal Structural Consultant',
    companyOrProject: "Mr. Iftekhar's Sky Penthouse",
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    review: 'As an engineer myself, I scrutinize joinery tolerances and MEP layouts ruthlessly. Inerim passed every single checkpoint with flying colors. The German hardware and seamless ceiling integration are extraordinary.',
    projectType: 'Sky Penthouse'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Nayeemul Huq, AIA',
    role: 'Founder & Principal Architect',
    bio: 'Educated at AA School of Architecture, London. Nayeemul founded Inerim with a singular conviction: that minimalist spaces with impeccable materials can elevate human wellbeing and everyday joy.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    credentials: '14+ Years Practice • 180+ Completed Projects'
  },
  {
    name: 'Tanzila Rahman',
    role: 'Director of Interior Styling & FF&E',
    bio: 'Specializing in biophilic curation, tactile textures, and bespoke Japanese-Scandinavian joinery. Tanzila sources ethically harvested timber and museum-grade finishes.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    credentials: 'M.Des Milan • Ex-Foster+Partners Collaborator'
  },
  {
    name: 'Mahbubur Rahman, PMP',
    role: 'Head of Modular Manufacturing & Engineering',
    bio: 'Spearheads Inerim’s proprietary 146-step quality verification and state-of-the-art CNC precision facility, guaranteeing zero-delay deliveries.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    credentials: 'Lean Six Sigma Black Belt • 45-Day Delivery Master'
  },
  {
    name: 'Dr. Samira Kabir',
    role: 'Lead Lighting & Acoustic Consultant',
    bio: 'Calibrates circadian rhythm lux levels and acoustic absorption coefficients so commercial offices stay focused and residences remain deeply restful.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    credentials: 'WELL AP Certified • Acoustic Sciences Ph.D.'
  }
];

export const FAQS = [
  {
    question: 'How do you guarantee project delivery within 45 days?',
    answer: 'We manufacture 75% of all cabinetry, wall paneling, and modular elements inside our specialized off-site CNC prefabrication facility while simultaneous civil, flooring, and electrical ducting work proceeds on-site. This parallel workflow slashes on-site mess and avoids traditional delays.'
  },
  {
    question: 'What is included in Inerim’s Flat 2-Years Warranty?',
    answer: 'Our warranty covers structural stability of all woodwork, Blum / Hettich drawer runners and hinge mechanisms, lighting transformers, and anti-termite integrity. If any issue arises, our dedicated post-handover team resolves it free of charge within 48 hours.'
  },
  {
    question: 'Can I choose my own materials, paints, and marble finishes?',
    answer: 'Absolutely. During Step 03 (Design & Render), you will visit our Materials Lab to touch and select from hundreds of certified swatches: natural veneers, acrylic laminates, Caesarstone/quartz, sintered stone, and low-VOC paints. We build custom moodboards for your sign-off.'
  },
  {
    question: 'Are there any hidden costs after we agree on the estimate?',
    answer: 'None. We provide a binding, itemized Bill of Quantities (BOQ). The price agreed upon at contract signing is the price you pay, unless you explicitly request a scope addition in writing.'
  },
  {
    question: 'Do you handle commercial offices, retail shops, and residential homes?',
    answer: 'Yes! We have dedicated specialized squads for luxury residential interiors (duplexes, penthouses, apartments) and commercial high-performance workplaces (tech hubs, corporate headquarters, boutique showrooms).'
  }
];
