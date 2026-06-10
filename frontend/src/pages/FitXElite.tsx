import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Check,
  X,
  Star,
  Activity,
  Zap,
  Play,
  Shield,
  ShieldCheck,
  Smartphone,
  CirclePlay,
  BadgeCent,
  Flower2,
  Dumbbell,
  Flame,
  Music,
  Timer
} from 'lucide-react';
import FitnessSubNav from '../components/FitnessSubNav';
import ScrollReveal from '../components/ScrollReveal';
import { useUI } from '../context/UIContext';
import { TimerOffer } from '../components/TimerOffer';
import { Link } from 'react-router-dom';
import PrismaticBurst from '../components/PrismaticBurst';
import { api, PageHeroData } from '../lib/api';

const CanvasScrollBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    let animationFrame: number;
    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > dimensions.width) p.vx *= -1;
        if (p.y < 0 || p.y > dimensions.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(246, 224, 94, 0.3)';
        ctx.fill();
      });
      animationFrame = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [dimensions]);

  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="opacity-40" />
    </div>
  );
};

const Hero = ({ data }: { data: PageHeroData | null }) => {
  const { setIsFreeTrialModalOpen, isLoggedIn, setIsLoginModalOpen } = useUI();

  const title = data?.title || 'fitXpass ELITE';
  const subtitle = data?.subtitle || 'Starting at ₹1233 / month*';
  const rawDescription = data?.description || 'Unlimited access to at-centre group classes\nAll ELITE & PRO gyms';
  const image = data?.image || '/elite-hero.png';
  const ctaText = data?.ctaText || 'TRY FOR FREE';

  // Split description by newline into bullets
  const bullets = rawDescription.split('\n').filter(Boolean);

  return (
    <section id="hero" className="relative w-full overflow-hidden scroll-mt-32 bg-[#0A0F24]">
      <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row min-h-[85vh]">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-20 py-10 lg:py-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-baseline gap-3 mb-12">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
                {title.includes(' ') ? (
                  <>
                    {title.substring(0, title.lastIndexOf(' '))} <span className="text-[#FF7200]">{title.substring(title.lastIndexOf(' ') + 1)}</span>
                  </>
                ) : (
                  <span className="text-[#FF7200]">{title}</span>
                )}
              </h1>
            </div>

            <ul className="space-y-6 mb-12">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-4 text-white/90 text-2xl font-bold">
                  <ChevronRight className="w-5 h-5 text-[#FF7200]" />
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="mb-12">
              <p className="text-white/60 text-2xl font-bold tracking-tight">
                {subtitle.includes('₹') ? (
                  <>
                    {subtitle.split('₹')[0]}<span className="text-white font-black text-3xl">₹{subtitle.split('₹')[1]}</span>
                  </>
                ) : (
                  subtitle
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => setIsFreeTrialModalOpen(true)}
                className="bg-[#2d3340] text-white font-black px-10 py-4 rounded-md tracking-widest text-[10px] uppercase hover:bg-white hover:!text-[#0A0F24] transition-all duration-300"
              >
                {ctaText}
              </button>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setIsLoginModalOpen(true);
                  }
                }}
                className="bg-white text-black font-black px-10 py-4 rounded-md tracking-widest text-[10px] uppercase hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                BUY NOW
              </button>
            </div>

            <p className="text-white/30 text-[10px] font-bold uppercase tracking-tight italic">
              *Effective Monthly Pricing including Extension, if any
            </p>
          </motion.div>
        </div>

        <div className="flex-1 relative min-h-[60vh] lg:min-h-0">
          <img
            src={image}
            className="absolute inset-0 w-full h-full object-cover object-center"
            alt={title}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-transparent to-transparent lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 via-transparent to-transparent lg:hidden block" />
        </div>
      </div>
    </section>
  );
};

const FeaturesGrid = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  return (
    <section id="features" className="py-12 relative overflow-hidden scroll-mt-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-white/40 font-black tracking-[0.4em] uppercase text-[10px] mb-3">{content.features_subtitle || 'Features'}</p>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">{content.features_title || 'For an active lifestyle'}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Card 1: Unlimited Access */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#161616] rounded-[40px] p-6 flex flex-col items-center justify-center text-center border border-white/5 relative overflow-hidden"
          >
            {/* Premium Accent Ambient Texture */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF7200]/10 blur-[70px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF8B10]/5 blur-[80px] rounded-full" />
            </div>

            <div className="relative z-10">
              <h3 className="text-[#FF7200] font-black text-lg uppercase tracking-tight mb-2">Unlimited access to</h3>
              <div className="text-7xl font-black text-[#FF7200] mb-2 tracking-tighter drop-shadow-[0_0_30px_rgba(255,114,0,0.3)]">300+</div>
              <p className="text-white font-bold text-sm tracking-widest uppercase opacity-80">ELITE & PRO GYMS</p>
            </div>
          </motion.div>

          {/* Card 2: Multiple workout formats (Tall) */}
          <motion.div
            whileHover={{ y: -5 }}
            className="row-span-2 md:row-span-2 bg-[#161616] rounded-[40px] p-6 flex flex-col items-center text-center border border-white/5 relative overflow-hidden"
          >
            <h3 className="text-[#FF7200] font-black text-2xl uppercase tracking-tight mb-12 relative z-10">Multiple workout<br />formats</h3>

            {/* Luxury Orbital Constellation Background */}
            <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center pointer-events-none">
              {/* Rich Ambient Blur Core */}
              <div className="absolute w-[350px] h-[350px] bg-[#FF7200]/10 blur-[90px] rounded-full animate-pulse duration-[5000ms]" />

              {/* Matrix Grid Base */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Rotating Dashboard Ring 1 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute opacity-[0.15]"
              >
                <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="250" cy="250" r="130" stroke="white" strokeWidth="0.5" strokeDasharray="4 10" />
                  <circle cx="250" cy="250" r="190" stroke="#FF7200" strokeWidth="1.5" strokeDasharray="30 50" />
                  <circle cx="250" cy="250" r="260" stroke="white" strokeWidth="0.5" strokeDasharray="2 15" />
                </svg>
              </motion.div>

              {/* Counter-Rotating Ring 2 */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
                className="absolute opacity-[0.12]"
              >
                <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="250" cy="250" r="160" stroke="#FF8B10" strokeWidth="2" strokeDasharray="90 30" />
                  <circle cx="250" cy="250" r="220" stroke="white" strokeWidth="0.5" strokeDasharray="8 24" />
                </svg>
              </motion.div>
            </div>

            <div className="relative w-full h-[400px] z-10">
              {/* Orbital Matrix Nodes (Positioned precisely along the concentric SVG background rings) */}
              {[
                { name: 'YOGA', top: 'calc(50% - 120px)', left: '50%', icon: <Flower2 className="w-9 h-9 text-[#FF7200]" /> },
                { name: 'HIIT', top: 'calc(50% - 38px)', left: 'calc(50% + 114px)', icon: <Zap className="w-9 h-9 text-[#FF7200]" /> },
                { name: 'BOXING', top: 'calc(50% + 97px)', left: 'calc(50% + 71px)', icon: <Activity className="w-9 h-9 text-[#FF7200]" /> },
                { name: 'HRX', top: 'calc(50% + 97px)', left: 'calc(50% - 71px)', icon: <Flame className="w-9 h-9 text-[#FF7200]" /> },
                { name: 'DANCE', top: 'calc(50% - 38px)', left: 'calc(50% - 114px)', icon: <Music className="w-9 h-9 text-[#FF7200]" /> },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -8, 0],
                    x: [0, 4, 0],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{ scale: 1.15 }}
                  style={{ top: b.top, left: b.left }}
                  className="absolute flex flex-col items-center justify-center group cursor-pointer z-20 -translate-x-1/2 -translate-y-1/2 w-24 h-24"
                >
                  {/* Holographic Ambient Backing Glow */}
                  <div className="absolute w-12 h-12 bg-[#FF7200]/10 opacity-0 group-hover:opacity-100 blur-[15px] rounded-full transition-opacity duration-500" />

                  {/* Concentric Node Dot Indicator (Blends with background grid) */}
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-[#FF7200]/40 border border-white/20 group-hover:scale-150 group-hover:bg-[#FF7200] transition-all duration-300" />

                  {/* Naked Glowing Icon */}
                  <div className="relative z-10 flex items-center justify-center text-[#FF7200] drop-shadow-[0_0_15px_rgba(255,114,0,0.5)] group-hover:scale-110 transition-transform duration-300 mb-2">
                    {b.icon}
                  </div>

                  {/* Minimalist Glowing Text Label */}
                  <span className="relative z-10 text-[10px] font-black text-white/60 tracking-widest uppercase group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,114,0,0.6)] transition-all duration-300">
                    {b.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Card 3: AT HOME LIVE WORKOUTS */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#161616] rounded-[40px] p-6 flex flex-col items-center justify-center text-center border border-white/5 relative overflow-hidden"
          >
            {/* Background Texture & Glows */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF7200]/10 blur-[80px] rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FF7200]/10 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,114,0,0.2)] border border-[#FF7200]/20">
                <Star className="w-8 h-8 text-[#FF7200]" fill="currentColor" />
              </div>
              <h3 className="text-[#FF7200] font-black text-4xl uppercase tracking-tighter mb-1">AT HOME</h3>
              <p className="text-white font-bold text-xs tracking-widest uppercase opacity-80">LIVE WORKOUTS</p>
            </div>
          </motion.div>

          {/* Card 4: At center Group Classes */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#161616] rounded-[40px] overflow-hidden border border-white/5 relative group"
          >
            <img src="/group-class.png" className="absolute inset-0 w-full h-full object-cover grayscale-[0.8] group-hover:grayscale-0 transition-all duration-700" alt="Group Classes" />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-700" />
            <div className="absolute bottom-10 left-10 text-left z-10">
              <h3 className="text-[#FF7200] font-black text-3xl uppercase tracking-tighter leading-tight drop-shadow-lg">At center Group<br />Classes</h3>
            </div>
          </motion.div>

          {/* Card 5: SMART Workout plans */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#161616] rounded-[40px] p-8 flex flex-col items-center justify-center text-center border border-white/5 relative overflow-hidden"
          >
            {/* Background Texture & Glows */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#FF7200]/10 blur-[80px] rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#FF7200]/20 relative z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <img src="/trainer-face.png" className="w-full h-full object-cover" alt="Trainer" />
                </div>
                {/* Waves/Audio animation effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 border border-[#FF7200]/10 rounded-full animate-ping opacity-30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-[#FF7200]/20 rounded-full animate-pulse opacity-40" />
              </div>
              <h3 className="text-white font-black text-xs uppercase tracking-widest mb-1 opacity-60">SMART</h3>
              <p className="text-[#FF7200] font-black text-3xl uppercase tracking-tighter">Workout plans</p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

const TrainerLedClasses = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  const classes = [
    {
      name: 'evolve YOGA',
      tags: 'FLEXIBILITY • MINDFUL TRANSITIONS',
      img: '/yoga-card.png',
      icon: <Flower2 className="w-8 h-8 text-[#FF7200]" />,
      explore: true
    },
    {
      name: 'fitX strength +',
      tags: 'PLYO-AGILITY • ENDURANCE',
      img: '/strength-card.png',
      icon: <Dumbbell className="w-8 h-8 text-[#FF7200]" />,
      explore: true
    },
    {
      name: 'HRX WORKOUT',
      tags: 'MUSCLE GAIN • STRENGTH',
      img: '/hrx-card.png',
      icon: <Flame className="w-8 h-8 text-[#FF7200]" />,
      explore: true
    },
    {
      name: 'fitX RUN',
      tags: 'OUTDOOR • AEROBIC RUN',
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
      icon: <Timer className="w-8 h-8 text-[#FF7200]" />,
      explore: true
    },
  ];

  return (
    <section id="classes" className="py-12 overflow-hidden relative border-t border-white/5 scroll-mt-32">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-white/40 font-black tracking-[0.4em] uppercase text-[10px] mb-3">{content.classes_subtitle || 'AT-CENTER'}</p>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">{content.classes_title || 'Trainer-led group classes'}</h2>
        </div>

        <div className="relative group">
          <div className="flex gap-6 overflow-x-auto pb-12 scrollbar-hide snap-x px-4">
            {classes.map((c, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                className="min-w-[300px] md:min-w-[400px] relative rounded-[40px] overflow-hidden snap-center border border-white/10 group/card bg-[#0A0F24] flex flex-col shadow-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={c.img} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" alt={c.name} />
                </div>
                <div className="p-6 text-center flex flex-col items-center justify-center flex-grow">
                  <span className="text-4xl mb-4 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">{c.icon}</span>
                  <h3 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 leading-none">{c.name}</h3>
                  <p className="text-white/40 font-bold text-[10px] tracking-[0.2em] uppercase">{c.tags}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-black/50 backdrop-blur-md border border-white/10 rounded-full hidden md:flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all -translate-x-1/2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-black/50 backdrop-blur-md border border-white/10 rounded-full hidden md:flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-x-1/2">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

const AtHomeWorkouts = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  const { isLoggedIn, setIsLoginModalOpen } = useUI();
  const workouts = [
    {
      trainer: 'Nandini Shetty',
      title: 'Dance Fitness Xtreme',
      type: 'DANCE • INTERMEDIATE • 47 Min',
      img: '/athome1.jpeg',
      live: '26+ LIVE',
      btn: 'JOIN'
    },
    {
      trainer: 'Rahul Shetty',
      title: 'Cardio HIIT',
      type: 'CARDIO • BEGINNER • 30 Min',
      img: '/athome2.jpeg',
      btn: 'BOOK'
    },
    {
      trainer: 'Isheeta Ray',
      title: 'Dance Fitness Xpress',
      type: 'DANCE • BEGINNER • 33 Min',
      img: '/athome3.jpeg',
      btn: 'BOOK'
    }
  ];

  return (
    <section id="at-home" className="py-16 overflow-hidden relative border-t border-white/5 scroll-mt-32">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-white/40 font-black tracking-[0.4em] uppercase text-[10px] mb-3">{content.athome_subtitle || 'AT-HOME'}</p>
          <h2 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-tighter leading-none">{content.athome_title || 'Unlimited home workouts with calorie tracking'}</h2>
        </div>

        <div className="relative">
          <div className="flex flex-wrap justify-center gap-8 px-4">
            {workouts.map((w, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="min-w-[300px] md:min-w-[340px] max-w-[360px] rounded-[16px] overflow-hidden bg-[#2a3038] flex flex-col group/card border border-white/5 shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={w.img} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" alt={w.title} />
                  {w.live && (
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-black text-white z-10 tracking-wider">
                      {w.live}
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col items-center text-center flex-1">
                  <p className="text-white/50 font-medium text-xs mb-2">{w.trainer}</p>
                  <h3 className="text-white font-bold text-xl mb-2 tracking-tight">{w.title}</h3>
                  <p className="text-white/60 font-bold text-[10px] tracking-wider uppercase mb-6">{w.type}</p>

                  <div className="mt-auto">
                    <button
                      onClick={() => {
                        if (!isLoggedIn) setIsLoginModalOpen(true);
                      }}
                      className="flex items-center gap-2 bg-[#373e48] text-white font-bold px-6 py-2 rounded-lg text-[11px] tracking-wider uppercase hover:bg-white hover:text-black transition-all"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                      JOIN
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TrainersSection = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  const trainers = [
    { name: 'SHWE', role: 'STRENGTH', img: '/t1.png' },
    { name: 'KARAN', role: 'BODYBUILDING', img: '/t2.png' },
    { name: 'VIKRAM', role: 'FUNCTIONAL', img: '/t3.png' },
    { name: 'ROHIT', role: 'FITNESS', img: '/t4.png' },
  ];

  return (
    <section id="trainers" className="py-16 overflow-hidden relative border-t border-white/5 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <h2 className="text-[10vw] font-black text-[#0A0F24]/[0.05] tracking-tighter uppercase leading-none translate-y-[-10%]">
            TRAINERS
          </h2>
        </div>

        <div className="text-center mb-24 relative z-10">
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">{content.trainers_title || 'Best in class'}</h3>
        </div>

        <div className="relative z-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-end">
            {trainers.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center group/trainer cursor-pointer"
              >
                <div className="relative w-full aspect-[4/5] flex items-end justify-center overflow-visible mb-8">
                  <img
                    src={t.img}
                    className="h-full w-auto object-contain filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.8)] group-hover/trainer:scale-105 transition-all duration-500 origin-bottom z-10"
                    alt={t.name}
                  />
                  {/* Soft drop shadow under figure */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-black/80 rounded-full blur-3xl -z-10 opacity-90"></div>
                </div>
                <div className="text-center relative z-20">
                  <h4 className="text-white font-black text-xl md:text-3xl uppercase tracking-tighter leading-none mb-2 drop-shadow-lg whitespace-nowrap">{t.name}</h4>
                  <p className="text-white/40 font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase whitespace-nowrap">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const MembershipComparison = () => {
  const { isLoggedIn, setIsLoginModalOpen } = useUI();
  const [selectedPlan, setSelectedPlan] = useState('24 MONTHS');

  const handleBuy = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      // Proceed with purchase logic
      alert('Proceeding to checkout...');
    }
  };

  const plans = [
    {
      duration: '24 MONTHS',
      price: '₹1499/MO*',
      elitePrice: '1350', plusPrice: '1499',
      eliteTotal: '32400', plusTotal: '35990',
      pause: { plus: '120', elite: '60' },
      sessions: { plus: '120', elite: '60' },
      swimming: { plus: '10', elite: 'X' }
    },
    {
      duration: '12 MONTHS',
      price: '₹1599/MO*',
      elitePrice: '1454', plusPrice: '1599',
      eliteTotal: '17450', plusTotal: '19190',
      pause: { plus: '60', elite: '30' },
      sessions: { plus: '60', elite: '30' },
      swimming: { plus: '5', elite: 'X' }
    },
    {
      duration: '6 MONTHS',
      price: '₹2608/MO*',
      elitePrice: '2375', plusPrice: '2608',
      eliteTotal: '14250', plusTotal: '15650',
      pause: { plus: '30', elite: '15' },
      sessions: { plus: '30', elite: '15' },
      swimming: { plus: '2', elite: 'X' }
    },
    {
      duration: '3 MONTHS',
      price: '₹3303/MO*',
      elitePrice: '3150', plusPrice: '3303',
      eliteTotal: '9450', plusTotal: '9910',
      pause: { plus: '15', elite: '7' },
      sessions: { plus: '15', elite: '7' },
      swimming: { plus: 'X', elite: 'X' }
    },
    {
      duration: '1 MONTH',
      price: '₹6875/MO*',
      elitePrice: '6250', plusPrice: '6875',
      eliteTotal: '6250', plusTotal: '6875',
      pause: { plus: '5', elite: '2' },
      sessions: { plus: '5', elite: '2' },
      swimming: { plus: 'X', elite: 'X' }
    },
  ];

  const currentPlanData = plans.find(p => p.duration === selectedPlan) || plans[0];

  const features = [
    { label: 'Membership Pause Days', plus: currentPlanData.pause.plus, elite: currentPlanData.pause.elite },
    { label: 'Other City Sessions', plus: currentPlanData.sessions.plus, elite: currentPlanData.sessions.elite },
    { label: 'Swimming Sessions', plus: currentPlanData.swimming.plus, elite: currentPlanData.swimming.elite },
    { label: 'Membership Transfer', plus: '✔', elite: 'X' },
    { label: 'Video workouts', plus: '✔', elite: '10000+' },
    { label: 'Total Payable', plus: `₹${currentPlanData.plusTotal}`, elite: `₹${currentPlanData.eliteTotal}` },
  ];

  return (
    <section id="comparison" className="py-12 border-t border-white/5 scroll-mt-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">fitX ELITE</h2>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">2 flexible plans to suit your fitness Needs</p>
        </div>

        {/* Duration Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {plans.map((p) => (
            <button
              key={p.duration}
              onClick={() => setSelectedPlan(p.duration)}
              className={`px-8 py-4 rounded-2xl border transition-all flex flex-col items-center min-w-[160px] ${selectedPlan === p.duration
                ? 'bg-[#FF7200]/10 border-[#FF7200] shadow-[0_0_20px_rgba(246,224,94,0.1)]'
                : 'bg-[#1c1c1c] border-white/5 hover:border-white/20'
                }`}
            >
              <span className={`text-[10px] font-black tracking-[0.2em] uppercase mb-1 ${selectedPlan === p.duration ? 'text-[#FF7200]' : 'text-white/40'}`}>
                {p.duration}
              </span>
              <span className={`text-sm font-black ${selectedPlan === p.duration ? 'text-white' : 'text-white/60'}`}>
                {p.price}
              </span>
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 mb-8">
            <div />
            <div className="text-center">
              <h3 className="text-[#c084fc] font-black text-2xl md:text-4xl tracking-tighter uppercase leading-tight italic mb-2">
                ELITE<br />PLUS
              </h3>
              <p className="text-white/40 text-[10px] font-black uppercase">₹{currentPlanData.plusPrice}/MO*</p>
            </div>
            <div className="text-center">
              <h3 className="text-[#FF7200] font-black text-2xl md:text-4xl tracking-tighter uppercase leading-tight italic mb-2">
                ELITE
              </h3>
              <p className="text-white/40 text-[10px] font-black uppercase">₹{currentPlanData.elitePrice}/MO*</p>
            </div>
          </div>

          <div className="space-y-1">
            {features.map((f, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 py-6 items-center border-b border-white/5 ${f.label === 'Total Payable' ? 'mt-8 border-t border-white/10' : ''}`}
              >
                <div className={`text-white/60 font-black text-xs md:text-sm uppercase tracking-tighter ${f.label === 'Total Payable' ? 'text-white text-lg' : ''}`}>
                  {f.label}
                </div>
                <div className={`text-center font-black ${f.plus === '✔' ? 'text-[#c084fc] text-xl' : 'text-white'} ${f.label === 'Total Payable' ? 'text-[#c084fc] text-2xl' : 'text-sm'}`}>
                  {f.plus}
                </div>
                <div className={`text-center font-black ${f.elite === 'X' ? 'text-white/20' : 'text-white'} ${f.label === 'Total Payable' ? 'text-white text-2xl' : 'text-sm'}`}>
                  {f.elite}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 mt-12">
            <div />
            <div className="flex justify-center px-4">
              <button
                onClick={handleBuy}
                className="w-full bg-white text-black font-black py-4 rounded-xl text-[10px] tracking-widest uppercase hover:scale-105 transition-all"
              >
                BUY
              </button>
            </div>
            <div className="flex justify-center px-4">
              <button
                onClick={handleBuy}
                className="w-full bg-white text-black font-black py-4 rounded-xl text-[10px] tracking-widest uppercase hover:scale-105 transition-all"
              >
                BUY
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MembershipPricingCards = () => {
  const [activePlan, setActivePlan] = useState<'plus' | 'elite'>('plus');

  const benefits = [
    { icon: <CirclePlay className="w-5 h-5" />, title: 'Buy Now', sub: 'start anytime' },
    { icon: <Activity className="w-5 h-5" />, title: 'Pause', sub: 'pack anytime' },
    { icon: <Shield className="w-5 h-5" />, title: 'Safest', sub: 'gyms in town' },
    { icon: <BadgeCent className="w-5 h-5" />, title: 'No-Cost', sub: 'EMI available' },
  ];

  const pricingCards = activePlan === 'plus' ? [
    {
      months: '12',
      originalPrice: '21530',
      price: '19190',
      monthly: '1599',
      features: [
        'Extra ₹2,000 OFF applied',
        'Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)',
        '60 days of membership pause',
        'Access 60 sessions in other cities',
        '5 swimming sessions',
        'Free membership transfer within 90 days',
        '2 more Offers',
      ]
    },
    {
      months: '6',
      originalPrice: '17555',
      price: '15650',
      monthly: '2608',
      features: [
        'Extra ₹1,600 OFF applied',
        'Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)',
        '30 days of membership pause',
        'Access 30 sessions in other cities',
        '2 swimming sessions',
        'Free membership transfer within 45 days',
        '2 more Offers',
      ]
    },
    {
      months: '3',
      originalPrice: '13031',
      price: '11589',
      monthly: '3863',
      features: [
        'Extra ₹1,200 OFF applied',
        'Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)',
        '10 days of membership pause',
        'Access 15 sessions in other cities',
        '1000+ workout videos',
        '₹500 OFF* on fitX activewear',
        '1 more Offers',
      ]
    }
  ] : [
    {
      months: '12',
      originalPrice: '19500',
      price: '17450',
      monthly: '1454',
      features: [
        'Extra ₹2,000 OFF applied',
        'Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)',
        '30 days of membership pause',
        'Access 30 sessions in other cities',
        '15% OFF* on cult activewear',
      ]
    },
    {
      months: '6',
      originalPrice: '15955',
      price: '14250',
      monthly: '2375',
      features: [
        'Extra ₹1,600 OFF applied',
        'Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)',
        '15 days of membership pause',
        'Access 15 sessions in other cities',
        '15% OFF* on cult activewear',
      ]
    },
    {
      months: '3',
      originalPrice: '11831',
      price: '10550',
      monthly: '3517',
      features: [
        'Extra ₹1,200 OFF applied',
        'Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)',
        '5 days of membership pause',
        'Access 9 sessions in other cities',
        '15% OFF* on cult activewear',
      ]
    }
  ];

  return (
    <section id="pricing" className="py-12 overflow-hidden border-t border-white/5 scroll-mt-32">
      <div className="max-w-5xl mx-auto px-6">
        {/* Plan Toggles */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
          <button
            onClick={() => setActivePlan('plus')}
            className={`px-12 py-8 rounded-[32px] border transition-all text-center min-w-[320px] relative overflow-hidden group ${activePlan === 'plus'
              ? 'border-[#00E5FF] bg-[#0A0F24] shadow-[0_0_50px_rgba(0,229,255,0.15)] text-white'
              : 'border-[#151E32]/10 bg-[#151E32]/5 text-[#0A0F24] hover:bg-[#151E32]/10 transition-all opacity-80 hover:opacity-100'
              }`}
          >
            <h4 className={`font-black text-3xl uppercase tracking-tighter mb-1 italic ${activePlan === 'plus' ? 'text-[#00E5FF]' : 'text-[#0A0F24]'}`}>ELITE PLUS</h4>
            <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${activePlan === 'plus' ? 'text-white/80' : 'text-[#0A0F24]/60'}`}>All Centers & Gyms in India</p>
          </button>
          <button
            onClick={() => setActivePlan('elite')}
            className={`px-12 py-8 rounded-[32px] border transition-all text-center min-w-[320px] relative overflow-hidden group ${activePlan === 'elite'
              ? 'border-[#00E5FF] bg-[#0A0F24] shadow-[0_0_50px_rgba(0,229,255,0.15)] text-white'
              : 'border-[#151E32]/10 bg-[#151E32]/5 text-[#0A0F24] hover:bg-[#151E32]/10 transition-all opacity-80 hover:opacity-100'
              }`}
          >
            <h4 className={`font-black text-3xl uppercase tracking-tighter mb-1 italic ${activePlan === 'elite' ? 'text-[#00E5FF]' : 'text-[#0A0F24]'}`}>ELITE</h4>
            <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${activePlan === 'elite' ? 'text-white/80' : 'text-[#0A0F24]/60'}`}>All Centers & Gyms in City</p>
          </button>
        </div>

        {/* Benefits Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20 border-b border-white/5 pb-16">
          {benefits.map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FF7200] mb-5 group-hover:scale-110 group-hover:bg-[#FF7200]/10 transition-all">
                {b.icon}
              </div>
              <h5 className="text-white font-black text-sm uppercase tracking-tight">{b.title}</h5>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] leading-none mt-2">{b.sub}</p>
            </div>
          ))}
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingCards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-[#1c1c1c] border border-white/5 rounded-[48px] p-8 flex flex-col h-full group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-16 relative z-10">
                <div className="flex flex-col">
                  <span className="text-6xl font-black text-white leading-none mb-2">{card.months}</span>
                  <span className="text-xs font-black text-white/40 uppercase tracking-[0.3em]">MONTHS</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-white/20 font-black line-through block mb-1 italic">₹{card.originalPrice}</span>
                  <span className="text-5xl font-black text-white block mb-2 tracking-tighter">₹{card.price}</span>
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">{card.monthly} per month*</span>
                </div>
              </div>

              <div className="flex-grow space-y-5 mb-16 relative z-10">
                {card.features.map((f, fi) => (
                  <div key={fi} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF7200] mt-1.5 shrink-0" />
                    <p className="text-white/70 text-[11px] font-bold leading-snug uppercase tracking-tight">{f}</p>
                  </div>
                ))}
              </div>

              <button className="w-full bg-white text-black font-black py-5 rounded-2xl text-[10px] tracking-[0.3em] uppercase hover:bg-[#FF7200] transition-all relative z-10">
                BUY NOW
              </button>

              {/* Subtle Card Glow */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#FF7200]/5 rounded-full blur-[80px] group-hover:bg-[#FF7200]/10 transition-all" />
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mt-16">
          *Effective Monthly Pricing including Extension, if any
        </p>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "What kind of workout formats are available at fitX?", a: "We offer a wide range of formats including Yoga, HIIT, Strength Training, Dance Fitness, HRX, and more. Each session is designed by elite trainers to maximize results." },
    { q: "How is the fitX center different from a regular gym?", a: "Unlike traditional gyms, fitX focuses on community-driven, trainer-led group classes in a high-tech environment. We combine digital tracking with cinematic workouts for a superior experience." },
    { q: "What is fitX ELITE?", a: "fitX ELITE is our premium membership that gives you unlimited access to all fitX centers, gyms in your city, and at-home live workouts." },
    { q: "Why should I buy a fitX ELITE?", a: "It's the ultimate all-in-one fitness solution. You get access to the best trainers, premium equipment, and a flexible schedule that fits your lifestyle." },
    { q: "I want to buy a fitX ELITE. How do I do that?", a: "You can purchase it directly through our website or mobile app. Simply choose your duration, select a plan, and complete the payment." },
    { q: "Can I pause my membership? How do I do it?", a: "Yes, ELITE memberships come with pause days (up to 60 days depending on the plan). You can pause it anytime via the fitX app." },
    { q: "I'm moving to a different city. Can I transfer my membership?", a: "Absolutely. ELITE PLUS memberships offer national access, while ELITE memberships can be transferred to other cities with a simple request in the app." },
    { q: "How do I book a free fitX class?", a: "New users can book a trial class through the fitX app. Just select a center near you and pick an available slot." },
    { q: "What is the difference between fitX ELITE and fitX PRO?", a: "ELITE offers access to premium centers and group classes, while PRO is focused on high-quality gym access. ELITE includes all PRO benefits plus more." },
    { q: "What is a ELITE gym?", a: "An ELITE gym is a top-tier facility equipped with state-of-the-art machines, expert trainers, and premium amenities to provide an unmatched workout experience." }
  ];

  return (
    <section id="faq" className="py-16 border-t border-white/5 scroll-mt-32">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-20 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">FAQS</h2>
            <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">FITXPASS ELITE</p>
          </div>
          <button className="text-white/40 font-black text-[10px] tracking-widest uppercase hover:text-white transition-all">
            SEE ALL
          </button>
        </div>

        <div className="space-y-1">
          {faqs.map((faq, i) => (
            <div key={i} className="overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full py-8 flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-1 h-1 rounded-full bg-[#FF7200]" />
                  <span className="text-white font-bold text-sm md:text-base group-hover:text-[#FF7200] transition-all">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-white/20 transition-transform duration-500 ${openIndex === i ? 'rotate-180 text-[#FF7200]' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="pb-8 pl-5 text-white/40 text-sm leading-relaxed max-w-2xl font-medium">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function FitXElite() {
  const { setIsFreeTrialModalOpen, isLoggedIn } = useUI();
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);

  useEffect(() => {
    api.getPageHeroes()
      .then(heroes => {
        const eliteHero = heroes.find(h => h.pageKey === 'elite');
        if (eliteHero) setHeroData(eliteHero);
      })
      .catch(err => console.error("Error loading elite hero", err));
  }, []);

  return (
    <div className="relative w-full min-h-screen pt-16 selection:bg-[#FF7200]/30 premium-bg">
      <CanvasScrollBg />
      <FitnessSubNav />

      <div className="flex flex-col">
        <ScrollReveal type="fade"><Hero data={heroData} /></ScrollReveal>
        <TimerOffer />
        <ScrollReveal type="slide-up"><FeaturesGrid data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><TrainerLedClasses data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up">
          <AtHomeWorkouts data={heroData} />
        </ScrollReveal>
        <ScrollReveal type="fade"><TrainersSection data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><MembershipComparison /></ScrollReveal>
        <ScrollReveal type="scale"><MembershipPricingCards /></ScrollReveal>
        <ScrollReveal type="slide-up"><FAQSection /></ScrollReveal>
      </div>
    </div>
  );
}

