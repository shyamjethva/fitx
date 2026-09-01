import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageHeroData } from '../lib/api';

const classes = [
  {
    name: 'EVOLVE YOGA',
    desc: 'FLEXIBILITY • MINDFUL TRANSITIONS',
    img: '/Yoga.jpg',
  },
  {
    name: 'ADIDAS STRENGTH+',
    desc: 'PLYO-AGILITY • ENDURANCE',
    img: '/athletic.png',
  },
  {
    name: 'HRX WORKOUT',
    desc: 'MUSCLE GAIN • STRENGTH',
    img: 'https://images.unsplash.com/photo-1517438984742-1262db08379e?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'CORE STABILITY',
    desc: 'CORE FOCUS • ENDURANCE',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'POWER LIFT',
    desc: 'MAX STRENGTH • POWER',
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'DANCE FITNESS',
    desc: 'RHYTHM • CARDIO',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'ZUMBA RUSH',
    desc: 'FUN • AEROBIC',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
  },
];

export default function FannedCardGallery({ data }: { data?: PageHeroData | null }) {
  const content = data?.contentBlocks || {};
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className="py-16 md:py-24 overflow-hidden relative bg-transparent">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 relative">
        <div className="text-center mb-12 relative z-10">
          <p className="text-[#FFA040] font-black tracking-[0.4em] uppercase text-[10px] mb-3 drop-shadow-md">
            {content.classes_subtitle || 'AT-CENTER'}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
            {content.classes_title || 'Trainer-led group classes'}
          </h2>
        </div>

        <div className="w-full max-w-7xl mx-auto h-[70vh] min-h-[500px] max-h-[700px] flex flex-col md:flex-row gap-4 px-2">
          {classes.map((cls, i) => {
            const isActive = activeIndex === i;

            return (
              <motion.div
                key={cls.name}
                onMouseEnter={() => setActiveIndex(i)}
                layout
                initial={false}
                animate={{
                  flex: isActive ? 6 : 1,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer bg-black border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.5)] group ${
                  isActive ? 'md:flex-[6]' : 'md:flex-[1]'
                } flex-1`}
              >
                <img
                  src={cls.img}
                  alt={cls.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-500 ${isActive ? 'from-black/90 via-black/40 to-transparent' : 'from-black/60 to-transparent'}`} />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full pointer-events-none">
                  <div 
                    className={`transition-all duration-500 transform ${
                      isActive 
                        ? 'opacity-100 translate-y-0 delay-100' 
                        : 'opacity-0 translate-y-10'
                    }`}
                  >
                    <h3 className="text-white font-black text-2xl md:text-4xl uppercase tracking-tighter leading-none mb-2 italic drop-shadow-lg whitespace-nowrap">
                      {cls.name}
                    </h3>
                    <p className="text-[#FFA040] font-bold tracking-widest uppercase text-[10px] md:text-xs drop-shadow-md whitespace-nowrap">
                      {cls.desc}
                    </p>
                  </div>

                  {/* Vertical Text for Inactive State (Desktop Only) */}
                  <div 
                    className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 origin-bottom-left -rotate-90 hidden md:block whitespace-nowrap ${
                      isActive ? 'opacity-0 pointer-events-none' : 'opacity-100 delay-200'
                    }`}
                  >
                    <h3 className="text-white/80 font-black text-xl uppercase tracking-widest">
                      {cls.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
