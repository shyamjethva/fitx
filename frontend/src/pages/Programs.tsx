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
        ctx.fillStyle = `rgba(0, 229, 255, ${0.2 + scrollValue * 0.3})`; // Electric Cyan
        ctx.fill();

        // Lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.1 * (1 - dist / 200) * (1 + scrollValue)})`; // Electric Cyan Line
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,229,255,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(0,229,255,0.05),transparent_50%)]" />
    </div>
  );
};

// --- Sub Components ---

const SubNav = ({ active, setActive }: { active: string, setActive: (s: string) => void }) => (
  <div className="w-full bg-[#0A0F24]/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 overflow-x-auto no-scrollbar">
    <div className="max-w-5xl mx-auto flex justify-start md:justify-center items-center gap-6 md:gap-14 py-4 px-6 min-w-max md:min-w-0">
      {[
        'ALL PROGRAMS',
        'WEIGHT LOSS',
        'MUSCLE GAIN',
        'CARDIO',
        'YOGA',
        'ATHLETIC'
      ].map((item) => (
        <button
          key={item}
          onClick={() => setActive(item)}
          className="whitespace-nowrap text-[12px] font-black transition-all uppercase tracking-[0.15em] relative py-1"
          style={{ color: active === item ? '#00E5FF' : 'rgba(255, 255, 255, 0.6)' }}
        >
          {item}
          {active === item && (
            <motion.div 
              layoutId="activeProgramTab"
              className="absolute -bottom-4 left-0 right-0 h-[2px] bg-[#00E5FF]"
            />
          )}
        </button>
      ))}
    </div>
  </div>
);

const heroContent: Record<string, { img: string, title: string, desc: string, highlight: string }> = {
  'ALL PROGRAMS': {
    img: '/all_prg.jpeg',
    title: 'Transform Your',
    highlight: 'Reality',
    desc: 'Choose a path engineered for results. Elite training programs designed by world-class athletes.'
  },
  'WEIGHT LOSS': {
    img: '/weight_loss.jpeg',
    title: 'Precision Weight',
    highlight: 'Loss',
    desc: 'Burn calories faster than ever with scientific HIIT and metabolic conditioning.'
  },
  'MUSCLE GAIN': {
    img: '/muscle.jpeg',
    title: 'Peak',
    highlight: 'Hypertrophy',
    desc: 'Build massive strength and volume with our elite muscle-building protocols.'
  },
  'CARDIO': {
    img: '/cardio.jpeg',
    title: 'Endless',
    highlight: 'Stamina',
    desc: 'Elevate your heart rate and endurance with high-performance cardio circuits.'
  },
  'YOGA': {
    img: '/Yoga.jpg',
    title: 'Body & Mind',
    highlight: 'Flow',
    desc: 'Find your center with flows designed for maximum flexibility and mindfulness.'
  },
  'ATHLETIC': {
    img: '/athletic.png',
    title: 'Elite',
    highlight: 'Performance',
    desc: 'Train like a pro with sports-specific drills and athletic conditioning.'
  }
};

const Hero = ({ activeTab, heroData }: { activeTab: string; heroData: PageHeroData | null }) => {
  const baseContent = heroContent[activeTab] || heroContent['ALL PROGRAMS'];
  const content = activeTab === 'ALL PROGRAMS' && heroData 
    ? {
        img: heroData.image || baseContent.img,
        title: heroData.title || baseContent.title,
        highlight: heroData.subtitle || baseContent.highlight,
        desc: heroData.description || baseContent.desc
      }
    : baseContent;

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-transparent">
      <div className="relative w-full min-h-[420px] md:min-h-0 md:aspect-[25/9] h-auto flex flex-col justify-end">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 pb-12 px-6 md:pb-20 md:px-20">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-none uppercase">
              {content.title} <br /> <span className="text-[#00E5FF]">{content.highlight}</span>
            </h1>
            <p className="text-white/60 font-black text-sm md:text-2xl tracking-tight uppercase max-w-2xl">
              {content.desc}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FALLBACK_PROGRAMS: Program[] = [
  {
    id: "1",
    title: "Weight Loss",
    slug: "weight-loss",
    tag: "WEIGHT LOSS",
    desc: "Targeted high-intensity workouts designed to maximize calorie burn and metabolic rate.",
    iconName: "Gauge",
    img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FF7200]/40 to-transparent"
  },
  {
    id: "2",
    title: "Muscle Gain",
    slug: "muscle-gain",
    tag: "MUSCLE GAIN",
    desc: "Hypertrophy-focused training programs for building maximum lean muscle mass.",
    iconName: "Dumbbell",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FF8B10]/40 to-transparent"
  },
  {
    id: "3",
    title: "Cardio",
    slug: "cardio",
    tag: "CARDIO",
    desc: "Improve your cardiovascular health and stamina with our elite cardio circuits.",
    iconName: "HeartPulse",
    img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FF7200]/40 to-transparent"
  }
];

const renderProgramIcon = (iconName: string) => {
  const props = { className: "w-10 h-10 text-[#FF7200]" };
  switch(iconName) {
    case 'Gauge': return <Gauge {...props} />;
    case 'Dumbbell': return <Dumbbell {...props} className="w-10 h-10 text-[#FF8B10]" />;
    case 'HeartPulse': return <HeartPulse {...props} />;
    case 'Flower': return <Flower {...props} className="w-10 h-10 text-[#FF9942]" />;
    case 'Apple': return <Apple {...props} className="w-10 h-10 text-[#FF8B10]" />;
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
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);

  useEffect(() => {
    api.getPageHeroes()
      .then(heroes => {
        const prgHero = heroes.find(h => h.pageKey === 'programs');
        if (prgHero) setHeroData(prgHero);
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

  const handleStart = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      alert('Program started!');
    }
  };

  return (
    <div className="relative w-full min-h-screen pt-16 selection:bg-[#FF7200]/30 premium-bg">
      <CanvasScrollBg />
      <SubNav active={activeTab} setActive={(tab) => {
        setActiveTab(tab);
        sessionStorage.setItem('fitx_programs_active_tab', tab);
      }} />
      
      <div className="flex flex-col">
        <ScrollReveal type="fade"><Hero activeTab={activeTab} heroData={heroData} /></ScrollReveal>
        <TimerOffer />

        {/* Dynamic Grid Section */}
        <section className="py-12 px-6 md:px-20">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-center justify-between mb-20 border-b border-white/5 pb-10">
               <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">{heroData?.contentBlocks?.programs_title || 'Featured Path'}</h2>
               <div className="flex items-center gap-4 text-white/40 font-black text-xs uppercase tracking-widest">
                  <span>Showing {filteredPrograms.length} Results</span>
                  <div className="w-12 h-[1px] bg-white/10" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    className="group relative h-[650px] rounded-[60px] overflow-hidden border border-white/5 bg-[#151E32] cursor-pointer shadow-2xl"
                  >
                    <img
                      src={program.img}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      alt={program.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="mb-6 w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                        {renderProgramIcon(program.iconName)}
                      </div>

                      <div className="space-y-4">
                        <span className="font-black text-[#00E5FF] text-[10px] tracking-[0.4em] uppercase">
                          {program.tag}
                        </span>
                        <h3 className="text-white font-black text-4xl tracking-tighter leading-none group-hover:text-[#00E5FF] transition-colors">
                          {program.title}
                        </h3>
                        <p className="force-text-white-muted text-sm font-medium leading-relaxed transition-all duration-300">
                          {program.desc}
                        </p>
 
                        <div className="pt-4 flex items-center gap-4">
                           <button 
                            className="bg-white text-black font-black px-8 py-3 rounded-xl tracking-widest uppercase text-[9px] hover:bg-[#00E5FF] hover:text-[#0A0F24] transition-all"
                           >
                              EXPLORE PATHWAY
                           </button>
                           <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-[#00E5FF] group-hover:text-[#0A0F24] transition-all">
                              <ArrowRight className="w-4 h-4" />
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
        <section className="py-40 border-t border-white/5 bg-zinc-950">
           <div className="max-w-4xl mx-auto text-center px-6">
              <h2 className="text-6xl md:text-8xl font-black text-white/30 mb-12 uppercase select-none tracking-tighter">{heroData?.contentBlocks?.cta_title || 'ELITE RESULTS'}</h2>
              <p className="text-white/60 text-2xl font-bold mb-12 uppercase tracking-tight italic">{heroData?.contentBlocks?.cta_desc || 'Every program is a promise of transformation. Are you ready to commit?'}</p>
              <button 
                onClick={handleStart}
                className="bg-[#00E5FF] text-[#0A0F24] font-black px-16 py-6 rounded-2xl tracking-[0.4em] uppercase text-xs hover:scale-105 transition-all shadow-[0_0_50px_rgba(0,229,255,0.25)]"
              >
                 GET STARTED NOW
              </button>
           </div>
        </section>
      </div>
    </div>
  );
}
