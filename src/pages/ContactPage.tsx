import React, { useState } from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { FAQS } from '../data/companyData';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Building2,
  Home as HomeIcon,
  ShieldCheck
} from 'lucide-react';

interface ContactPageProps {
  initialPrefill?: {
    spaceType: string;
    sqft: number;
    estimate: number;
    grade: string;
  } | null;
  onOpenCalculator: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ initialPrefill, onOpenCalculator }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    spaceType: initialPrefill ? initialPrefill.spaceType : 'Residential Apartment / Duplex',
    areaSqft: initialPrefill ? String(initialPrefill.sqft) : '2400',
    finishGrade: initialPrefill ? initialPrefill.grade : 'Signature Architectural',
    timeline: '45-Day Handover Guaranteed',
    city: 'Dhaka (Gulshan / Banani / Uttara / Dhanmondi)',
    message: initialPrefill ? `Interested in estimated cost around ৳ ${initialPrefill.estimate.toLocaleString('en-IN')}` : ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const ticketId = 'INR-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedTicket(ticketId);
      setSubmitting(false);
    }, 500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-8 sm:py-12">
      {/* 1. Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087973]/10 border border-[#087973]/30 text-[#087973] text-[11px] font-semibold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            Client Inquiries & Consultations
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight">
            Contact Us
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            Whether you are designing a private residential haven or a forward-thinking corporate headquarters, our senior architectural squad is ready to assist.
          </p>
        </div>
      </section>

      {/* 2. Contact Form & Studio Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className={`lg:col-span-7 rounded-2xl border p-5 sm:p-8 transition-colors ${
            isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/10 shadow-sm'
          }`}>
            {submittedTicket ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#087973]/15 text-[#087973] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif">
                  Inquiry Successfully Received
                </h3>
                <p className={`text-xs max-w-md mx-auto leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                  Thank you, <strong>{formData.name}</strong>. Your inquiry reference ticket has been logged:
                </p>
                <div className={`inline-block px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold border ${
                  isDark ? 'bg-white/5 border-white/15 text-[#087973]' : 'bg-black/5 border-black/15 text-[#087973]'
                }`}>
                  Reference #{submittedTicket}
                </div>
                <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                  A Senior Project Architect will contact you at <strong>{formData.phone}</strong> within 3 business hours.
                </p>

                <div className="pt-3 flex flex-wrap justify-center gap-2.5">
                  <button
                    onClick={() => {
                      const msg = encodeURIComponent(`Hello Inerim, my inquiry ticket is #${submittedTicket} for ${formData.spaceType} (${formData.areaSqft} sq.ft).`);
                      window.open(`https://wa.me/8801768080101?text=${msg}`, '_blank');
                    }}
                    className="px-4.5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Connect on WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setSubmittedTicket(null)}
                    className={`px-4.5 py-2.5 rounded-lg text-xs font-medium cursor-pointer border ${
                      isDark ? 'border-white/20 hover:bg-white/5 text-white' : 'border-black/15 hover:bg-black/5 text-black'
                    }`}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className={`flex items-center justify-between pb-3 border-b ${
                  isDark ? 'border-white/10' : 'border-black/10'
                }`}>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-serif">
                      Direct Inquiry Form
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                      Receive an itemized estimate and schedule a free site measurement visit.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#087973] bg-[#087973]/10 px-2 py-0.5 rounded-full">
                    Response &lt; 3 Hours
                  </span>
                </div>

                {/* Project archetype & area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                      Project Archetype *
                    </label>
                    <select
                      value={formData.spaceType}
                      onChange={(e) => setFormData({ ...formData, spaceType: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none transition-colors ${
                        isDark ? 'bg-black border-white/15 text-white focus:border-[#087973]' : 'bg-white border-black/15 text-black focus:border-[#087973]'
                      }`}
                      required
                    >
                      <option value="Residential Apartment / Duplex">Residential Apartment / Duplex</option>
                      <option value="Sky Penthouse / Villa">Sky Penthouse / Villa</option>
                      <option value="Commercial Corporate HQ">Commercial Corporate HQ</option>
                      <option value="Tech Studio / Workstation Hub">Tech Studio / Workstation Hub</option>
                      <option value="Boutique Retail / Showroom">Boutique Retail / Showroom</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                      Approx Floor Area (sq.ft) *
                    </label>
                    <input
                      type="number"
                      min="500"
                      max="40000"
                      placeholder="e.g. 2400"
                      value={formData.areaSqft}
                      onChange={(e) => setFormData({ ...formData, areaSqft: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none transition-colors ${
                        isDark ? 'bg-black border-white/15 text-white focus:border-[#087973]' : 'bg-white border-black/15 text-black focus:border-[#087973]'
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Material tier & timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                      Material Finish Tier
                    </label>
                    <select
                      value={formData.finishGrade}
                      onChange={(e) => setFormData({ ...formData, finishGrade: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none transition-colors ${
                        isDark ? 'bg-black border-white/15 text-white focus:border-[#087973]' : 'bg-white border-black/15 text-black focus:border-[#087973]'
                      }`}
                    >
                      <option value="Essential Modern">Essential Modern</option>
                      <option value="Signature Architectural">Signature Architectural (Most Popular)</option>
                      <option value="Luxury Bespoke">Luxury Bespoke (Natural Walnut + Marble)</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                      Target Handover Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none transition-colors ${
                        isDark ? 'bg-black border-white/15 text-white focus:border-[#087973]' : 'bg-white border-black/15 text-black focus:border-[#087973]'
                      }`}
                    >
                      <option value="45-Day Handover Guaranteed">Strict 45-Day Handover (Rush)</option>
                      <option value="Next 2-3 Months">Within Next 2-3 Months</option>
                      <option value="Planning for Future Year">Planning Ahead</option>
                    </select>
                  </div>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tanzim Ahmed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none transition-colors ${
                        isDark ? 'bg-black border-white/15 text-white focus:border-[#087973]' : 'bg-white border-black/15 text-black focus:border-[#087973]'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+88 017..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none transition-colors ${
                        isDark ? 'bg-black border-white/15 text-white focus:border-[#087973]' : 'bg-white border-black/15 text-black focus:border-[#087973]'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none transition-colors ${
                        isDark ? 'bg-black border-white/15 text-white focus:border-[#087973]' : 'bg-white border-black/15 text-black focus:border-[#087973]'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                      Property Location / Zone
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gulshan 2, Dhaka"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none transition-colors ${
                        isDark ? 'bg-black border-white/15 text-white focus:border-[#087973]' : 'bg-white border-black/15 text-black focus:border-[#087973]'
                      }`}
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                    Project Vision / Notes / Specific Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your space, ceiling height, preferred aesthetic (e.g. Japandi, Modern Minimalist), or specific storage needs..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none transition-colors ${
                      isDark ? 'bg-black border-white/15 text-white focus:border-[#087973]' : 'bg-white border-black/15 text-black focus:border-[#087973]'
                    }`}
                  />
                </div>

                {/* Submit Action */}
                <button
                  id="submit-contact-form-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-lg bg-[#087973] hover:bg-[#06615c] text-white font-medium text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {submitting ? (
                    <span>Registering Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry & Request Free Measurement</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Studio Contact Details */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`rounded-2xl p-5 sm:p-6 border space-y-5 ${
              isDark ? 'bg-white/[0.03] border-white/10 text-white' : 'bg-black/[0.02] border-black/10 text-black'
            }`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#087973]">
                  Direct Studio Access
                </span>
                <h3 className="text-xl font-bold font-serif mt-0.5">Inerim Studio</h3>
                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                  Visit our materials showroom to experience full-scale room mockups, veneer selections, and German hardware in person.
                </p>
              </div>

              <div className={`space-y-3.5 text-xs border-t pt-4 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#087973]/10 flex items-center justify-center text-[#087973] flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                      Client CRM & Support
                    </div>
                    <div className="font-bold text-xs sm:text-sm">+88 01768 080101</div>
                    <div className={`text-[11px] ${isDark ? 'text-white/60' : 'text-black/60'}`}>+88 01711 333730 (Project Sales)</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#087973]/10 flex items-center justify-center text-[#087973] flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                      Email Correspondence
                    </div>
                    <div className="font-bold text-xs sm:text-sm">hello@inerim.com</div>
                    <div className={`text-[11px] ${isDark ? 'text-white/60' : 'text-black/60'}`}>projects@inerim.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#087973]/10 flex items-center justify-center text-[#087973] flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                      Studio & Materials Lab
                    </div>
                    <div className="font-bold leading-relaxed">
                      House 5, Road 21/A, Nikunja 2 & Gulshan 2
                    </div>
                    <div className={`text-[11px] ${isDark ? 'text-white/60' : 'text-black/60'}`}>Dhaka-1229, Bangladesh</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#087973]/10 flex items-center justify-center text-[#087973] flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                      Opening Hours
                    </div>
                    <div className="font-medium">Saturday – Thursday: 9:00 AM – 8:00 PM</div>
                    <div className={`text-[11px] ${isDark ? 'text-white/60' : 'text-black/60'}`}>Friday: By Prior Appointment Only</div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp button */}
              <a
                href="https://wa.me/8801768080101"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors block text-center cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>

            {/* Quick Estimator Teaser */}
            <div className={`rounded-xl p-4.5 border flex items-center justify-between gap-3 ${
              isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-black/10'
            }`}>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#087973] tracking-wider block">
                  Interactive Tool
                </span>
                <h4 className="font-bold text-xs sm:text-sm">Need a quick estimate first?</h4>
                <p className={`text-[11px] ${isDark ? 'text-white/60' : 'text-black/60'}`}>Calculate in 60 seconds with zero signup.</p>
              </div>
              <button
                onClick={onOpenCalculator}
                className="px-3.5 py-2 rounded-lg bg-[#087973] hover:bg-[#06615c] text-white text-xs font-medium whitespace-nowrap cursor-pointer"
              >
                Open Calculator
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Frequently Asked Questions Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#087973]">
            Frequently Answered
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight mt-1">
            Common Client Questions
          </h2>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl border overflow-hidden transition-colors ${
                  isDark ? 'bg-black border-white/10' : 'bg-white border-black/10'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="font-semibold text-xs sm:text-sm font-serif">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#087973] flex-shrink-0" />
                  ) : (
                    <ChevronDown className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-white/40' : 'text-black/40'}`} />
                  )}
                </button>

                {isOpen && (
                  <div className={`px-4 pb-4 text-xs leading-relaxed border-t pt-2.5 ${
                    isDark ? 'border-white/10 text-white/70 bg-white/[0.02]' : 'border-black/10 text-black/70 bg-black/[0.01]'
                  }`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
