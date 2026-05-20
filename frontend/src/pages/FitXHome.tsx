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
  Video,
  Target,
  Trophy,
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
        ctx.fillStyle = 'rgba(255, 114, 0, 0.3)';
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

  const title = data?.title || 'fitX HOME';
  const subtitle = data?.subtitle || 'Starting at ₹115 / month*';
  const rawDescription = data?.description || 'Unlimited live workouts at home\nInteractive calorie tracking\nExpert guidance via fitX app';
  const image = data?.image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1200';
  const video = data?.video || '';
  const ctaText = data?.ctaText || 'EXPLORE PLANS';

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
                onClick={() => {
                  const pricingSection = document.getElementById('pricing');
                  if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' });
                }}
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
                className="bg-white text-black font-black px-10 py-4 rounded-md tracking-widest text-[10px] uppercase hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,139,16,0.2)]"
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
          {video ? (
            <video
              src={video}
              className="absolute inset-0 w-full h-full object-cover object-center"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={image}
              className="absolute inset-0 w-full h-full object-cover object-center"
              alt={title}
            />
          )}
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
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">{content.features_title || 'Your home, your gym'}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Card 1: Library of Videos */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#161616] rounded-[40px] p-6 flex flex-col items-center justify-center text-center border border-white/5 relative overflow-hidden"
          >
            {/* Premium Ambient Grid & Light */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF7200]/10 blur-[70px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF8B10]/5 blur-[80px] rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <h3 className="text-[#FF7200] font-black text-lg uppercase tracking-tight mb-2">Library of</h3>
              <div className="text-7xl font-black text-[#FF7200] mb-2 tracking-tighter drop-shadow-[0_0_30px_rgba(255,114,0,0.3)]">1000+</div>
              <p className="text-white font-bold text-sm tracking-widest uppercase opacity-80">WORKOUT VIDEOS</p>
            </div>
          </motion.div>

          {/* Card 2: Smart AI Tracking (Tall) */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:row-span-2 bg-[#161616] rounded-[40px] p-6 flex flex-col items-center text-center border border-white/5 relative overflow-hidden"
          >
            <h3 className="text-[#FF7200] font-black text-2xl uppercase tracking-tight mb-12 relative z-10">Smart AI Tracking</h3>

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
                { name: 'HEART', top: 'calc(50% - 120px)', left: '50%', icon: <Activity className="w-9 h-9 text-[#FF7200]" /> },
                { name: 'CALORIES', top: 'calc(50% + 60px)', left: 'calc(50% + 104px)', icon: <Zap className="w-9 h-9 text-[#FF7200]" /> },
                { name: 'POISE', top: 'calc(50% + 60px)', left: 'calc(50% - 104px)', icon: <Target className="w-9 h-9 text-[#FF7200]" /> },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -8, 0],
                    x: [0, i % 2 === 0 ? 4 : -4, 0],
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

          {/* Card 3: Live Sessions */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#161616] rounded-[40px] overflow-hidden border border-white/5 relative group"
          >
            <img src="/live_trainer.jpg" className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700" alt="Live Sessions" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-700" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-0" />

            <div className="absolute bottom-10 left-10 text-left z-10">
              <div className="w-12 h-12 bg-[#FF7200]/10 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,114,0,0.2)] border border-[#FF7200]/20 group-hover:scale-110 transition-transform duration-300">
                <Video className="w-6 h-6 text-[#FF7200]" fill="currentColor" />
              </div>
              <h3 className="text-[#FF7200] font-black text-4xl uppercase tracking-tighter mb-0 leading-none drop-shadow-md">LIVE</h3>
              <p className="text-white font-bold text-xs tracking-widest uppercase opacity-80 mt-1 drop-shadow-md">SESSIONS DAILY</p>
            </div>
          </motion.div>

          {/* Card 4: Train with Experts */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#161616] rounded-[40px] overflow-hidden border border-white/5 relative group"
          >
            <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700" alt="Yoga" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-700" />
            <div className="absolute bottom-10 left-10 text-left z-10">
              <h3 className="text-[#FF7200] font-black text-3xl uppercase tracking-tighter leading-none drop-shadow-lg">Train with<br />Experts</h3>
            </div>
          </motion.div>

          {/* Card 5: Global Leaderboards */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#161616] rounded-[40px] p-8 flex flex-col items-center justify-center text-center border border-white/5 relative overflow-hidden group"
          >
            {/* Dynamic Chart Background Blended Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-all duration-700 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:20px_20px] z-10" />
              <img
                src="/leaderboards_chart.png"
                className="w-full h-full object-cover transform scale-125 group-hover:scale-110 transition-transform duration-[1.5s] filter invert hue-rotate-180 contrast-[1.1] brightness-[0.85] mix-blend-screen"
                alt="Leaderboards Graph"
              />
              {/* Peripheral Framing Glow */}
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#FF7200]/10 blur-[80px] rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-[#161616] z-10" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-[#FF7200]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,114,0,0.2)] border border-[#FF7200]/20 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-10 h-10 text-[#FF7200]" />
              </div>
              <h3 className="text-white font-black text-xs uppercase tracking-widest mb-1 opacity-60">GLOBAL</h3>
              <p className="text-[#FF7200] font-black text-3xl uppercase tracking-tighter drop-shadow-md">Leaderboards</p>
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
    { name: 'ELARA', role: 'YOGA', img: '/c5.png' },
    { name: 'VIKRAM', role: 'FUNCTIONAL', img: '/t3.png' },
    { name: 'MANAV', role: 'ATHLETIC', img: '/c3.png' },
    { name: 'ROHIT', role: 'FITNESS', img: '/t4.png' },
  ];

  return (
    <section id="trainers" className="py-12 overflow-hidden relative border-t border-white/5 scroll-mt-32">
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

const MembershipComparison = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  const { isLoggedIn, setIsLoginModalOpen } = useUI();
  const [selectedPlan, setSelectedPlan] = useState('24 MONTHS');

  const handleBuy = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      alert('Proceeding to checkout...');
    }
  };

  const plans = [
    {
      duration: '24 MONTHS',
      price: '₹2400',
      originalPrice: '₹5990',
      monthly: '100',
      features: [
        'Extra ₹3,500 OFF applied',
        'Unlimited live sessions',
        'Massive video library',
        'Calorie tracking integration',
        'Expert trainer support',
        'Interactive community access',
        '6 months extension',
      ]
    },
    {
      duration: '12 MONTHS',
      price: '₹1380',
      originalPrice: '₹2990',
      monthly: '115',
      features: [
        'Extra ₹1,400 OFF applied',
        'Unlimited live sessions',
        'Massive video library',
        'Calorie tracking integration',
        'Expert trainer support',
        'Interactive community access',
        '3 months extension',
      ]
    },
    {
      duration: '6 MONTHS',
      price: '₹1150',
      originalPrice: '₹1995',
      monthly: '192',
      features: [
        'Extra ₹800 OFF applied',
        'Unlimited live sessions',
        'Massive video library',
        'Calorie tracking integration',
        'Expert trainer support',
        'Interactive community access',
        '1 month extension',
      ]
    },
    {
      duration: '3 MONTHS',
      price: '₹891',
      originalPrice: '₹1291',
      monthly: '297',
      features: [
        'Extra ₹400 OFF applied',
        'Unlimited live sessions',
        'Massive video library',
        'Calorie tracking integration',
        'Expert trainer support',
        'Interactive community access',
        'fitX activewear voucher',
      ]
    },
    {
      duration: '1 MONTH',
      price: '₹499',
      originalPrice: '₹990',
      monthly: '499',
      features: [
        'Extra ₹100 OFF applied',
        'Unlimited live sessions',
        'Massive video library',
        'Calorie tracking integration',
        'Expert trainer support',
        'Interactive community access',
        '7-day free guest pass',
      ]
    }
  ];

  const currentPlan = plans.find(p => p.duration === selectedPlan) || plans[0];

  const benefits = [
    { icon: <Play className="w-5 h-5 fill-current" />, title: 'Buy Now', sub: 'start anytime' },
    { icon: <Zap className="w-5 h-5 fill-current" />, title: 'Pause', sub: 'pack anytime' },
    { icon: <ShieldCheck className="w-5 h-5" />, title: 'Safest', sub: 'home workouts' },
    { icon: <span className="text-[10px] font-black">EMI</span>, title: 'No-Cost', sub: 'EMI available' },
  ];

  return (
    <section id="pricing" className="py-12 border-t border-white/5 scroll-mt-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 italic">{content.pricing_title || 'fitX HOME'}</h2>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">{content.pricing_subtitle || 'Unlimited workouts at home'}</p>
        </div>

        {/* Duration Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {plans.map((p) => (
            <button
              key={p.duration}
              onClick={() => setSelectedPlan(p.duration)}
              className={`px-8 py-4 rounded-2xl border transition-all flex flex-col items-center min-w-[160px] ${selectedPlan === p.duration
                ? 'bg-[#FF7200]/10 border-[#FF7200] shadow-[0_0_20px_rgba(255,114,0,0.1)]'
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

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Plan Card */}
            <motion.div
              key={selectedPlan}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#1c1c1c] border border-white/5 rounded-[48px] p-8 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-12">
                <div>
                  <span className="text-sm text-white/20 font-black line-through block mb-2 italic">{currentPlan.originalPrice}</span>
                  <h3 className="text-6xl font-black text-white tracking-tighter italic">
                    {currentPlan.price}
                  </h3>
                  <p className="text-[#FF7200] font-black text-[10px] uppercase tracking-[0.2em] mt-2">{currentPlan.monthly} / month*</p>
                </div>
                <div className="bg-[#FF7200] text-black font-black px-4 py-2 rounded-lg text-[10px] uppercase">
                  BEST VALUE
                </div>
              </div>

              <div className="space-y-4 mb-12">
                {currentPlan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF7200]" />
                    <span className="text-white/60 font-black text-[10px] uppercase tracking-wider">{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleBuy}
                className="w-full bg-white text-black font-black py-5 rounded-2xl text-xs tracking-widest uppercase hover:bg-[#FF7200] transition-all"
              >
                BUY NOW
              </button>
            </motion.div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-8">
              {benefits.map((b, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[32px] flex flex-col items-center text-center group hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#FF7200] mb-4 group-hover:scale-110 transition-transform">
                    {b.icon}
                  </div>
                  <h5 className="text-white font-black text-xs uppercase tracking-tight mb-1">{b.title}</h5>
                  <p className="text-white/40 text-[8px] font-bold uppercase tracking-widest">{b.sub}</p>
                </div>
              ))}
              <div className="col-span-2 mt-4 p-8 bg-[#FF7200]/5 border border-[#FF7200]/10 rounded-[32px]">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  Join 1M+ users training at home with FitX. Unlimited access to live sessions and premium video library.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "What is fitX HOME?", a: "fitX HOME is a digital fitness membership that brings elite trainer-led workouts to your living room through live sessions and a massive video library." },
    { q: "Do I need equipment?", a: "Most of our classes are bodyweight-focused (like Yoga and HIIT), but we also have sessions for those with basic home equipment." },
    { q: "How many live classes are there?", a: "We run live sessions every hour from 6 AM to 10 PM daily." },
  ];

  return (
    <section id="faq" className="py-16 border-t border-white/5 scroll-mt-32">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-20 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">FAQS</h2>
            <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">FITX HOME</p>
          </div>
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
                <ChevronDown className={`w-5 h-5 text-white/20 transition-transform duration-500 ${openIndex === i ? 'rotate-180 text-[#FF7200]' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="pb-10 pl-5 text-white/50 text-sm font-bold leading-relaxed uppercase tracking-tight">
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

export default function FitXHome() {
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);

  useEffect(() => {
    api.getPageHeroes()
      .then(heroes => {
        const homeHero = heroes.find(h => h.pageKey === 'home');
        if (homeHero) setHeroData(homeHero);
      })
      .catch(err => console.error("Error loading home hero", err));
  }, []);

  return (
    <div className="relative w-full min-h-screen pt-16 selection:bg-[#FF7200]/30 premium-bg">
      <CanvasScrollBg />
      <FitnessSubNav />

      <div className="flex flex-col">
        <ScrollReveal type="fade"><Hero data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><TimerOffer /></ScrollReveal>
        <ScrollReveal type="slide-up"><FeaturesGrid data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><TrainerLedClasses data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><AtHomeWorkouts data={heroData} /></ScrollReveal>
        <ScrollReveal type="fade"><TrainersSection data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><MembershipComparison data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><FAQSection /></ScrollReveal>
      </div>
    </div>
  );
}
