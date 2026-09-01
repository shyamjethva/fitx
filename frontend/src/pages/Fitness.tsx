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
import FannedCardGallery from '../components/FannedCardGallery';
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
        ctx.fillStyle = `rgba(255, 160, 64, ${0.2 + scrollValue * 0.3})`; // Teal
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
    <div className="fixed inset-0 -z-10 premium-bg">
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="opacity-40" />
      {/* Mesh Gradients Overlay */}
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


const AtHomeWorkouts = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  const { isLoggedIn, setIsLoginModalOpen } = useUI();
  const workouts = [
    {
      trainer: 'Nandini Shetty',
      title: 'Dance Fitness Xtreme',
      type: 'DANCE • INTERMEDIATE • 47 Min',
      img: '/athome1.jpeg',
      live: '26+ LIVE'
    },
    {
      trainer: 'Rahul Shetty',
      title: 'Cardio HIIT',
      type: 'CARDIO • BEGINNER • 30 Min',
      img: '/athome2.jpeg',
    },
    {
      trainer: 'Isheeta Ray',
      title: 'Dance Fitness Xpress',
      type: 'DANCE • BEGINNER • 33 Min',
      img: '/athome3.jpeg',
    }
  ];

  return (
    <section className="py-20 px-6 md:px-24 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16 relative z-10">
          <p className="text-[#7A5737] font-black text-sm tracking-[0.2em] uppercase mb-4 drop-shadow-md">
            {content.athome_subtitle || 'AT-HOME'}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#7A5737] tracking-tighter drop-shadow-lg uppercase">
            {content.athome_title || 'Unlimited home workouts with calorie tracking'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {workouts.map((w, idx) => (
            <motion.div
              key={w.title}
              initial="initial"
              whileHover="hover"
              className="relative aspect-[3/4.5] rounded-[32px] overflow-hidden group cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-[#7A5737]"
            >
              <motion.img
                src={w.img}
                alt={w.title}
                variants={{
                  initial: { scale: 1 },
                  hover: { scale: 1.05 }
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {w.live && (
                <div className="absolute top-6 left-6 bg-black/80 px-3 py-1.5 rounded-lg text-[10px] font-black text-[#7A5737] z-10 tracking-wider shadow-lg">
                  {w.live}
                </div>
              )}

              {/* Dark semi-transparent box at the bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 pt-8 pb-6 px-6 bg-[#7A5737]/95 rounded-t-[32px] flex flex-col items-center text-center transition-transform duration-500 transform translate-y-2 group-hover:translate-y-0"
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <p className="text-[#7A5737] text-[10px] font-black uppercase mb-1.5 tracking-[0.2em]">{w.trainer}</p>
                <h3 className="text-[#7A5737] font-black text-2xl md:text-3xl mb-2 tracking-tighter leading-tight">{w.title}</h3>
                <p className="text-[rgba(122,87,55,0.72)] text-[9px] font-bold tracking-[0.2em] uppercase mb-6">{w.type}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isLoggedIn) {
                      setIsLoginModalOpen(true);
                    }
                  }}
                  className="w-full bg-[#FFA040] text-[#0F0F10] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors duration-300 shadow-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-[#0A0F1C] animate-pulse" />
                  <span className="font-black text-[11px] tracking-widest uppercase">JOIN CLASS</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PremiumVideo = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const videoOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="py-20 bg-transparent relative z-10 w-full overflow-hidden">
      <div className="w-full mx-auto max-w-7xl px-6 md:px-12">
        <h2 className="text-4xl md:text-6xl font-black text-[#7A5737] text-center mb-10 uppercase tracking-tight drop-shadow-lg">
          FREE TRIALS
        </h2>
        <motion.div
          style={{ scale: videoScale, opacity: videoOpacity }}
          className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden mb-8 rounded-[40px] shadow-[0_20px_60px_rgba(255, 160, 64,0.15)] border border-white/10 mx-auto"
        >
          <video
            src="/animo-focus-slider.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none text-center">
            <p className="text-[#7A5737] font-bold tracking-widest text-sm mb-2 uppercase drop-shadow-md">Unlock your potential</p>
            <h3 className="text-[#7A5737] text-3xl md:text-5xl font-black uppercase tracking-tighter drop-shadow-xl">EXPERIENCE FITX PREMIUM</h3>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const TransformSection = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  return (
    <section className="py-24 px-6 md:px-24 relative overflow-hidden bg-gradient-to-br from-white via-orange-50 to-orange-100 border-y border-orange-200">
      {/* Decorative Image - Floating Right */}
      <div className="absolute inset-y-0 my-auto right-12 w-[40%] max-w-[600px] h-[75%] rounded-[60px] overflow-hidden shadow-2xl pointer-events-none hidden lg:block border border-orange-100 opacity-100">
        <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Healthy Food" />
      </div>

      <div className="max-w-screen-2xl mx-auto relative z-10 flex">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-black text-[#7A5737] mb-1 uppercase tracking-wider drop-shadow-sm">{content.transform_subtitle || 'fitX transform'}</h2>
          <p className="text-4xl md:text-6xl font-black text-[#7A5737] mb-16 tracking-tight leading-tight">{content.transform_title || 'Lose weight for good'}</p>

          <div className="space-y-8 mb-16">
            {[
              { text: 'Online Habit Coach', icon: <CheckCircle2 className="w-6 h-6 text-[#7A5737]" /> },
              { text: 'Detailed Nutritional Guidelines', icon: <Apple className="w-6 h-6 text-[#7A5737]" /> },
              { text: 'Customized Workout Plan', icon: <Dumbbell className="w-6 h-6 text-[#7A5737]" /> },
              { text: 'Daily Check-ins & More!', icon: <Activity className="w-6 h-6 text-[#7A5737]" /> }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-xl transition-all duration-300">
                  {item.icon}
                </div>
                <p className="text-xl md:text-2xl font-bold text-[#7A5737]">{item.text}</p>
              </div>
            ))}
          </div>

          <Link to="/fitness/transform" className="inline-block text-[#0F0F10] bg-[#FFA040] px-8 py-4 rounded-full font-black text-lg tracking-widest uppercase hover:bg-white transition-all shadow-[0_10px_30px_rgba(255, 160, 64,0.3)] hover:shadow-xl">
            View transformation plans
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
          <p className="text-[#7A5737] font-black text-sm tracking-[0.2em] uppercase mb-8">{content.community_subtitle || 'fitX COMMUNITY'}</p>
          <h2 className="text-5xl md:text-7xl font-black text-[#7A5737] tracking-tighter mb-8 leading-[0.95] uppercase" dangerouslySetInnerHTML={{ __html: content.community_title?.replace(/\n/g, '<br />') || 'Be a part of our<br />global community' }} />
          <p className="text-[rgba(122,87,55,0.88)] text-xl font-bold mb-12 leading-relaxed uppercase tracking-tight">{content.community_desc || 'Experience shared motivation, real-time updates, and direct fitness tips by joining the elite Facebook group today.'}</p>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex bg-[#FFA040] text-[#0F0F10] font-black px-10 py-4 rounded-full text-sm tracking-widest uppercase hover:bg-white hover:text-[#0F0F10] transition-all shadow-[0_15px_30px_rgba(255, 160, 64,0.3)] group"
          >
            JOIN THE NETWORK NOW
          </a>
        </div>

        <div className="relative flex justify-center items-center">
          {/* Subtle Soft Glow */}
          <div className="absolute inset-0 bg-[#FFA040]/20 blur-[80px] rounded-full opacity-60 transform scale-75" />

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
    <section className="py-24 px-6 md:px-24 bg-gradient-to-br from-white via-orange-50 to-orange-100 border-t border-b border-orange-200 shadow-2xl relative">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black text-[#7A5737] mb-20 uppercase tracking-tighter text-center drop-shadow-sm">FAQS</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-white/10 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full py-8 flex justify-between items-center text-left"
              >
                <span className="text-xl font-bold text-[#7A5737]">{faq.q}</span>
                {openIndex === idx ? <Minus className="w-6 h-6 text-[#7A5737]" /> : <Plus className="w-6 h-6 text-[#7A5737]" />}
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pb-8 text-[rgba(122,87,55,0.88)] font-bold leading-relaxed"
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

const FitnessHero = () => {
  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-transparent">
      {/* Full Background Image - Custom generated unique premium gym interior without distracting text or subjects */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: 'url(/premium_gym_background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'contrast(1.1) saturate(1.1)'
        }}
      />

      {/* Premium Cinematic Color Overlay - Orange overlay to blend seamlessly into page background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1C]/90 via-[#0A0F1C]/70 to-transparent pointer-events-none z-0" />

      <style>{`
        #fitness-hero-section h2 { color: #FFA040 !important; -webkit-text-fill-color: #FFA040 !important; }
        #fitness-hero-section h1 { color: #D8B79A !important; -webkit-text-fill-color: #D8B79A !important; }
        #fitness-hero-section h1 span { color: #FFA040 !important; -webkit-text-fill-color: #FFA040 !important; }
        #fitness-hero-section p { color: rgba(216, 183, 154, 0.90) !important; -webkit-text-fill-color: rgba(216, 183, 154, 0.90) !important; }
      `}</style>

      <div id="fitness-hero-section" className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[#FF7200] font-black text-xl md:text-2xl tracking-widest uppercase mb-6 drop-shadow-md"
        >
          FITX PREMIUM
        </motion.h2>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl"
        >
          ELEVATE<br /><span className="text-[#FF7200]">YOUR GAME</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/80 text-xl md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Experience the future of fitness with advanced tracking and personalized routines tailored specifically for you.
        </motion.p>
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
    <div
      className="relative w-full min-h-screen pt-16 selection:bg-[#FFA040]/30 premium-bg"
      style={{
        background: 'linear-gradient(180deg, #F0B892 0%, #F5C7A1 20%, #F8DAC0 42%, #FAE0CC 62%, #FDF2EC 80%, #FFFFFF 100%)',
        backgroundAttachment: 'fixed',
        color: '#111827'
      }}
    >
      <CanvasScrollBg />
      <FitnessSubNav />

      <div className="flex flex-col">
        <ScrollReveal type="fade"><FitnessHero /></ScrollReveal>
        <TimerOffer />
        <ScrollReveal type="slide-up"><FannedCardGallery data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><AtHomeWorkouts data={heroData} /></ScrollReveal>
        <ScrollReveal type="scale"><PremiumVideo /></ScrollReveal>
        <ScrollReveal type="slide-up"><TransformSection data={heroData} /></ScrollReveal>
        <ScrollReveal type="slide-up"><Community data={heroData} /></ScrollReveal>
        <ScrollReveal type="fade"><FAQAccordion /></ScrollReveal>
      </div>
    </div>
  );
}

