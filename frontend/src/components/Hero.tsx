import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { api, PageHeroData } from '../lib/api';

export default function Hero() {
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 100]);

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

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  const videoSrc = heroData?.video || '/hero-bg.mp4';
  const title = heroData?.title || 'FitX';
  const subtitle = heroData?.subtitle || 'WE ARE';
  const description = heroData?.description || 'A fitness movement that is worth\nbreaking a sweat for';
  const ctaText = heroData?.ctaText || 'EXPLORE fitxpass';

  return (
    <section 
      id="hero" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[#0A0F24]"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          key="desktop-video"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
        >
          <source src="/videos/video1.mp4" type="video/mp4" />
        </video>
        <video
          key="mobile-video"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover block md:hidden"
        >
          <source src="/videos/video1_mobile.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Scroll-driven Container */}
      <motion.div 
        style={{ opacity: scrollOpacity, scale: scrollScale, y: scrollY }}
        className="relative z-20 text-center px-6 max-w-7xl pt-24 md:pt-0 w-full flex flex-col items-center"
      >
        {/* Welcome Text (Subtitle) */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[#FFA040] font-black text-xl md:text-2xl tracking-widest uppercase mb-6 drop-shadow-md"
        >
          {subtitle}
        </motion.h2>

        {/* Main FITX Heading - Clean Typography */}
        <div className="relative">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[120px] sm:text-[150px] md:text-[200px] lg:text-[250px] leading-none tracking-tighter font-black select-none uppercase relative z-10 flex justify-center items-center mb-8 drop-shadow-2xl text-white"
          >
            {title.split('').map((char, index) => {
              const isX = char.toUpperCase() === 'X';
              return (
                <motion.span 
                  key={index}
                  animate={isX ? {
                    textShadow: [
                      '0px 0px 10px rgba(255, 160, 64,0.2)',
                      '0px 0px 40px rgba(255, 160, 64,0.7)',
                      '0px 0px 10px rgba(255, 160, 64,0.2)'
                    ]
                  } : {}}
                  transition={isX ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                  className={`inline-block ${
                    isX 
                      ? "text-[#FFA040]" 
                      : "text-white"
                  }`}
                >
                  {char}
                </motion.span>
              );
            })}
          </motion.h1>
        </div>

        {/* Description / Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/80 text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed whitespace-pre-line"
        >
          {description}
        </motion.p>

        {/* Action Button - 1.5s */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="inline-block"
          >
            <Link
              to="/fitness"
              className="group bg-[#FFA040] text-white font-black px-12 py-4 rounded-xl text-sm tracking-[0.2em] transition-all duration-300 uppercase shadow-[0_10px_20px_rgba(255, 160, 64,0.15)] hover:shadow-[0_15px_30px_rgba(255, 160, 64,0.3)] hover:bg-[#ff851f] flex items-center gap-3"
            >
              {ctaText}
              <motion.svg 
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </motion.svg>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
