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
  Apple,
  Clock,
  Users,
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
        ctx.fillStyle = 'rgba(255, 139, 16, 0.3)';
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
  const { isLoggedIn, setIsLoginModalOpen, userProfileData } = useUI();
  const [submitting, setSubmitting] = useState(false);

  const title = data?.title || 'fitX TRANSFORM';
  const subtitle = data?.subtitle || 'Plans starting at ₹2,499 / month*';
  const rawDescription = data?.description || 'Personalized coaching & guidance\nCustomized diet & nutrition plans\nGuaranteed weight loss results';
  const image = data?.image || '';
  const ctaText = data?.ctaText || 'EXPLORE PLANS';

  const bullets = rawDescription.split('\n').filter(Boolean);

  const handleJoinNow = async () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setSubmitting(true);
    try {
      await api.createContact({
        name: userProfileData?.name || 'Logged-in User',
        email: userProfileData?.email || 'user@fitx.com',
        phone: userProfileData?.phone || '',
        type: 'PROGRAM APPLICATION',
        plan: 'TRANSFORM PLUS',
        message: 'User clicked JOIN NOW for Transform Pro+.'
      });
      alert('🎯 APPLICATION SENT! Your transformation request is in the trainer console.');
    } catch (err) {
      console.error(err);
      alert('Submission error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="hero" className="relative w-full overflow-hidden scroll-mt-32">
      <div className="absolute inset-0 z-0">
        {image ? (
          <img
            src={image}
            className="w-full h-full object-cover opacity-50"
            alt={title}
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-50"
          >
            <source src="/transform.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row min-h-[85vh] relative z-10">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-20 py-10 lg:py-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-baseline gap-3 mb-12">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
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
                  const pricingSection = document.getElementById('comparison');
                  if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#2d3340] text-white font-black px-10 py-4 rounded-md tracking-widest text-[10px] uppercase hover:bg-white hover:!text-[#0A0F24] transition-all duration-300"
              >
                {ctaText}
              </button>
              <button
                onClick={handleJoinNow}
                disabled={submitting}
                className="bg-white text-black font-black px-10 py-4 rounded-md tracking-widest text-[10px] uppercase hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,139,16,0.2)] disabled:opacity-50"
              >
                {submitting ? 'REGISTERING...' : 'JOIN NOW'}
              </button>
            </div>

            <p className="text-white/30 text-[10px] font-bold uppercase tracking-tight italic">
              *Effective Monthly Pricing including Extension, if any
            </p>
          </motion.div>
        </div>

        <div className="flex-1 relative min-h-[60vh] lg:min-h-0 lg:block hidden" />
      </div>
    </section>
  );
};

const StatsShowcase = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  const stats = [
    {
      value: "~6KG",
      desc: "average weight lost in 3 months",
      img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600"
    },
    {
      value: ">3",
      desc: "avg. inches lost around waistline",
      img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600"
    },
    {
      value: "90%+",
      desc: "have seen rise in energy & stamina",
      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600"
    },
    {
      value: "92%+",
      desc: "have improved their sleep cycles",
      img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=600"
    },
  ];

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-white font-black text-3xl md:text-5xl uppercase tracking-tighter mb-16">
          {content.stats_title || 'Lose weight for good with'}
        </h2>

        <div className="relative mb-12 group">
          <div className="aspect-[21/9] w-full max-w-5xl mx-auto rounded-[40px] overflow-hidden border border-white/10 relative">
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1200"
              className="w-full h-full object-cover"
              alt="Transform Core"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
              {/* Overlaying wave elements similar to screenshot */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" viewBox="0 0 1000 400">
                <path d="M0,200 C200,100 400,300 600,150 C800,50 1000,200 L1000,400 L0,400 Z" fill="url(#grad1)" />
                <path d="M0,250 C300,150 500,350 700,200 C900,100 1000,250 L1000,400 L0,400 Z" fill="url(#grad2)" />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#FF7200', stopOpacity: 0.2 }} />
                    <stop offset="100%" style={{ stopColor: '#fbbf24', stopOpacity: 0.2 }} />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#FF7200', stopOpacity: 0.1 }} />
                    <stop offset="100%" style={{ stopColor: '#34d399', stopOpacity: 0.1 }} />
                  </linearGradient>
                </defs>
              </svg>

              <h3 className="text-white font-black text-7xl md:text-9xl uppercase tracking-tighter leading-none italic opacity-80 mb-[-10px]">fitX</h3>
              <h3 className="text-[#FF7200] font-black text-5xl md:text-7xl uppercase tracking-tighter drop-shadow-2xl">TRANSFORM</h3>
              <p className="text-white/80 font-bold uppercase tracking-widest mt-6 text-sm md:text-lg">India's no. 1 online sustainable weight loss program</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-[4/5] rounded-[32px] overflow-hidden group border border-white/5 bg-[#1c1c1c]"
            >
              <img
                src={stat.img}
                className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                alt={stat.value}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-center">
                <h4 className="force-text-white font-black text-4xl md:text-5xl tracking-tighter mb-1">{stat.value}</h4>
                <p className="force-text-white-muted font-bold text-[10px] uppercase tracking-widest leading-tight group-hover:force-text-white transition-colors">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-12 text-white/10 text-[8px] uppercase tracking-widest italic font-bold">Data as per internal audit 2023</p>
      </div>
    </section>
  );
};

const AccessGrid = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  return (
    <section id="access" className="py-12 relative overflow-hidden scroll-mt-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-white/60 font-bold uppercase tracking-widest text-sm mb-4">{content.access_subtitle || 'With fitX Transform, you can'}</p>
          <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic">
            {content.access_title || 'Get access to'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            {/* Custom Workout Plans */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative aspect-[4/3] rounded-[40px] overflow-hidden border border-white/10 group"
            >
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Workouts" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-[#00E5FF] font-black text-3xl md:text-4xl uppercase tracking-tighter leading-none mb-4 italic">
                  Custom<br />Workout Plans
                </h3>
                <p className="force-text-white-muted text-[10px] font-bold uppercase leading-relaxed max-w-xs">
                  Your coach creates a routine that fits your travel plans, schedule and goals so you never have to guess what to do next.
                </p>
              </div>
            </motion.div>

            {/* Daily Habits + Progress */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative aspect-square rounded-[40px] overflow-hidden border border-white/10 group"
            >
              <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Habits" />
              <div className="absolute inset-0 bg-black/40" />

              {/* Checklist Mockup UI */}
              <div className="absolute top-6 left-10 w-32 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="force-text-white-muted opacity-60 text-[8px] font-bold uppercase mb-2">After every meeting</div>
                <div className="force-text-white font-bold text-xs mb-3">I will do 5 squats</div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-md border border-white/20 flex items-center justify-center text-white/40"><X className="w-3 h-3" /></div>
                  <div className="w-6 h-6 rounded-md bg-[#FF7200] flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                <h3 className="text-[#00E5FF] font-black text-3xl md:text-4xl uppercase tracking-tighter leading-none mb-4 italic">
                  Daily<br />Habits + Progress
                </h3>
                <p className="force-text-white-muted text-[10px] font-bold uppercase leading-relaxed max-w-xs">
                  Build healthier habits and get lasting results so you don't have to try another weight loss program ever again.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Center Column - Transform Coach */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative rounded-[40px] overflow-hidden border border-white/10 group h-full"
          >
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Coach" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
              <h3 className="text-[#00E5FF] font-black text-4xl md:text-5xl uppercase tracking-tighter leading-none mb-6 italic">
                Transform Coach
              </h3>
              <p className="force-text-white-muted text-[10px] font-bold uppercase leading-relaxed max-w-xs mb-4">
                Your coach checks in daily to keep you accountable, track your progress, celebrate your wins and help you push through when you need it.
              </p>
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            {/* Tailored Meal Plans */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative aspect-square rounded-[40px] overflow-hidden border border-white/10 group"
            >
              <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Meal Plans" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                <h3 className="text-[#00E5FF] font-black text-3xl md:text-4xl uppercase tracking-tighter leading-none mb-4 italic">
                  Tailored Meal Plans
                </h3>
                <p className="force-text-white-muted text-[10px] font-bold uppercase leading-relaxed max-w-xs">
                  Scientific approach to nutrition with thousands of meal options to satisfy your taste buds without compromising on your fitness goals.
                </p>
              </div>
            </motion.div>

            {/* So Much More */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative aspect-[4/3] rounded-[40px] border border-white/10 flex flex-col items-center justify-center text-center p-8 bg-[#1c1c1c]/50 backdrop-blur-xl"
            >
              <span className="force-text-white-muted text-xs font-bold uppercase tracking-widest mb-2">and</span>
              <h3 className="force-text-white font-black text-3xl uppercase tracking-tighter italic">so much more!</h3>
            </motion.div>
          </div>
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
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
      icon: <Flower2 className="w-8 h-8 text-[#FF7200]" />,
      explore: true
    },
    {
      name: 'fitX strength +',
      tags: 'PLYO-AGILITY • ENDURANCE',
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
      icon: <Dumbbell className="w-8 h-8 text-[#FF7200]" />,
      explore: true
    },
    {
      name: 'HRX WORKOUT',
      tags: 'MUSCLE GAIN • STRENGTH',
      img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
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
                className="min-w-[300px] md:min-w-[400px] aspect-[4/5] relative rounded-[40px] overflow-hidden snap-center border border-white/10 group/card"
              >
                <img src={c.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" alt={c.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-center flex flex-col items-center">
                  <span className="text-4xl mb-4 bg-white/10 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20">{c.icon}</span>
                  <h3 className="force-text-white font-black text-4xl uppercase tracking-tighter mb-2 leading-none">{c.name}</h3>
                  <p className="force-text-white-muted font-bold text-[10px] tracking-[0.2em] uppercase mb-8">{c.tags}</p>
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
                  <p className="force-text-white-muted opacity-80 font-medium text-xs mb-2">{w.trainer}</p>
                  <h3 className="force-text-white font-bold text-xl mb-2 tracking-tight">{w.title}</h3>
                  <p className="force-text-white-muted opacity-90 font-bold text-[10px] tracking-wider uppercase mb-6">{w.type}</p>

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
    <section id="trainers" className="py-12 overflow-hidden relative border-t border-white/5 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <h2 className="text-[10vw] font-black text-[#0A0F24]/[0.05] tracking-tighter uppercase leading-none translate-y-[-10%]">
            COACHES
          </h2>
        </div>

        <div className="text-center mb-24 relative z-10">
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">{content.trainers_title || 'Your Transformation Team'}</h3>
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
  const { isLoggedIn, setIsLoginModalOpen, userProfileData } = useUI();
  const [selectedPlan, setSelectedPlan] = useState('24 MONTHS');
  const [submitting, setSubmitting] = useState(false);

  const handleBuy = async (planTier: string) => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setSubmitting(true);
    try {
      await api.createContact({
        name: userProfileData?.name || 'Logged-in User',
        email: userProfileData?.email || 'user@fitx.com',
        phone: userProfileData?.phone || '',
        type: 'PROGRAM APPLICATION',
        plan: `TRANSFORM ${planTier} (${selectedPlan})`,
        message: `User clicked BUY on ${planTier} package for ${selectedPlan} duration.`
      });
      alert('🎯 ENROLLMENT SUCCESSFUL! Advisor request registered.');
    } catch (err) {
      console.error(err);
      alert('Purchase logging failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const plans = [
    {
      duration: '24 MONTHS',
      price: '₹2499/MO*',
      proPrice: '1999', proPlusPrice: '2499',
      proTotal: '47990', proPlusTotal: '59990',
      diet: { plus: '4 / Month', pro: '2 / Month' },
      pause: { plus: '120', pro: '60' }
    },
    {
      duration: '12 MONTHS',
      price: '₹2999/MO*',
      proPrice: '2499', proPlusPrice: '2999',
      proTotal: '29990', proPlusTotal: '35990',
      diet: { plus: '2 / Month', pro: '1 / Month' },
      pause: { plus: '60', pro: '30' }
    },
    {
      duration: '6 MONTHS',
      price: '₹3999/MO*',
      proPrice: '3332', proPlusPrice: '3999',
      proTotal: '19990', proPlusTotal: '23990',
      diet: { plus: '1 / Month', pro: '1 / Month' },
      pause: { plus: '30', pro: '15' }
    },
    {
      duration: '3 MONTHS',
      price: '₹4499/MO*',
      proPrice: '3997', proPlusPrice: '4499',
      proTotal: '11990', proPlusTotal: '13490',
      diet: { plus: '1 / Month', pro: '1 / Month' },
      pause: { plus: '15', pro: '7' }
    },
    {
      duration: '1 MONTH',
      price: '₹7999/MO*',
      proPrice: '6500', proPlusPrice: '7999',
      proTotal: '6500', proPlusTotal: '7999',
      diet: { plus: '1 / Month', pro: '1 / Month' },
      pause: { plus: '5', pro: '2' }
    },
  ];

  const currentPlanData = plans.find(p => p.duration === selectedPlan) || plans[0];

  const features = [
    { label: 'Personal Coach', pro: '✔', proPlus: '✔' },
    { label: 'Diet Consultation', pro: currentPlanData.diet.pro, proPlus: currentPlanData.diet.plus },
    { label: 'Workout Guidance', pro: '✔', proPlus: '✔' },
    { label: 'Pause Days', pro: currentPlanData.pause.pro, proPlus: currentPlanData.pause.plus },
    { label: 'Total Payable', pro: `₹${currentPlanData.proTotal}`, proPlus: `₹${currentPlanData.proPlusTotal}` },
  ];

  return (
    <section id="comparison" className="py-12 border-t border-white/5 scroll-mt-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">{content.pricing_title || 'Choose your Transform Plan'}</h2>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">{content.pricing_subtitle || 'Custom solutions for your goals'}</p>
        </div>

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

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 mb-8">
            <div />
            <div className="text-center">
              <h3 className="text-[#FF7200] font-black text-2xl md:text-4xl tracking-tighter uppercase leading-tight italic mb-2">TRANSFORM<br />PLUS</h3>
              <p className="text-white/40 text-[10px] font-black uppercase">₹2999/MO*</p>
            </div>
            <div className="text-center">
              <h3 className="text-white/60 font-black text-2xl md:text-4xl tracking-tighter uppercase leading-tight italic mb-2">TRANSFORM</h3>
              <p className="text-white/40 text-[10px] font-black uppercase">₹2499/MO*</p>
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
                <div className={`text-center font-black ${f.label === 'Total Payable' ? 'text-[#FF7200] text-2xl' : 'text-white text-sm'}`}>
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
                onClick={() => handleBuy('PLUS')}
                disabled={submitting}
                className="w-full bg-white text-black font-black py-4 rounded-xl text-[10px] tracking-widest uppercase hover:scale-105 transition-all disabled:opacity-50"
              >
                {submitting ? '...' : 'BUY'}
              </button>
            </div>
            <div className="flex justify-center px-4">
              <button
                onClick={() => handleBuy('PRO')}
                disabled={submitting}
                className="w-full bg-white text-black font-black py-4 rounded-xl text-[10px] tracking-widest uppercase hover:scale-105 transition-all disabled:opacity-50"
              >
                {submitting ? '...' : 'BUY'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const [dbTransformations, setDbTransformations] = useState<any[]>([]);
  
  useEffect(() => {
    const loadDB = async () => {
      try {
        const list = await api.getTransformations();
        if (list && list.length > 0) {
          setDbTransformations(list);
        }
      } catch (err) {
        console.error("Transformation fetch failure:", err);
      }
    };
    loadDB();
  }, []);

  const testimonials = [
    {
      user: "Ayush Mishra",
      date: "June 14 at 10:28 PM",
      text: "I wasn't expecting it when I checked my weight earlier this morning. That too when I haven't started working out yet. Thanks to my coach Sejal Kachi, she explained #fitxplate method very well.",
      avatar: "https://i.pravatar.cc/150?u=ayush",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600",
      type: "chart"
    },
    {
      user: "Naresh",
      date: "June 19 at 11:21 PM",
      text: "I saw this program in the fitX app and was curious to try this. I was then connected to my habit coach Roshni. She quickly understood my current eating habits, lifestyle and other important things. She started recommending small changes in my daily routine which started showing fantastic results.",
      avatar: "https://i.pravatar.cc/150?u=naresh",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600",
      type: "transformation"
    },
    {
      user: "Basumitra Chakraborty",
      date: "June 23 at 9:46 PM",
      text: "Coach Advait Pai pushed me to add more variety to my meals. It required some thinking, planning and mindfulness. #fitxplate",
      avatar: "https://i.pravatar.cc/150?u=basu",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600",
      type: "meal"
    }
  ];

  // Convert database transformations into card-compatible layouts
  const dbFormatted = dbTransformations.map(item => ({
    user: item.name,
    date: `${item.weeks} WEEKS COMPLETED`,
    text: item.quote,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&color=fff`,
    type: 'db',
    before: item.before,
    after: item.after
  }));

  // Prioritize DB entries over initial static testimonials
  const displayList = [...dbFormatted, ...testimonials].slice(0, 3);

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-black text-white text-center uppercase tracking-tighter mb-20 italic">
          Real members, real results
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayList.map((t: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#1c1c1c] rounded-[40px] overflow-hidden border border-white/5 flex flex-col"
            >
              <div className="p-8 flex-1">
                <p className="text-white/60 text-xs font-medium leading-relaxed mb-8 italic">
                  "{t.text}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} className="w-10 h-10 rounded-full border border-white/10" alt={t.user} />
                    <div className="text-left">
                      <div className="text-white font-black text-xs uppercase tracking-tight">{t.user}</div>
                      <div className="text-white/20 text-[8px] font-bold uppercase">{t.date}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative aspect-square overflow-hidden bg-black">
                {t.type === 'db' ? (
                  <img src={t.after} className="w-full h-full object-cover transition-all duration-700 hover:scale-105" alt="After" />
                ) : t.type === 'chart' ? (
                  <div className="absolute inset-0 p-8 flex flex-col bg-[#1c1c1c]">
                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest mb-8 border-b border-white/5 pb-4">
                      <span>HABITS</span>
                      <span className="text-[#FF7200] border-b-2 border-[#FF7200]">OUTCOMES</span>
                      <span>LIFESTYLE SCORE</span>
                    </div>
                    <div className="mb-8">
                      <div className="text-white/40 text-[10px] font-black uppercase mb-1">Weight</div>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="text-white font-black text-xl">
                          You have lost<br />
                          <span className="text-green-500">2.20 kg in 9 days!</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div>
                        <div className="text-white/20 text-[8px] font-black uppercase mb-1">STARTING</div>
                        <div className="text-white font-black text-xl">70.9 <span className="text-xs text-white/40">kg</span></div>
                      </div>
                      <div>
                        <div className="text-white/20 text-[8px] font-black uppercase mb-1">LAST UPDATED</div>
                        <div className="text-white font-black text-xl">68.7 <span className="text-xs text-white/40">kg</span></div>
                      </div>
                    </div>
                    <div className="mt-auto h-24 relative">
                      <svg className="w-full h-full" viewBox="0 0 100 40">
                        <path d="M0,10 L50,30 L100,25" fill="none" stroke="#FF7200" strokeWidth="2" />
                        <circle cx="50" cy="30" r="1" fill="#FF7200" />
                        <circle cx="100" cy="25" r="1" fill="#FF7200" />
                      </svg>
                      <div className="absolute bottom-0 inset-x-0 flex justify-between text-white/10 text-[6px] font-bold">
                        <span>05 Jun</span>
                        <span>Today</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img src={t.image} className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0" alt="Result" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </div>
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
    { q: "What is fitX TRANSFORM?", a: "fitX TRANSFORM is a results-oriented program that combines personal coaching with customized diet plans to help you lose weight and sustain a healthy lifestyle." },
    { q: "How does the coaching work?", a: "You'll be assigned a dedicated coach who will track your workouts, review your meals, and provide weekly consultations to ensure you stay on track." },
    { q: "Can I do this program at home?", a: "Yes! The program is flexible and can be adapted for home workouts or gym sessions depending on your preference." },
  ];

  return (
    <section id="faq" className="py-16 border-t border-white/5 scroll-mt-32">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-20 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">FAQS</h2>
            <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">FITX TRANSFORM</p>
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
                  >
                    <div className="pb-8 pl-5 text-white/40 text-sm leading-relaxed max-w-2xl font-medium">{faq.a}</div>
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

export default function FitXTransform() {
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);

  useEffect(() => {
    api.getPageHeroes()
      .then(heroes => {
        const transformHero = heroes.find(h => h.pageKey === 'transform');
        if (transformHero) setHeroData(transformHero);
      })
      .catch(err => console.error("Error loading transform hero", err));
  }, []);

  return (
    <div className="relative w-full min-h-screen pt-16 selection:bg-[#FF7200]/30 premium-bg">
      <CanvasScrollBg />
      <FitnessSubNav />


      <div className="flex flex-col">
        <Hero data={heroData} />
        <ScrollReveal type="slide-up"><TimerOffer /></ScrollReveal>
        <ScrollReveal type="slide-up"><StatsShowcase data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><AccessGrid data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><TrainerLedClasses data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><AtHomeWorkouts data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><TrainersSection data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><MembershipComparison data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><Testimonials /></ScrollReveal>
        <ScrollReveal type="slide-up"><FAQSection /></ScrollReveal>
      </div>
    </div>
  );
}
