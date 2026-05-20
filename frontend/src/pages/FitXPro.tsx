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
  BadgeCent, Flower2, Dumbbell, Flame, Music, Timer
} from 'lucide-react';
import FitnessSubNav from '../components/FitnessSubNav';
import ScrollReveal from '../components/ScrollReveal';
import { useUI } from '../context/UIContext';
import { TimerOffer } from '../components/TimerOffer';
import { Link } from 'react-router-dom';
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
        ctx.fillStyle = 'rgba(255, 90, 61, 0.3)';
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

  const title = data?.title || 'fitXpass PRO';
  const subtitle = data?.subtitle || 'Starting at ₹833 / month*';
  const rawDescription = data?.description || 'Unlimited access to PRO gyms\nSmart workout plans\nUnlimited at-home workouts';
  const image = data?.image || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200';
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
                    {title.substring(0, title.lastIndexOf(' '))} <span className="text-[#ff5a3d]">{title.substring(title.lastIndexOf(' ') + 1)}</span>
                  </>
                ) : (
                  <span className="text-[#ff5a3d]">{title}</span>
                )}
              </h1>
            </div>

            <ul className="space-y-6 mb-12">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-4 text-white/90 text-2xl font-bold">
                  <ChevronRight className="w-5 h-5 text-[#ff5a3d]" />
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
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">{content.features_title || 'Pro level results'}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#1c1c1c] rounded-[40px] p-6 flex flex-col items-center justify-center text-center border border-white/5"
          >
            <h3 className="text-[#ff5a3d] font-black text-lg uppercase tracking-tight mb-2">Access to</h3>
            <div className="text-7xl font-black text-[#ff5a3d] mb-2 tracking-tighter">500+</div>
            <p className="text-white font-bold text-sm tracking-widest uppercase">PRO GYMS</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="md:row-span-2 bg-[#1c1c1c] rounded-[40px] p-6 flex flex-col items-center text-center border border-white/5 relative overflow-hidden"
          >
            <h3 className="text-[#ff5a3d] font-black text-2xl uppercase tracking-tight mb-12 relative z-10">Advanced Equipment</h3>
            <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Equipment" />
            <div className="relative z-10 mt-auto text-white/60 font-bold text-sm uppercase leading-relaxed">
              Experience elite-grade machinery and free weights designed for serious progress.
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#1c1c1c] rounded-[40px] p-6 flex flex-col items-center justify-center text-center border border-white/5"
          >
            <div className="w-16 h-16 bg-[#ff5a3d]/10 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-[#ff5a3d]" fill="currentColor" />
            </div>
            <h3 className="text-[#ff5a3d] font-black text-4xl uppercase tracking-tighter mb-1">PRO</h3>
            <p className="text-white font-bold text-xs tracking-widest uppercase">TRAINING</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#1c1c1c] rounded-[40px] overflow-hidden border border-white/5 relative group"
          >
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700" alt="Gym" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-700" />
            <div className="absolute bottom-10 left-10 text-left">
              <h3 className="text-[#ff5a3d] font-black text-3xl uppercase tracking-tighter leading-none">Open Gym<br />Access</h3>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#1c1c1c] rounded-[40px] p-8 flex flex-col items-center justify-center text-center border border-white/5 relative overflow-hidden"
          >
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#ff5a3d]/20 relative z-10">
                <img src="/pro_trainer.jpg" className="w-full h-full object-cover" alt="Trainer" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 border border-[#ff5a3d]/10 rounded-full animate-ping opacity-30" />
            </div>
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-1">PERSONALIZED</h3>
            <p className="text-[#ff5a3d] font-black text-3xl uppercase tracking-tighter">Support</p>
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
    { name: 'MAXWELL', role: 'PHYSIQUE', img: '/c1.png' },
    { name: 'MANAV', role: 'ATHLETIC', img: '/c3.png' },
    { name: 'DAWSON', role: 'STRENGTH', img: '/c2.png' },
    { name: 'MAYA', role: 'FUNCTIONAL', img: '/c4.png' },
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

const MembershipComparison = () => {
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
      price: '₹833/MO*',
      proPrice: '750', plusPrice: '833',
      proTotal: '18000', plusTotal: '19992',
      pause: { proPlus: '120', pro: '60' },
      sessions: { proPlus: '60', pro: '30' }
    },
    {
      duration: '12 MONTHS',
      price: '₹958/MO*',
      proPrice: '833', plusPrice: '958',
      proTotal: '9996', plusTotal: '11496',
      pause: { proPlus: '60', pro: '30' },
      sessions: { proPlus: '30', pro: '15' }
    },
    {
      duration: '6 MONTHS',
      price: '₹1475/MO*',
      proPrice: '1475', plusPrice: '1625',
      proTotal: '8850', plusTotal: '9750',
      pause: { proPlus: '30', pro: '15' },
      sessions: { proPlus: '15', pro: '7' }
    },
    {
      duration: '3 MONTHS',
      price: '₹2117/MO*',
      proPrice: '2117', plusPrice: '2328',
      proTotal: '6351', plusTotal: '6984',
      pause: { proPlus: '15', pro: '7' },
      sessions: { proPlus: '7', pro: '3' }
    },
    {
      duration: '1 MONTH',
      price: '₹3250/MO*',
      proPrice: '3000', plusPrice: '3250',
      proTotal: '3000', plusTotal: '3250',
      pause: { proPlus: '5', pro: '2' },
      sessions: { proPlus: '2', pro: '1' }
    },
  ];

  const currentPlanData = plans.find(p => p.duration === selectedPlan) || plans[0];

  const features = [
    { label: 'Membership Pause Days', pro: currentPlanData.pause.pro, proPlus: currentPlanData.pause.proPlus },
    { label: 'Other City Sessions', pro: currentPlanData.sessions.pro, proPlus: currentPlanData.sessions.proPlus },
    { label: 'At-home Workouts', pro: '✔', proPlus: '✔' },
    { label: 'Smart Workout Plans', pro: '✔', proPlus: '✔' },
    { label: 'Total Payable', pro: `₹${currentPlanData.proTotal}`, proPlus: `₹${currentPlanData.plusTotal}` },
  ];

  return (
    <section id="comparison" className="py-12 border-t border-white/5 scroll-mt-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">fitX PRO</h2>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Flexible plans to fuel your fitness journey</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {plans.map((p) => (
            <button
              key={p.duration}
              onClick={() => setSelectedPlan(p.duration)}
              className={`px-8 py-4 rounded-2xl border transition-all flex flex-col items-center min-w-[160px] ${selectedPlan === p.duration
                ? 'bg-[#ff5a3d]/10 border-[#ff5a3d] shadow-[0_0_20px_rgba(255,90,61,0.1)]'
                : 'bg-[#1c1c1c] border-white/5 hover:border-white/20'
                }`}
            >
              <span className={`text-[10px] font-black tracking-[0.2em] uppercase mb-1 ${selectedPlan === p.duration ? 'text-[#ff5a3d]' : 'text-white/40'}`}>
                {p.duration}
              </span>
              <span className={`text-sm font-black ${selectedPlan === p.duration ? 'text-white' : 'text-white/60'}`}>
                {p.price}
              </span>
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 mb-8">
            <div />
            <div className="text-center">
              <h3 className="text-[#ff5a3d] font-black text-2xl md:text-4xl tracking-tighter uppercase leading-tight italic mb-2">PRO PLUS</h3>
              <p className="text-white/40 text-[10px] font-black uppercase">₹{currentPlanData.plusPrice}/MO*</p>
            </div>
            <div className="text-center">
              <h3 className="text-white/60 font-black text-2xl md:text-4xl tracking-tighter uppercase leading-tight italic mb-2">PRO</h3>
              <p className="text-white/40 text-[10px] font-black uppercase">₹{currentPlanData.proPrice}/MO*</p>
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
                <div className={`text-center font-black ${f.label === 'Total Payable' ? 'text-[#ff5a3d] text-2xl' : 'text-white text-sm'}`}>
                  {f.proPlus}
                </div>
                <div className={`text-center font-black ${f.label === 'Total Payable' ? 'text-white text-2xl' : 'text-white/60 text-sm'}`}>
                  {f.pro}
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
  const { isLoggedIn, setIsLoginModalOpen } = useUI();
  const [activePlan, setActivePlan] = useState<'pro-plus' | 'pro'>('pro-plus');

  const benefits = [
    { icon: <CirclePlay className="w-5 h-5" />, title: 'Buy Now', sub: 'start anytime' },
    { icon: <Activity className="w-5 h-5" />, title: 'Pause', sub: 'pack anytime' },
    { icon: <Shield className="w-5 h-5" />, title: 'Safest', sub: 'gyms in town' },
    { icon: <BadgeCent className="w-5 h-5" />, title: 'No-Cost', sub: 'EMI available' },
  ];

  const pricingCards = activePlan === 'pro-plus' ? [
    {
      months: '12',
      originalPrice: '14990',
      price: '11490',
      monthly: '958',
      features: [
        'Extra ₹1,500 OFF applied',
        'Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)',
        '45 days of membership pause',
        'Access 30 sessions in other cities',
        'Unlimited at-home workouts',
        'Smart workout plans',
        '2 more Offers',
      ]
    },
    {
      months: '6',
      originalPrice: '10995',
      price: '8850',
      monthly: '1475',
      features: [
        'Extra ₹1,000 OFF applied',
        'Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)',
        '30 days of membership pause',
        'Access 15 sessions in other cities',
        'Unlimited at-home workouts',
        'Smart workout plans',
        '1 more Offers',
      ]
    },
    {
      months: '3',
      originalPrice: '7891',
      price: '6351',
      monthly: '2117',
      features: [
        'Extra ₹800 OFF applied',
        'Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)',
        '10 days of membership pause',
        'Access 5 sessions in other cities',
        'Unlimited at-home workouts',
        'Smart workout plans',
        '₹300 OFF* on fitX activewear',
      ]
    }
  ] : [
    {
      months: '12',
      originalPrice: '12990',
      price: '9450',
      monthly: '787',
      features: [
        'Extra ₹1,500 OFF applied',
        'Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)',
        '30 days of membership pause',
        'Access 15 sessions in other cities',
        'Unlimited at-home workouts',
        'Smart workout plans',
      ]
    },
    {
      months: '6',
      originalPrice: '8995',
      price: '7250',
      monthly: '1208',
      features: [
        'Extra ₹1,000 OFF applied',
        'Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)',
        '15 days of membership pause',
        'Access 8 sessions in other cities',
        'Unlimited at-home workouts',
        'Smart workout plans',
      ]
    },
    {
      months: '3',
      originalPrice: '6591',
      price: '5250',
      monthly: '1750',
      features: [
        'Extra ₹800 OFF applied',
        'Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)',
        '5 days of membership pause',
        'Access 3 sessions in other cities',
        'Smart workout plans',
      ]
    }
  ];

  return (
    <section id="pricing-cards" className="py-12 overflow-hidden border-t border-white/5 scroll-mt-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
          <button
            onClick={() => setActivePlan('pro-plus')}
            className={`px-12 py-8 rounded-[32px] border transition-all text-center min-w-[320px] relative overflow-hidden group ${activePlan === 'pro-plus'
              ? 'border-[#00E5FF] bg-[#0A0F24] shadow-[0_0_50px_rgba(0,229,255,0.15)] text-white'
              : 'border-[#151E32]/10 bg-[#151E32]/5 text-[#0A0F24] hover:bg-[#151E32]/10 transition-all opacity-80 hover:opacity-100'
              }`}
          >
            <h4 className={`font-black text-3xl uppercase tracking-tighter mb-1 italic ${activePlan === 'pro-plus' ? 'text-[#00E5FF]' : 'text-[#0A0F24]'}`}>PRO PLUS</h4>
            <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${activePlan === 'pro-plus' ? 'text-white/80' : 'text-[#0A0F24]/60'}`}>Access to all PRO gyms in India</p>
          </button>
          <button
            onClick={() => setActivePlan('pro')}
            className={`px-12 py-8 rounded-[32px] border transition-all text-center min-w-[320px] relative overflow-hidden group ${activePlan === 'pro'
              ? 'border-[#00E5FF] bg-[#0A0F24] shadow-[0_0_50px_rgba(0,229,255,0.15)] text-white'
              : 'border-[#151E32]/10 bg-[#151E32]/5 text-[#0A0F24] hover:bg-[#151E32]/10 transition-all opacity-80 hover:opacity-100'
              }`}
          >
            <h4 className={`font-black text-3xl uppercase tracking-tighter mb-1 italic ${activePlan === 'pro' ? 'text-[#00E5FF]' : 'text-[#0A0F24]'}`}>PRO</h4>
            <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${activePlan === 'pro' ? 'text-white/80' : 'text-[#0A0F24]/60'}`}>Access to all PRO gyms in City</p>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20 border-b border-white/5 pb-16">
          {benefits.map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ff5a3d] mb-5 group-hover:scale-110 group-hover:bg-[#ff5a3d]/10 transition-all">
                {b.icon}
              </div>
              <h5 className="text-white font-black text-sm uppercase tracking-tight">{b.title}</h5>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] leading-none mt-2">{b.sub}</p>
            </div>
          ))}
        </div>

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
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff5a3d] mt-1.5 shrink-0" />
                    <p className="text-white/70 text-[11px] font-bold leading-snug uppercase tracking-tight">{f}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setIsLoginModalOpen(true);
                  }
                }}
                className="w-full bg-white text-black font-black py-5 rounded-2xl text-[10px] tracking-[0.3em] uppercase hover:bg-[#ff5a3d] transition-all relative z-10"
              >
                BUY NOW
              </button>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#ff5a3d]/5 rounded-full blur-[80px] group-hover:bg-[#ff5a3d]/10 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "What is fitX PRO?", a: "fitX PRO is our high-value membership that gives you unlimited access to PRO gyms in your city and at-home workouts." },
    { q: "How many gyms can I access?", a: "You get access to over 500+ high-quality PRO gyms across our network." },
    { q: "Are there trainers at PRO gyms?", a: "Yes, all PRO gyms have certified floor trainers to assist you with your workouts." },
    { q: "Can I use elite group classes?", a: "No, ELITE group classes are exclusive to ELITE memberships. PRO focuses on gym-based workouts." },
  ];

  return (
    <section id="faq" className="py-16 border-t border-white/5 scroll-mt-32">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-20 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">FAQS</h2>
            <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">FITXPASS PRO</p>
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
                  <div className="w-1 h-1 rounded-full bg-[#ff5a3d]" />
                  <span className="text-white font-bold text-sm md:text-base group-hover:text-[#ff5a3d] transition-all">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-white/20 transition-transform duration-500 ${openIndex === i ? 'rotate-180 text-[#ff5a3d]' : ''}`} />
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

export default function FitXPro() {
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);

  useEffect(() => {
    api.getPageHeroes()
      .then(heroes => {
        const proHero = heroes.find(h => h.pageKey === 'pro');
        if (proHero) setHeroData(proHero);
      })
      .catch(err => console.error("Error loading pro hero", err));
  }, []);

  return (
    <div className="relative w-full min-h-screen pt-16 selection:bg-[#ff5a3d]/30 premium-bg">
      <CanvasScrollBg />
      <FitnessSubNav />

      <div className="flex flex-col">
        <ScrollReveal type="fade"><Hero data={heroData} /></ScrollReveal>
        <TimerOffer />
        <ScrollReveal type="slide-up"><FeaturesGrid data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><TrainerLedClasses data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><AtHomeWorkouts data={heroData} /></ScrollReveal>
        <ScrollReveal type="fade"><TrainersSection data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><MembershipComparison /></ScrollReveal>
        <ScrollReveal type="scale"><MembershipPricingCards /></ScrollReveal>
        <ScrollReveal type="slide-up"><FAQSection /></ScrollReveal>
      </div>
    </div>
  );
}

