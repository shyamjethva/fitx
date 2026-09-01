import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  Target, 
  Zap, 
  Heart, 
  Utensils, 
  Trophy, 
  ChevronRight, 
  Activity,
  ArrowRight,
  Flame,
  Medal,
  Timer,
  Wind,
  Beef,
  BicepsFlexed,
  Gauge,
  Apple,
  Flower,
  HeartPulse
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import { TimerOffer } from '../components/TimerOffer';
import ScrollReveal from '../components/ScrollReveal';
import { api, Program, PageHeroData } from '../lib/api';

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
        ctx.fillStyle = `rgba(255, 160, 64, ${0.2 + scrollValue * 0.3})`; // Electric Cyan
        ctx.fill();

        // Lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 160, 64, ${0.1 * (1 - dist / 200) * (1 + scrollValue)})`; // Electric Cyan Line
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
      
      
    </div>
  );
};

// --- Sub Components ---

const programTabs = [
  { key: 'programs_all', value: 'ALL PROGRAMS', label: 'ALL PROGRAMS' },
  { key: 'programs_weight_loss', value: 'WEIGHT LOSS', label: 'WEIGHT LOSS' },
  { key: 'programs_muscle_gain', value: 'MUSCLE GAIN', label: 'MUSCLE GAIN' },
  { key: 'programs_cardio', value: 'CARDIO', label: 'CARDIO' },
  { key: 'programs_yoga', value: 'YOGA', label: 'YOGA' },
  { key: 'programs_athletic', value: 'ATHLETIC', label: 'ATHLETIC' }
];

const isEnabled = (value: unknown) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());

const programHeroKeys: Record<string, string> = {
  'ALL PROGRAMS': 'programs_all',
  'WEIGHT LOSS': 'programs_weight_loss',
  'MUSCLE GAIN': 'programs_muscle_gain',
  'CARDIO': 'programs_cardio',
  'YOGA': 'programs_yoga',
  'ATHLETIC': 'programs_athletic'
};

const SubNav = ({ active, setActive }: { active: string, setActive: (s: string) => void }) => {
  const { globalSettings } = useUI();
  const blocks = globalSettings?.contentBlocks || {};
  const tabs = programTabs
    .filter((item) => isEnabled(blocks[`${item.key}_enabled`] ?? true))
    .map((item) => ({ ...item, label: blocks[`${item.key}_label`] || item.label }));

  React.useEffect(() => {
    if (tabs.length > 0 && !tabs.some((item) => item.value === active)) {
      setActive(tabs[0].value);
    }
  }, [active, setActive, tabs]);

  return (
    <div className="w-full bg-[#0A0F24]/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 overflow-x-auto no-scrollbar">
      <div className="max-w-5xl mx-auto flex justify-start md:justify-center items-center gap-6 md:gap-14 py-4 px-6 min-w-max md:min-w-0">
        {tabs.map((item) => (
          <button
            key={item.value}
            onClick={() => setActive(item.value)}
            className="whitespace-nowrap text-[12px] font-black transition-all uppercase tracking-[0.15em] relative py-1"
            style={{ color: active === item.value ? '#FFA040' : 'rgba(255, 255, 255, 0.6)' }}
          >
            {item.label}
            {active === item.value && (
              <motion.div 
                layoutId="activeProgramTab"
                className="absolute -bottom-4 left-0 right-0 h-[2px] bg-[#FFA040]"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const heroContent: Record<string, { img: string, title: string, desc: string, highlight: string }> = {
  'ALL PROGRAMS': {
    img: '/all_programs_hero.png',
    title: 'Transform Your',
    highlight: 'Reality',
    desc: 'Choose a path engineered for results. Elite training programs designed by world-class athletes.'
  },
  'WEIGHT LOSS': {
    img: '/weight_loss_hiit_hero.png',
    title: 'Precision Weight',
    highlight: 'Loss',
    desc: 'Burn calories faster than ever with scientific HIIT and metabolic conditioning.'
  },
  'MUSCLE GAIN': {
    img: '/muscle_gain_hero.png',
    title: 'Peak',
    highlight: 'Hypertrophy',
    desc: 'Build massive strength and volume with our elite muscle-building protocols.'
  },
  'CARDIO': {
    img: '/cardio_hero_v2.png',
    title: 'Endless',
    highlight: 'Stamina',
    desc: 'Elevate your heart rate and endurance with high-performance cardio circuits.'
  },
  'YOGA': {
    img: '/yoga_hero.png',
    title: 'Body & Mind',
    highlight: 'Flow',
    desc: 'Find your center with flows designed for maximum flexibility and mindfulness.'
  },
  'ATHLETIC': {
    img: '/athletic_hero_v2.png',
    title: 'Elite',
    highlight: 'Performance',
    desc: 'Train like a pro with sports-specific drills and athletic conditioning.'
  }
};

const Hero = ({ activeTab, heroData }: { activeTab: string; heroData: PageHeroData | null }) => {
  const baseContent = heroContent[activeTab] || heroContent['ALL PROGRAMS'];
  const content = heroData 
    ? {
        img: heroData.image || baseContent.img,
        title: heroData.title || baseContent.title,
        highlight: heroData.subtitle || baseContent.highlight,
        desc: heroData.description || baseContent.desc
      }
    : baseContent;

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-transparent">
      <div className="relative w-full min-h-[100dvh] flex flex-col justify-center">
        {/* Immersive Background */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={content.img}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src={content.img}
              className="w-full h-full object-cover object-center"
              alt="Programs Hero"
            />
          </AnimatePresence>
          {/* Text-side shadow overlay for readability without obscuring the background image */}
          <div className="absolute inset-y-0 left-0 w-full md:w-[60%] lg:w-[50%] z-10 bg-gradient-to-r from-[#0A0F1C]/80 via-[#0A0F1C]/40 to-transparent pointer-events-none" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 px-6 md:px-24">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-8xl lg:text-[100px] font-black text-white mb-4 md:mb-6 tracking-tighter leading-[0.9] uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              {content.title.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-3 md:mr-5 hover:text-[#FFA040] transition-colors duration-500">
                  {word}
                </span>
              ))}
              <br />
              <span className="inline-block text-[#FFA040] hover:text-white transition-colors duration-500 drop-shadow-[0_4px_20px_rgba(255, 160, 64,0.4)] mt-2">
                {content.highlight}
              </span>
            </h1>
            <p className="text-white text-lg md:text-2xl font-bold tracking-tight uppercase max-w-2xl drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] mt-6">
              {content.desc}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const FALLBACK_PROGRAMS: Program[] = [
  {
    id: "1",
    title: "Weight Loss",
    slug: "weight-loss",
    tag: "WEIGHT LOSS",
    desc: "Targeted high-intensity workouts designed to maximize calorie burn and metabolic rate.",
    iconName: "Gauge",
    img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FFA040]/40 to-transparent"
  },
  {
    id: "2",
    title: "Muscle Gain",
    slug: "muscle-gain",
    tag: "MUSCLE GAIN",
    desc: "Hypertrophy-focused training programs for building maximum lean muscle mass.",
    iconName: "Dumbbell",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FFA040]/40 to-transparent"
  },
  {
    id: "3",
    title: "Cardio",
    slug: "cardio",
    tag: "CARDIO",
    desc: "Improve your cardiovascular health and stamina with our elite cardio circuits.",
    iconName: "HeartPulse",
    img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FFA040]/40 to-transparent"
  }
];

const renderProgramIcon = (iconName: string) => {
  const props = { className: "w-10 h-10 text-[#FFA040]" };
  switch(iconName) {
    case 'Gauge': return <Gauge {...props} />;
    case 'Dumbbell': return <Dumbbell {...props} className="w-10 h-10 text-[#FFA040]" />;
    case 'HeartPulse': return <HeartPulse {...props} />;
    case 'Flower': return <Flower {...props} className="w-10 h-10 text-[#FF9942]" />;
    case 'Apple': return <Apple {...props} className="w-10 h-10 text-[#FFA040]" />;
    case 'Target': return <Target {...props} />;
    default: return <Dumbbell {...props} />;
  }
};

export default function Programs() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoginModalOpen } = useUI();
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('fitx_programs_active_tab') || 'ALL PROGRAMS');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroDataMap, setHeroDataMap] = useState<Record<string, PageHeroData>>({});

  useEffect(() => {
    api.getPageHeroes()
      .then(heroes => {
        const nextMap = heroes.reduce<Record<string, PageHeroData>>((acc, hero) => {
          acc[hero.pageKey] = hero;
          return acc;
        }, {});
        setHeroDataMap(nextMap);
      })
      .catch(err => console.error("Error loading programs page hero", err));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getPrograms(FALLBACK_PROGRAMS);
        setPrograms(data);
      } catch (err) {
        setPrograms(FALLBACK_PROGRAMS);
      } finally {
        setLoading(false);
        // Restore scroll position
        const savedScrollY = sessionStorage.getItem('fitx_programs_scroll_y');
        if (savedScrollY) {
          const y = parseInt(savedScrollY);
          setTimeout(() => {
            if ((window as any).lenis) {
              (window as any).lenis.scrollTo(y, { immediate: true });
            } else {
              window.scrollTo(0, y);
            }
            sessionStorage.removeItem('fitx_programs_scroll_y');
          }, 150);
        }
      }
    };
    load();
  }, []);

  const filteredPrograms = activeTab === 'ALL PROGRAMS' 
    ? programs 
    : programs.filter(p => p.tag === activeTab);
  const activeHeroData = heroDataMap[programHeroKeys[activeTab] || 'programs'] || (activeTab === 'ALL PROGRAMS' ? heroDataMap.programs : null) || null;
  const programsHeroData = heroDataMap.programs_all || heroDataMap.programs || null;

  const handleStart = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      alert('Program started!');
    }
  };

  return (
    <div className="relative w-full min-h-screen pt-16 selection:bg-[#FFA040]/30 premium-bg">
      <CanvasScrollBg />
      <SubNav active={activeTab} setActive={(tab) => {
        setActiveTab(tab);
        sessionStorage.setItem('fitx_programs_active_tab', tab);
      }} />
      
      <div className="flex flex-col">
        <ScrollReveal type="fade"><Hero activeTab={activeTab} heroData={activeHeroData} /></ScrollReveal>
        <TimerOffer />

        {/* Dynamic Grid Section */}
        <section className="py-12 px-6 md:px-20">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-center justify-between mb-20 border-b border-white/5 pb-10">
               <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">{programsHeroData?.contentBlocks?.programs_title || 'Featured Path'}</h2>
               <div className="flex items-center gap-4 text-white/40 font-black text-xs uppercase tracking-widest">
                  <span>Showing {filteredPrograms.length} Results</span>
                  <div className="w-12 h-[1px] bg-white/10" />
               </div>
            </div>

            <div className={
              filteredPrograms.length === 1 
                ? 'grid grid-cols-1 gap-8 max-w-[450px] mx-auto w-full' 
                : filteredPrograms.length === 2 
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto w-full' 
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full'
            }>
              {filteredPrograms.map((program, idx) => (
                <ScrollReveal key={program.title} type="slide-up">
                  <motion.div
                    whileHover={{ y: -15 }}
                    onClick={() => {
                      const scrollY = (window as any).lenis?.scroll || window.scrollY;
                      sessionStorage.setItem('fitx_programs_active_tab', activeTab);
                      sessionStorage.setItem('fitx_programs_scroll_y', Math.round(scrollY).toString());
                      navigate(`/programs/${program.slug}`);
                    }}
                    className="group relative h-[650px] rounded-[48px] overflow-hidden border border-white/5 bg-[#1a1a1c] cursor-pointer shadow-2xl"
                  >
                    <img
                      src={program.img}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                      alt={program.title}
                    />
                    
                    {/* Sleek Premium Bottom Gradient instead of Glass Box */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700 z-0" />
                    
                    <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-40 transition-opacity duration-700 z-0`} />

                    {/* Content Section - resting purely on the gradient */}
                    <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col justify-end z-10 transition-transform duration-500 group-hover:-translate-y-4">
                      
                      {/* Icon */}
                      <div className="mb-8 w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:border-[#FFA040]/50 group-hover:bg-[#FFA040]/10 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        {renderProgramIcon(program.iconName)}
                      </div>

                      <div className="space-y-5">
                        <div className="flex flex-col gap-1">
                           <span className="font-black text-[#FFA040] text-[10px] tracking-[0.4em] uppercase">
                             {program.tag}
                           </span>
                           <h3 className="text-white font-black text-4xl md:text-5xl tracking-tighter leading-none group-hover:text-white transition-colors">
                             {program.title}
                           </h3>
                        </div>
                        
                        <p className="text-white/60 text-sm font-medium leading-relaxed transition-all duration-300">
                          {program.desc}
                        </p>
 
                        <div className="pt-6 flex items-center gap-4 opacity-80 group-hover:opacity-100 transition-opacity">
                           <button 
                            className="bg-[#FFA040] text-[#0A0F24] font-black px-8 py-4 rounded-xl tracking-widest uppercase text-[10px] shadow-[0_10px_20px_rgba(255, 160, 64,0.3)] hover:scale-105 transition-all"
                           >
                              EXPLORE PATHWAY
                           </button>
                           <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-110 transition-all">
                              <ArrowRight className="w-5 h-5" />
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
 
        {/* Bottom CTA similar to Fitness */}
        <section className="py-40 border-t border-white/5 bg-zinc-950 force-text-dark">
           <div className="max-w-4xl mx-auto text-center px-6">
              <h2 className="text-6xl md:text-8xl font-black text-white/30 mb-12 uppercase select-none tracking-tighter">{programsHeroData?.contentBlocks?.cta_title || 'ELITE RESULTS'}</h2>
              <p className="text-white/60 text-2xl font-bold mb-12 uppercase tracking-tight italic">{programsHeroData?.contentBlocks?.cta_desc || 'Every program is a promise of transformation. Are you ready to commit?'}</p>
              <button 
                onClick={handleStart}
                className="bg-[#FFA040] text-[#0A0F24] font-black px-16 py-6 rounded-2xl tracking-[0.4em] uppercase text-xs hover:scale-105 transition-all shadow-[0_0_50px_rgba(255, 160, 64,0.25)]"
              >
                 GET STARTED NOW
              </button>
           </div>
        </section>
      </div>
    </div>
  );
}
