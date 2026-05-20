import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, MessageSquare, Send, Clock, ChevronRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { TimerOffer } from '../components/TimerOffer';
import { api, PageHeroData } from '../lib/api';

import BackgroundGlows from '../components/BackgroundGlows';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);

  const dynamicContactInfo = [
    {
      title: heroData?.contentBlocks?.box1_title || "Call Us",
      value: heroData?.contentBlocks?.box1_value || "+1 (800) IRON-PULSE",
      icon: <Phone className="w-6 h-6 text-orange-400" />,
      desc: heroData?.contentBlocks?.box1_desc || "Available 24/7 for urgent inquiries."
    },
    {
      title: heroData?.contentBlocks?.box2_title || "Email Us",
      value: heroData?.contentBlocks?.box2_value || "support@ironpulse.fitness",
      icon: <Mail className="w-6 h-6 text-blue-400" />,
      desc: heroData?.contentBlocks?.box2_desc || "Expect a response within 2 hours."
    },
    {
      title: heroData?.contentBlocks?.box3_title || "Visit Us",
      value: heroData?.contentBlocks?.box3_value || "Iron District, NY 10001",
      icon: <MapPin className="w-6 h-6 text-purple-400" />,
      desc: heroData?.contentBlocks?.box3_desc || "Our flagship elite training center."
    },
    {
      title: heroData?.contentBlocks?.box4_title || "WhatsApp",
      value: heroData?.contentBlocks?.box4_value || "Join Community",
      icon: <MessageSquare className="w-6 h-6 text-emerald-400" />,
      desc: heroData?.contentBlocks?.box4_desc || "Direct support via chat."
    }
  ];

  useEffect(() => {
    api.getPageHeroes().then(data => {
      const contact = data.find(h => h.pageKey === 'contact_us');
      if (contact) setHeroData(contact);
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Required fields are missing!');
      return;
    }
    setSubmitting(true);
    try {
      await api.createContact({
        name: formData.name,
        email: formData.email,
        type: 'CONTACT INQUIRY',
        plan: formData.subject || 'GENERAL SUPPORT',
        message: formData.message || 'No details supplied.'
      });
      alert('🎯 TRANSMITTED! Your pulse has been received.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      alert('Failed to transmit inquiry. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full premium-bg min-h-screen pt-32 pb-20 overflow-x-hidden text-white font-sans relative">
      <BackgroundGlows />
      {/* Header */}
      <section className="px-6 md:px-24 mb-12">
        <ScrollReveal type="slide-up">
          <div className="max-w-4xl">
            <h1 className="font-black text-6xl md:text-8xl tracking-tight mb-8 leading-none uppercase" dangerouslySetInnerHTML={{ __html: heroData?.title || 'Connect <br /> with Fit<span class="text-[#FF7200]">X</span>' }} />
            <p className="text-white/60 font-bold text-xl tracking-tight uppercase max-w-2xl">
              {heroData?.subtitle || 'Ready to transcend your limits? Our elite support team is standing by to assist your evolution.'}
            </p>
          </div>
        </ScrollReveal>
      </section>

      <ScrollReveal type="slide-up">
         <TimerOffer />
      </ScrollReveal>

      {/* Contact Cards */}
      <section className="px-6 md:px-24 mb-32">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dynamicContactInfo.map((info, idx) => (
            <ScrollReveal key={info.title} type="scale" delay={idx * 100}>
              <div className="glass-panel p-6 rounded-[40px] border border-white/5 flex flex-col group hover:bg-white/10 transition-all cursor-pointer">
                <div className="mb-8 w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                  {info.icon}
                </div>
                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{info.title}</h3>
                <p className="text-white font-bold text-lg mb-4">{info.value}</p>
                <p className="text-white/40 font-bold text-xs uppercase tracking-widest">{info.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Map & Form */}
      <section className="px-6 md:px-24">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="lg:w-1/2">
            <ScrollReveal type="slide-up">
              <div className="bg-white rounded-[60px] p-8 md:p-20 text-black h-full">
                <h2 className="font-black text-4xl md:text-6xl tracking-tight mb-12 uppercase leading-none">{heroData?.contentBlocks?.form_title || 'Drop a Message'}</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input 
                      type="text" 
                      required
                      placeholder="YOUR NAME" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-6 font-bold text-sm tracking-widest focus:ring-2 focus:ring-black/10 outline-none" 
                    />
                    <input 
                      type="email" 
                      required
                      placeholder="EMAIL ADDRESS" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/5 border-none rounded-2xl p-6 font-bold text-sm tracking-widest focus:ring-2 focus:ring-black/10 outline-none" 
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="SUBJECT" 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black/5 border-none rounded-2xl p-6 font-bold text-sm tracking-widest focus:ring-2 focus:ring-black/10 outline-none" 
                  />
                  <textarea 
                    placeholder="HOW CAN WE HELP YOU TRANSITION?" 
                    rows={6} 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black/5 border-none rounded-2xl p-6 font-bold text-sm tracking-widest focus:ring-2 focus:ring-black/10 outline-none resize-none" 
                  />
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-black text-white py-6 rounded-[30px] font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-4 hover:scale-[1.02] disabled:opacity-50 transition-all"
                  >
                    <span>{submitting ? 'TRANSMITTING' : (heroData?.ctaText || 'SEND PULSE')}</span>
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>

          {/* Map Placeholder/Visual */}
          <div className="lg:w-1/2">
            <ScrollReveal type="scale" className="h-full">
              <div className="relative rounded-[60px] overflow-hidden border border-white/10 h-full min-h-[500px] bg-white/5 group">
                {/* Mock Map Background */}
                <div className="absolute inset-0 grayscale invert opacity-20 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=13&size=800x800&key=YOUR_API_KEY')] bg-cover bg-center" />
                
                <div className="relative z-10 p-8 md:p-20 flex flex-col h-full justify-between">
                   <div className="space-y-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,107,0,0.5)]">
                         <MapPin className="w-6 h-6 text-black" />
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter">{heroData?.contentBlocks?.hq_title || 'HQ LOCATION'}</h3>
                      <p className="text-white/60 font-bold text-lg uppercase" dangerouslySetInnerHTML={{ __html: heroData?.contentBlocks?.hq_address || 'Iron District, Level 42<br />New York City, NY' }} />
                   </div>
                   
                   <div className="glass-panel p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-black tracking-widest uppercase">Open Now</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <div className="space-y-1">
                            <p className="text-xs font-black tracking-widest uppercase text-white/40">Closing In</p>
                            <p className="text-xl font-black uppercase">4 Hours 20 Mins</p>
                         </div>
                         <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                            <ChevronRight className="w-6 h-6" />
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
