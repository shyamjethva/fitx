import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Trophy, Target, Heart, Award, Shield, ChevronRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { TimerOffer } from '../components/TimerOffer';
import BackgroundGlows from '../components/BackgroundGlows';
import { api, PageHeroData } from '../lib/api';

const stats = [
  { label: "Active Members", value: "15k+", icon: <Users className="w-6 h-6 text-[#00E5FF]" /> },
  { label: "Elite Coaches", value: "120+", icon: <Award className="w-6 h-6 text-[#00E5FF]" /> },
  { label: "Success Stories", value: "50k+", icon: <Trophy className="w-6 h-6 text-[#00E5FF]" /> },
  { label: "Global Centers", value: "85+", icon: <Target className="w-6 h-6 text-[#00E5FF]" /> }
];

const values = [
  {
    title: "Performance First",
    desc: "We prioritize results through science-backed training protocols.",
    icon: <Target className="w-8 h-8 text-[#00E5FF]" />
  },
  {
    title: "Community Core",
    desc: "A brotherhood of athletes pushing each other to new heights.",
    icon: <Heart className="w-8 h-8 text-[#00E5FF]" />
  },
  {
    title: "Integrity & Safety",
    desc: "Highest standards of facility maintenance and training ethics.",
    icon: <Shield className="w-8 h-8 text-[#00E5FF]" />
  }
];

export default function About() {
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);

  useEffect(() => {
    api.getPageHeroes()
      .then(heroes => {
        const aboutHero = heroes.find(h => h.pageKey === 'about');
        if (aboutHero) setHeroData(aboutHero);
      })
      .catch(err => console.error("Error loading about hero", err));
  }, []);

  const content = heroData?.contentBlocks || {};

  return (
    <div className="flex flex-col w-full premium-bg min-h-screen pt-32 pb-20 overflow-x-hidden text-white font-sans relative selection:bg-[#00E5FF]/20">
      <BackgroundGlows />

      {/* Hero Section */}
      <section className="px-6 md:px-24 mb-20 max-w-7xl mx-auto w-full">
        <ScrollReveal type="slide-up">
          <div className="max-w-5xl">
            <span className="text-[#00E5FF] font-black text-xs md:text-sm tracking-[0.4em] uppercase block mb-4">
              {content.hero_subtitle || 'ABOUT OUR HIGH-PERFORMANCE TEAM'}
            </span>
            <h1 className="font-black text-6xl md:text-9xl tracking-tight mb-12 leading-[0.8] uppercase" dangerouslySetInnerHTML={{ __html: content.hero_title?.replace(/\n/g, '<br />') || 'The Fit<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00B0FF]">X</span> <br /> Legacy' }} />
            <p className="text-white/80 font-bold text-xl md:text-3xl tracking-tight uppercase max-w-3xl leading-snug">
              {content.hero_desc || 'We didn\'t just build a gym. We built a high-performance ecosystem for those who refuse to settle.'}
            </p>
          </div>
        </ScrollReveal>
      </section>

      <ScrollReveal type="slide-up">
        <TimerOffer />
      </ScrollReveal>

      {/* Stats Grid Section with perfect layout card padding and spacing */}
      <section className="px-6 md:px-24 mb-32 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <ScrollReveal key={stat.label} type="scale" delay={idx * 100}>
              <div className="p-8 md:p-10 rounded-[32px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#00E5FF]/20 flex flex-col items-center text-center group transition-all duration-500 shadow-2xl backdrop-blur-3xl">
                <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl text-[#00E5FF] group-hover:scale-110 group-hover:bg-[#00E5FF]/10 group-hover:border-[#00E5FF]/25 transition-all duration-500">
                  {stat.icon}
                </div>
                <span className="text-4xl md:text-6xl font-black mb-2 tracking-tighter text-white">{stat.value}</span>
                <span className="text-white/40 font-bold text-[10px] tracking-widest uppercase">{stat.label}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="px-6 md:px-24 mb-32 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 w-full">
            <ScrollReveal type="slide-up">
              <div className="relative rounded-[48px] overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200"
                  className="w-full aspect-square object-cover"
                  alt="Training"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>
            </ScrollReveal>
          </div>
          <div className="lg:w-1/2 w-full space-y-8">
            <ScrollReveal type="slide-up">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none" dangerouslySetInnerHTML={{ __html: content.mission_title?.replace(/\n/g, '<br />') || 'Our Mission Is <br /> Your Evolution' }} />
              <p className="text-white/60 text-lg leading-relaxed mt-8">
                {content.mission_desc || 'Founded in 2018, FitX was born from a simple observation: most fitness spaces lack the soul and science required for true transformation. We bridged that gap by combining world-class equipment with an elite fitXure of accountability.'}
              </p>
              <div className="pt-6">
                <button className="group flex items-center gap-4 text-[#00E5FF] font-black text-sm tracking-widest uppercase">
                  <span>Explore our journey</span>
                  <div className="w-12 h-12 rounded-full border border-[#00E5FF]/30 flex items-center justify-center group-hover:bg-[#00E5FF] group-hover:text-black transition-all">
                    <ChevronRight className="w-5 h-5 text-white group-hover:text-slate-950 transition-colors" />
                  </div>
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values Section with gorgeous typography and aligned grid spaces */}
      <section className="px-6 md:px-24 mb-20 max-w-7xl mx-auto w-full">
        <ScrollReveal type="slide-up" className="mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-center">{content.values_title || 'Built on Values'}</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val) => (
            <ScrollReveal key={val.title} type="scale">
              <div className="flex flex-col items-center text-center p-10 rounded-[40px] bg-white/[0.01] border border-white/5 hover:border-[#00E5FF]/20 hover:bg-white/[0.03] transition-all duration-500 group shadow-2xl">
                <div className="mb-8 w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#00E5FF] group-hover:text-slate-950 transition-all duration-700">
                  {val.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-white">{val.title}</h3>
                <p className="text-white/40 font-bold leading-relaxed text-sm">{val.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
