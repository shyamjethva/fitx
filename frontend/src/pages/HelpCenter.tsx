import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Minus, HelpCircle, MessageSquare, PhoneCall, Mail } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

interface FAQ {
  q: string;
  a: string;
  cat: string;
}

const FAQS: FAQ[] = [
  {
    q: 'How does the fitXpass subscription work?',
    a: 'fitXpass is a unified subscription that allows you to book and attend unlimited workout classes, strength facilities, elite gyms, and virtual routines across our entire premium grid.',
    cat: 'Subscription'
  },
  {
    q: 'Can I cancel or freeze my premium membership?',
    a: 'Absolutely. You can freeze your premium membership for up to 60 days per calendar year directly from your dashboard under the Subscription panel or by contacting club operations.',
    cat: 'Membership'
  },
  {
    q: 'What is the refund policy for trainers and programs?',
    a: 'Personal coaching purchases come with a 7-day money-back guarantee if you are not fully aligned with your designated performance coach. Program fees are non-refundable after session start.',
    cat: 'Billing'
  },
  {
    q: 'How do I schedule dynamic group classes?',
    a: 'You can book classes up to 7 days in advance via the FitX digital companion app or the scheduling terminal on the online dashboard. Cancellations require a 2-hour window.',
    cat: 'Scheduling'
  },
  {
    q: 'Are locker rooms and steam facilities secure?',
    a: 'Yes, all lockers feature electronic cryptographic locks activated by your registered FitX RFID bracelet or the FitX companion app secure token.',
    cat: 'Facilities'
  },
  {
    q: 'Is personal training included in fitXpass?',
    a: 'fitXpass includes introductory biometric profiling and physical alignment sessions. Specialized individual training coaching bundles can be unlocked as custom add-ons.',
    cat: 'Subscription'
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const categories = ['All', 'Subscription', 'Membership', 'Billing', 'Scheduling', 'Facilities'];

  const filteredFaqs = FAQS.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.cat === activeCategory;
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="relative w-full min-h-screen pt-32 pb-24 bg-black overflow-hidden selection:bg-[#00E5FF]/30">
      {/* Background Neon Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00E5FF]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00B0FF]/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal type="slide-up">
          <div className="text-center mb-16">
            <span className="text-[#00E5FF] font-black text-xs md:text-sm tracking-[0.4em] uppercase block mb-4">
              FITX INTELLIGENT HELPDESK
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none mb-8">
              SUPPORT <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00B0FF]">CENTER</span>
            </h1>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#00E5FF] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH KNOWLEDGE BASE OR QUESTIONS..."
                className="w-full bg-white/5 border border-white/10 rounded-[24px] py-6 pl-16 pr-6 font-sans text-white text-xs tracking-widest uppercase focus:outline-none focus:border-[#00E5FF]/50 transition-all shadow-xl"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Categories Tab Navigation */}
        <ScrollReveal type="slide-up">
          <div className="flex flex-wrap gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-[32px] justify-center items-center mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setExpandedIndex(null);
                }}
                className={`px-6 py-3.5 rounded-[24px] font-sans text-[10px] font-black tracking-widest uppercase transition-all ${
                  activeCategory === cat 
                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#00B0FF] text-slate-950 shadow-[0_4px_15px_rgba(0,229,255,0.25)] scale-105'
                    : 'text-white/55 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* FAQs Accordion */}
        <div className="space-y-4 mb-24">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => {
                const isOpen = expandedIndex === i;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    key={faq.q}
                    className="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden"
                  >
                    <button
                      onClick={() => toggleAccordion(i)}
                      className="w-full p-8 flex justify-between items-center text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="text-lg font-bold text-white uppercase tracking-tight pr-4">{faq.q}</span>
                      <span className="shrink-0 p-2 bg-white/5 rounded-full border border-white/10 text-white/60">
                        {isOpen ? <Minus className="w-4 h-4 text-[#00E5FF]" /> : <Plus className="w-4 h-4" />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-8 pb-8 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl">
                <HelpCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-white/60 font-bold uppercase tracking-widest text-xs">No Match Found</h3>
                <p className="text-white/40 text-xs mt-2">Try checking other keywords or searching all categories.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Support Options footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <MessageSquare className="w-6 h-6 text-[#00E5FF]" />, title: 'Live Chat', label: 'Connect Instant', value: '2 min wait' },
            { icon: <PhoneCall className="w-6 h-6 text-[#00E5FF]" />, title: 'Voice Support', label: 'Toll-free Hotline', value: '1800-419-XFIT' },
            { icon: <Mail className="w-6 h-6 text-[#00E5FF]" />, title: 'Email Desk', label: 'Direct Response', value: 'support@fitx.com' }
          ].map(opt => (
            <ScrollReveal key={opt.title} type="scale">
              <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  {opt.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-tight">{opt.title}</h4>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">{opt.label}</p>
                </div>
                <div className="text-[#00E5FF] font-black text-xs tracking-wider uppercase mt-2">
                  {opt.value}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
