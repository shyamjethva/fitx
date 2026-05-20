import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { api, PageHeroData } from '../lib/api';

export default function Hero() {
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await api.getPageHeroes();
        const mainHome = data.find((h) => h.pageKey === 'main_home');
        if (mainHome) {
          setHeroData(mainHome);
        }
      } catch (err) {
        console.error('Failed to load main home hero config:', err);
      }
    };
    fetchHero();
  }, []);

  const videoSrc = heroData?.image || '/hero-bg.mp4';
  const title = heroData?.title || 'FitX';
  const subtitle = heroData?.subtitle || 'WE ARE';
  const description = heroData?.description || 'A fitness movement that is worth\nbreaking a sweat for';
  const ctaText = heroData?.ctaText || 'EXPLORE fitxpass';

  return (
    <section id="hero" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          key={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      <div className="relative z-20 text-center px-6 max-w-7xl pt-24 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Subtitle */}
          <h2 className="font-sans text-lg md:text-2xl text-white font-black uppercase tracking-tight -mb-1 md:-mb-2">
            {subtitle}
          </h2>

          {/* Title */}
          <h1 className="font-sans text-[70px] sm:text-[100px] md:text-[140px] lg:text-[180px] leading-[1] tracking-tight font-black select-none bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent drop-shadow-2xl uppercase">
            {title}
          </h1>

          {/* Tagline */}
          <p className="font-sans text-base md:text-xl text-white max-w-2xl mx-auto mt-0 mb-10 font-bold tracking-tight leading-snug whitespace-pre-line">
            {description}
          </p>

          {/* Action Button */}
          <Link
            to="/fitness"
            className="bg-[#00E5FF] text-[#0A0F24] font-black px-10 py-3 rounded-lg text-xs tracking-[0.2em] transition-all duration-300 uppercase shadow-2xl inline-block hover:bg-[#33EBFF] hover:scale-105"
            style={{ color: '#0A0F24' }}
          >
            {ctaText}
          </Link>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="mt-4 text-white/50 cursor-pointer"
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
