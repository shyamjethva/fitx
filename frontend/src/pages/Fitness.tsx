import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Star,
  Plus,
  Minus,
  Apple,
  Smartphone,
  CheckCircle2,
  Dumbbell,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

import ScrollReveal from '../components/ScrollReveal';
import FitnessSubNav from '../components/FitnessSubNav';
import { useUI } from '../context/UIContext';
import { TimerOffer } from '../components/TimerOffer';
import { api, PageHeroData } from '../lib/api';

const CanvasScrollBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
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
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
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

      const scrollValue = scrollYProgress.get();
      const rotation = scrollValue * Math.PI * 2;
      const scale = 1 + scrollValue * 0.5;

      ctx.save();
      ctx.translate(dimensions.width / 2, dimensions.height / 2);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);
      ctx.translate(-dimensions.width / 2, -dimensions.height / 2);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > dimensions.width) p.vx *= -1;
        if (p.y < 0 || p.y > dimensions.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 114, 0, ${0.2 + scrollValue * 0.3})`; // Teal
        ctx.fill();

        // Lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 139, 16, ${0.1 * (1 - dist / 200) * (1 + scrollValue)})`; // Purple
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      ctx.restore();
      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [dimensions, scrollYProgress]);

  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="opacity-40" />
      {/* Mesh Gradients Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,114,0,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,139,16,0.1),transparent_50%)]" />
    </div>
  );
};

// --- Main Component ---

const Hero = ({ data }: { data: PageHeroData | null }) => {
  const image = data?.image || '/hero-bg.webp';

  return (
    <section className="relative w-full overflow-hidden bg-transparent">
      <div className="relative w-full aspect-[21/9] md:aspect-[25/9]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={image}
            className="w-full h-full object-cover object-top"
            alt="Fitness Hero"
          />
        </div>
      </div>
    </section>
  );
};

const ClassSlider = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  const classes = [
    {
      name: 'evolve YOGA',
      desc: 'FLEXIBILITY • MINDFUL TRANSITIONS',
      img: '/Yoga.jpg',
      color: 'from-[#1a0a00]/60'
    },
    {
      name: 'adidas strength +',
      desc: 'PLYO-AGILITY • ENDURANCE',
      img: '/athletic.png',
      color: 'from-orange-900/60'
    },
    {
      name: 'HRX WORKOUT',
      desc: 'MUSCLE GAIN • STRENGTH',
      img: 'https://images.unsplash.com/photo-1517438984742-1262db08379e?auto=format&fit=crop&q=80&w=800',
      color: 'from-blue-900/60'
    },
    {
      name: 'fitX RUN',
      desc: 'OUTDOOR • AEROBIC RUN',
      img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800',
      color: 'from-emerald-900/60'
    },
  ];

  return (
    <section className="py-12 px-6 md:px-24 bg-transparent">
      <div className="max-w-screen-2xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="text-white/40 font-bold text-sm tracking-[0.2em] uppercase mb-4">{content.classes_subtitle || 'AT-CENTER'}</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{content.classes_title || 'Trainer-led group classes'}</h2>
        </div>

        {/* Navigation Arrows */}
        <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors hidden md:flex">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors hidden md:flex">
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          {classes.map((cls) => (
            <motion.div
              key={cls.name}
              whileHover={{ y: -5 }}
              className="relative aspect-[3/4.5] rounded-lg overflow-hidden group cursor-pointer shadow-2xl"
            >
              <img src={cls.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cls.name} />
              <div className={`absolute inset-0 bg-gradient-to-t ${cls.color} via-transparent to-transparent opacity-80`} />
              <div className="absolute inset-x-0 bottom-0 p-8 text-center flex flex-col items-center">
                <h3 className="force-text-white font-black text-3xl italic uppercase tracking-tighter leading-none mb-2 drop-shadow-lg">
                  {cls.name}
                </h3>
                <p className="force-text-cyan text-[10px] font-bold tracking-widest uppercase">
                  {cls.desc}
                </p>
              </div>
            </motion.div>
          ))}
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
      name: 'Cardio HIIT',
      trainer: 'Rahul Shetty',
      meta: 'CARDIO • BEGINNER • 30 Min',
      img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Dance Fitness Xpress',
      trainer: 'Isheeta Ray',
      meta: 'DANCE • BEGINNER • 33 Min',
      img: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Dance Fitness Xtreme',
      trainer: 'Nandini Shetty',
      meta: 'DANCE • INTERMEDIATE • 47 Min',
      img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <section className="py-16 px-6 md:px-24 bg-transparent">
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="text-white/40 font-bold text-sm tracking-[0.2em] uppercase mb-4">{content.athome_subtitle || 'AT-HOME'}</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{content.athome_title || 'Unlimited home workouts with calorie tracking'}</h2>
        </div>

        {/* Navigation Arrows */}
        <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors hidden md:flex">
          <ChevronLeft className="w-8 h-8 text-white/40 hover:text-white" />
        </button>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors hidden md:flex">
          <ChevronRight className="w-8 h-8 text-white/40 hover:text-white" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workouts.map((w) => (
            <div key={w.name} className="bg-[#242933] rounded-xl overflow-hidden group cursor-pointer border border-white/5 shadow-2xl">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={w.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={w.name} />
              </div>
              <div className="p-8 flex flex-col items-center text-center">
                <p className="text-white/40 text-[10px] font-bold uppercase mb-2">{w.trainer}</p>
                <h3 className="text-white font-black text-2xl mb-2">{w.name}</h3>
                <p className="text-white/30 text-[9px] font-black tracking-[0.2em] uppercase mb-6">{w.meta}</p>

                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      setIsLoginModalOpen(true);
                    }
                  }}
                  className="bg-[#1f232b] border border-white/10 px-8 py-2 rounded-md flex items-center gap-2 hover:bg-[#2a2f3a] transition-all"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <span className="text-white font-black text-[10px] tracking-widest">BOOK</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FreeTrials = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  const { setIsFreeTrialModalOpen } = useUI();
  const trials = [
    {
      title: 'FUN GROUP CLASSES',
      desc: 'Yoga, dance, HRX and many more',
      img: '/yoga_group.jpg',
      hasButton: true
    },
    {
      title: 'AT-HOME WORKOUTS',
      desc: 'Yoga, dance, HRX and many more',
      img: '/Yoga.jpg',
      hasButton: true
    },
    {
      title: 'WORKOUT AT ELITE & PRO GYMS',
      desc: 'Yoga, dance, HRX and many more',
      img: '/athletic.png',
      hasButton: true
    }
  ];

  return (
    <section className="py-16 px-6 md:px-24 bg-transparent">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-16 uppercase tracking-tight">{content.freetrials_title || 'FREE TRIALS'}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {trials.map((trial, idx) => (
            <div key={idx} className="relative aspect-[3/4] overflow-hidden group cursor-pointer rounded-[20px] border border-white/5">
              <img src={trial.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={trial.title} />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h3 className="force-text-white font-black text-xl md:text-2xl mb-2 tracking-tighter uppercase leading-tight">{trial.title}</h3>
                <p className="force-text-white-muted text-xs font-bold mb-8 uppercase tracking-widest">{trial.desc}</p>

                {trial.hasButton && (
                  <button
                    onClick={() => setIsFreeTrialModalOpen(true)}
                    className="bg-white text-black font-black px-8 py-3 rounded-full text-[11px] tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 uppercase shadow-[0_10px_25px_rgba(255,255,255,0.2)]"
                  >
                    START A FREE TRIAL
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TransformSection = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  return (
    <section className="py-16 px-6 md:px-24 relative overflow-hidden bg-[#0A0F24]">
      {/* Background Decorative Images */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-40 pointer-events-none hidden lg:block">
        <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800" className="w-full object-contain -translate-y-10 translate-x-20 rotate-12" alt="" />
      </div>
      <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-50 pointer-events-none hidden lg:block">
        <img src="https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=800" className="w-full object-contain translate-y-32 translate-x-10 -rotate-12" alt="" />
      </div>

      <div className="max-w-screen-2xl mx-auto relative z-10">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tighter">{content.transform_subtitle || 'fitX transform'}</h2>
          <p className="text-4xl md:text-5xl font-medium text-white/80 mb-12 tracking-tight">{content.transform_title || 'Lose weight for good'}</p>

          <div className="space-y-8 mb-16">
            {[
              { text: 'Online Habit Coach', icon: <CheckCircle2 className="w-8 h-8 text-[#FF7200]" /> },
              { text: 'Detailed Nutritional Guidelines', icon: <Apple className="w-8 h-8 text-[#FF7200]" /> },
              { text: 'Customized Workout Plan', icon: <Dumbbell className="w-8 h-8 text-[#FF7200]" /> },
              { text: 'Daily Check-ins & More!', icon: <Activity className="w-8 h-8 text-[#FF7200]" /> }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-6 group">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-[#FF7200]/20 group-hover:border-[#FF7200]/50 transition-all">
                  {item.icon}
                </div>
                <span className="text-xl md:text-2xl font-bold text-white/90 group-hover:text-white transition-colors">{item.text}</span>
              </div>
            ))}
          </div>

          <Link to="/fitness/transform" className="text-[#FF8B10] font-black text-lg tracking-widest uppercase border-b-2 border-[#FF8B10]/30 hover:border-[#FF8B10] transition-all">
            EXPLORE OFFERS
          </Link>
        </div>
      </div>
    </section>
  );
};

const Community = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  const { isLoggedIn, setIsLoginModalOpen } = useUI();
  return (
    <section className="py-16 px-6 md:px-24 relative overflow-hidden bg-transparent">
      {/* Radial Dash Effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[800px] h-[1px] bg-white/40"
            style={{ transform: `rotate(${i * 15}deg)` }}
          >
            <div className="absolute right-0 w-8 h-1 bg-white/60 rounded-full translate-x-20" />
            <div className="absolute left-0 w-8 h-1 bg-white/60 rounded-full -translate-x-20" />
          </div>
        ))}
      </div>

      <div className="max-w-screen-2xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
        <div className="max-w-2xl">
          <p className="text-[#FF7200] font-black text-sm tracking-[0.2em] uppercase mb-8">{content.community_subtitle || 'fitX COMMUNITY'}</p>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.95] uppercase" dangerouslySetInnerHTML={{ __html: content.community_title?.replace(/\n/g, '<br />') || 'Be a part of our<br />global community' }} />
          <p className="text-white/60 text-xl font-bold mb-12 leading-relaxed uppercase tracking-tight">{content.community_desc || 'Experience shared motivation, real-time updates, and direct fitness tips by joining the elite Facebook group today.'}</p>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex bg-[#FF7200] text-black font-black px-10 py-4 rounded-full text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all shadow-[0_15px_30px_rgba(255,114,0,0.3)] group"
          >
            JOIN THE NETWORK NOW
          </a>
        </div>

        <div className="relative flex justify-center items-center">
          {/* Subtle Soft Glow */}
          <div className="absolute inset-0 bg-[#FF7200]/20 blur-[80px] rounded-full opacity-60 transform scale-75" />

          {/* Dynamic Main Image Frame */}
          <div className="relative z-10 w-full aspect-[16/10] rounded-[40px] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-white/10 group">
            <img
              src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=1600"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Community"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    { q: 'What is fitX?', a: 'fitX is a premium fitness ecosystem offering group classes, gym access, and home workouts.' },
    { q: 'What kind of workout formats are available at fitX?', a: 'We offer Yoga, Dance, HRX, Strength, Cardio HIIT, and specialized transformation programs.' },
    { q: 'How is the fitX center different from a regular gym?', a: 'We focus on trainer-led group classes and a holistic community experience rather than just equipment access.' },
    { q: 'Are fitX classes beginner friendly?', a: 'Absolutely! Our trainers provide modifications for all levels, from beginners to advanced athletes.' }
  ];

  return (
    <section className="py-20 px-6 md:px-24 bg-transparent">
      <div className="max-w-screen-2xl mx-auto">
        <h2 className="text-6xl font-black text-white mb-20 uppercase italic">FAQS</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-white/10 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full py-8 flex justify-between items-center text-left"
              >
                <span className="text-xl font-bold text-white/90">{faq.q}</span>
                {openIndex === idx ? <Minus className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pb-8 text-white/50 font-bold leading-relaxed"
                  >
                    {faq.a}
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

// --- Main Component ---

export default function Fitness() {
  const { setIsFreeTrialModalOpen } = useUI();
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);

  useEffect(() => {
    api.getPageHeroes()
      .then(heroes => {
        const fitHero = heroes.find(h => h.pageKey === 'fitness');
        if (fitHero) setHeroData(fitHero);
      })
      .catch(err => console.error("Error loading fitness hero", err));
  }, []);

  return (
    <div className="relative w-full min-h-screen pt-16 selection:bg-[#FF7200]/30 premium-bg">
      <CanvasScrollBg />
      <FitnessSubNav />

      <div className="flex flex-col">
        <ScrollReveal type="fade"><Hero data={heroData} /></ScrollReveal>
        <TimerOffer />
        <ScrollReveal type="slide-up"><ClassSlider data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><AtHomeWorkouts data={heroData} /></ScrollReveal>
        <ScrollReveal type="scale"><FreeTrials data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><TransformSection data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><Community data={heroData} /></ScrollReveal>
        <ScrollReveal type="fade"><FAQAccordion /></ScrollReveal>
      </div>
    </div>
  );
}

