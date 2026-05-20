import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Share2, Dumbbell, Zap, Weight, Heart, ChevronRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { TimerOffer } from '../components/TimerOffer';
import BackgroundGlows from '../components/BackgroundGlows';
import { api, Trainer, Transformation } from '../lib/api';

const FALLBACK_TRAINERS: Trainer[] = [
  {
    id: "1",
    name: 'MARCUS VANCE',
    role: 'Physique Expert',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    bio: 'Mandated by strength. Driven by precision.'
  },
  {
    id: "2",
    name: 'SARAH CHENG',
    role: 'HIIT Lead',
    img: 'https://images.unsplash.com/photo-1548691906-c215a091934c?auto=format&fit=crop&q=80&w=800',
    bio: 'Explosive power, unmatched endurance.'
  },
  {
    id: "3",
    name: 'RAUL MENDEZ',
    role: 'Strength Specialist',
    img: 'https://images.unsplash.com/photo-1567013127542-490d757e51fe?auto=format&fit=crop&q=80&w=800',
    bio: 'Heavy lifting, pure focus, total results.'
  },
  {
    id: "4",
    name: 'ELENA ROSS',
    role: 'Mobility Expert',
    img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
    bio: 'Mastering movement, unlocking potential.'
  }
];

const FALLBACK_TRANSFORMATIONS: Transformation[] = [
  {
    id: "1",
    name: 'CHRIS J.',
    weeks: '12',
    quote: "FitX didn't just change my body; it changed my entire mindset.",
    before: 'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?auto=format&fit=crop&q=80&w=800',
    after: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: "2",
    name: 'MAY L.',
    weeks: '24',
    quote: 'From cardio-only to lifting twice my bodyweight. Elite trainers.',
    before: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
    after: 'https://images.unsplash.com/photo-1548691906-c215a091934c?auto=format&fit=crop&q=80&w=800'
  }
];

// Helper mapping function to render dynamic icon for role
const getRoleIcon = (role: string) => {
  const r = role.toLowerCase();
  if (r.includes('hiit') || r.includes('explosive')) return <Zap className="w-5 h-5" />;
  if (r.includes('strength') || r.includes('weight')) return <Weight className="w-5 h-5" />;
  if (r.includes('mobility') || r.includes('heart')) return <Heart className="w-5 h-5" />;
  return <Dumbbell className="w-5 h-5" />;
};

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tData, transData] = await Promise.all([
          api.getTrainers(FALLBACK_TRAINERS),
          api.getTransformations(FALLBACK_TRANSFORMATIONS)
        ]);
        setTrainers(tData);
        setTransformations(transData);
      } catch (err) {
        setTrainers(FALLBACK_TRAINERS);
        setTransformations(FALLBACK_TRANSFORMATIONS);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  return (
    <div className="flex flex-col w-full premium-bg min-h-screen pt-32 pb-20 overflow-x-hidden text-white font-sans relative">
      <BackgroundGlows />

      {/* Hero Section */}
      <section className="px-6 md:px-24 mb-20">
        <ScrollReveal type="slide-up">
          <div className="max-w-4xl">
            <h1 className="font-black text-6xl md:text-9xl tracking-tight mb-8 leading-none uppercase italic">
              The Elite <br /> <span className="text-[#FF7200]">Squad</span>
            </h1>
            <p className="text-white/60 font-black text-xl md:text-3xl tracking-tight uppercase max-w-2xl">
              Mandated by strength. Driven by precision. meet the architects of your evolution.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <ScrollReveal type="slide-up">
        <TimerOffer />
      </ScrollReveal>

      {/* Trainers Grid */}
      <section className="py-16 px-6 md:px-24 max-w-screen-2xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, idx) => (
            <ScrollReveal key={trainer.name} type="scale" delay={idx * 100}>
              <div className="glass-panel rounded-[40px] overflow-hidden group transition-all duration-700 hover:bg-white/10 border border-white/5">
                <div className="h-[450px] overflow-hidden relative">
                  <img src={trainer.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt={trainer.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <span className="text-[#FF7200] font-black text-[10px] tracking-widest uppercase block mb-2">{trainer.role}</span>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">{trainer.name}</h3>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <p className="text-white/40 font-bold text-sm uppercase">{trainer.bio}</p>
                  <div className="flex gap-4 pt-4 border-t border-white/5">
                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-[#FF7200] hover:text-black transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="flex-grow flex items-center justify-center gap-3 bg-white text-black font-black text-[10px] tracking-widest uppercase rounded-xl hover:bg-[#FF7200] transition-colors">
                      <span>View Profile</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Transformations */}
      <section className="py-40 bg-black/40 border-y border-white/5">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-24 w-full">
          <ScrollReveal type="slide-up">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
              <div>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic">TRANSFORMATIONS</h2>
                <p className="text-[#FF7200] font-black text-xl md:text-2xl uppercase tracking-tighter mt-4">REAL RESULTS. NO EXCUSES.</p>
              </div>
              <button className="hidden md:flex items-center gap-4 text-[#FF7200] font-black text-xs tracking-widest uppercase group">
                <span>VIEW ALL STORIES</span>
                <div className="w-10 h-10 rounded-full border border-[#FF7200]/30 flex items-center justify-center group-hover:bg-[#FF7200] group-hover:text-black transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {transformations.map((t, idx) => (
              <ScrollReveal key={t.id} type="scale" delay={idx * 200}>
                <div className="relative group overflow-hidden rounded-[60px] border border-white/10 shadow-2xl">
                  <div className="grid grid-cols-2 gap-1 h-[600px]">
                    <div className="relative">
                      <img src={t.before} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-all duration-1000" alt="Before" />
                      <div className="absolute top-8 left-8 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/10">BEFORE</div>
                    </div>
                    <div className="relative">
                      <img src={t.after} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt="After" />
                      <div className="absolute top-8 right-8 bg-[#FF7200] text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">AFTER</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-8">
                    <h4 className="text-4xl md:text-5xl font-black text-white uppercase italic">{t.name} - {t.weeks} WEEKS</h4>
                    <p className="text-[#FF7200] font-bold text-xl mt-4 max-w-lg leading-snug">"{t.quote}"</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
