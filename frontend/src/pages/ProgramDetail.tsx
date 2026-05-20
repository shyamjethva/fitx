import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Gauge, 
  Dumbbell, 
  HeartPulse, 
  Flower, 
  Apple, 
  Target,
  CheckCircle2,
  Timer,
  Flame,
  Activity,
  Users
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import { TimerOffer } from '../components/TimerOffer';
import ScrollReveal from '../components/ScrollReveal';

import { api, Program } from '../lib/api';

interface ProgramData {
  slug: string;
  title: string;
  tag: string;
  desc: string;
  longDesc: string;
  img: string;
  iconName: string;
  accent: string;
  highlights: string[];
  stats: { label: string; value: string }[];
}

// Local rich details mapping. If a dynamic program is loaded, we enrich it with these preset values if slug matches.
const RICH_DETAILS_MAP: Record<string, Partial<ProgramData>> = {
  'weight-loss': {
    longDesc: "Our Precision Weight Loss protocol is a scientifically engineered conditioning pipeline. We combine high-velocity metabolic intervals, strategic functional hypertrophy, and personalized biometric tracking to transform your body structure.",
    accent: "#00E5FF",
    highlights: [
      "High-Intensity Metabolic Conditioning (MetCon)",
      "Customizable caloric tracking integration",
      "Weekly biometric assessment and strategy adjusting",
      "Post-exercise oxygen consumption (EPOC) optimization"
    ],
    stats: [
      { label: "CAL/HOUR", value: "850+" },
      { label: "DURATION", value: "45 MIN" },
      { label: "INTENSITY", value: "MAX" }
    ]
  },
  'muscle-gain': {
    longDesc: "The Peak Hypertrophy curriculum targets deep mechanical tension and metabolic stress triggers essential for structural adaptation. Driven by progressive overload, premium resistance technology, and biomechanically optimized lift structures.",
    accent: "#00E5FF",
    highlights: [
      "Advanced hypertrophy and periodization modeling",
      "Compound structural lift stabilization and analysis",
      "High-density isolation and time-under-tension metrics",
      "Regenerative recovery coaching protocols"
    ],
    stats: [
      { label: "GOAL", value: "DENSITY" },
      { label: "FREQUENCY", value: "4x/WK" },
      { label: "LEVEL", value: "PRO" }
    ]
  },
  'cardio': {
    longDesc: "Build an engine that never quits. Endless Stamina utilizes progressive heart-rate zone conditioning, aerobic capacity drills, and VO2 Max threshold sessions. Optimized for endurance and active cardiac defense.",
    accent: "#00E5FF",
    highlights: [
      "Heart-Rate Optimized Endurance Circuits",
      "V02 Max and lactate threshold expansion tracking",
      "Low-impact, joint-friendly power pacing",
      "Real-time biometric heart rate visuals"
    ],
    stats: [
      { label: "HEART ZONE", value: "3-4" },
      { label: "FOCUS", value: "STAMINA" },
      { label: "ENDURANCE", value: "ELITE" }
    ]
  },
  'yoga': {
    longDesc: "The Body & Mind Flow bridges static structural geometry with focused, rhythmic breathing pipelines. Tailored for premium range-of-motion, neurological decompression, and essential flexibility.",
    accent: "#00E5FF",
    highlights: [
      "Dynamic dynamic flow combinations (Vinyasa)",
      "Deep myofascial flexibility restoration",
      "Stress neutralization and breath coordination",
      "Core equilibrium and stabilizing balance work"
    ],
    stats: [
      { label: "ENERGY", value: "RESTORE" },
      { label: "TYPE", value: "FLOW" },
      { label: "LEVEL", value: "OPEN" }
    ]
  },
  'diet-plan': {
    longDesc: "Fuel is everything. Our Precision Nutrition Blueprint aligns your exact micronutrient profile and biological macro requirements with your physical activities. Handcrafted by elite dietary architects.",
    accent: "#00E5FF",
    highlights: [
      "Macronutrient and biological profiling",
      "Performance-fueling prep schedules and recipes",
      "Cellular recovery and inflammation-defense guides",
      "Dynamic carbohydrate cycling architectures"
    ],
    stats: [
      { label: "DIET STYLE", value: "CLEAN" },
      { label: "METRIC", value: "MACROS" },
      { label: "SYSTEM", value: "1-ON-1" }
    ]
  },
  'sports': {
    longDesc: "Train at the velocity of the modern game. Athlete Performance systems bridge raw strength with multidirectional speed, explosive agility, and reactivity. Engineered for competitive dominance.",
    accent: "#00E5FF",
    highlights: [
      "Multidirectional agility and quick-reaction drills",
      "Explosive plyometric vertical integration",
      "Deceleration physics and impact protection",
      "Aerobic capacity buffering for match duration"
    ],
    stats: [
      { label: "POWER", value: "PEAK" },
      { label: "SPEED", value: "AGILITY" },
      { label: "PHASE", value: "ACTIVE" }
    ]
  }
};

const renderProgramIconDetail = (iconName: string, accent: string) => {
  const props = { className: "w-12 h-12", style: { color: accent } };
  switch(iconName) {
    case 'Gauge': return <Gauge {...props} />;
    case 'Dumbbell': return <Dumbbell {...props} />;
    case 'HeartPulse': return <HeartPulse {...props} />;
    case 'Flower': return <Flower {...props} />;
    case 'Apple': return <Apple {...props} />;
    case 'Target': return <Target {...props} />;
    default: return <Dumbbell {...props} />;
  }
};

export default function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<ProgramData | null>(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, setIsLoginModalOpen, activeUserId, setUserProfileData } = useUI();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
  }, [slug]);

  useEffect(() => {
    const loadProgram = async () => {
      if (!slug) return;
      try {
        const list = await api.getPrograms();
        const found = list.find(p => p.slug === slug);
        if (found) {
          const rich = RICH_DETAILS_MAP[slug] || {};
          setProgram({
            slug: found.slug,
            title: found.title,
            tag: found.tag,
            desc: found.desc,
            img: found.img,
            iconName: found.iconName,
            longDesc: rich.longDesc || found.desc,
            accent: rich.accent || "#00E5FF",
            highlights: rich.highlights || ["Elite coaching guidance", "Custom performance mapping", "Access to premium facilities"],
            stats: rich.stats || [
              { label: "INTENSITY", value: "HIGH" },
              { label: "TYPE", value: found.tag.split(' ')[0] },
              { label: "LEVEL", value: "ALL" }
            ]
          });
        }
      } catch (err) {
        console.error("Failed to load program detail:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProgram();
  }, [slug]);

  const handleInitialize = async () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      if (!activeUserId || !program) return;
      try {
        setIsUpdating(true);
        const updated = await api.updateUserProfile(activeUserId, {
          appliedProgram: program.title
        });
        if (updated) {
          setUserProfileData(updated);
          alert(`🎯 PROGRAM ACTIVATED SUCCESSFULLY!\n\nYou have officially applied for and enrolled in "${program.title}". Check your dashboard profile to begin!`);
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Failed registering program:", error);
        alert("Encountered server issue during enrollment.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF7200] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-3xl font-black mb-4">Program Not Found</h2>
        <Link to="/programs" className="text-[#FF7200] font-bold flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Programs
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen pt-16 pb-32 selection:bg-[#FF7200]/30 bg-[#0a0a0a] text-white font-sans">
      {/* Premium Mesh Ambient Layer */}
      <div className="absolute top-0 left-0 right-0 h-[800px] bg-gradient-to-b from-black to-transparent -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,114,0,0.08),transparent_50%)] -z-10" />

      {/* Dynamic Background Watermark Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden -z-10">
        <h2 className="text-[12vw] font-black text-white/[0.03] tracking-tighter uppercase leading-none translate-y-[-10%]">
          {program.title}
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12">
        {/* Back Navigation */}
        <button 
          onClick={() => navigate('/programs')}
          className="flex items-center gap-3 text-white/50 hover:text-white font-black text-[11px] tracking-[0.2em] uppercase mb-12 group transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          Back to paths
        </button>

        {/* Main Split Screen Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left: Details Info Block */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <div 
                className="w-24 h-24 rounded-3xl flex items-center justify-center border border-white/10 backdrop-blur-2xl relative overflow-hidden"
                style={{ backgroundColor: `${program.accent}10` }}
              >
                <div className="absolute inset-0 blur-xl opacity-30 bg-white/20" />
                <div style={{ color: program.accent }} className="relative z-10">
                  {renderProgramIconDetail(program.iconName, program.accent)}
                </div>
              </div>
              
              <div className="space-y-4">
                <span style={{ color: program.accent }} className="text-[11px] font-black tracking-[0.4em] uppercase inline-block">
                  {program.tag}
                </span>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase force-text-white">
                  {program.title}
                </h1>
              </div>

              <p className="text-2xl font-bold text-white/70 tracking-tight max-w-2xl leading-snug italic">
                "{program.desc}"
              </p>
            </div>

            {/* Technical Grid Section */}
            <div className="grid grid-cols-3 gap-6 border-y border-white/10 py-8">
              {program.stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <span className="block text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">{stat.label}</span>
                  <span className="text-3xl font-black text-white tracking-tighter uppercase">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Description Body */}
            <div className="space-y-6">
              <h3 className="text-xl font-black uppercase tracking-widest text-white/90">Protocol Architecture</h3>
              <p className="text-lg text-white/50 font-medium leading-relaxed">
                {program.longDesc}
              </p>
            </div>

            {/* Checklist Features */}
            <div className="space-y-6 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-10">
              <h4 className="text-xs font-black text-white/40 tracking-[0.3em] uppercase mb-6">Key Deliverables</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {program.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-white/80 shrink-0 mt-1" style={{ color: program.accent }} />
                    <span className="text-white/70 text-sm font-bold tracking-wide">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={handleInitialize}
                disabled={isUpdating}
                className="w-full md:w-auto px-16 py-6 rounded-2xl font-black text-xs tracking-[0.3em] uppercase transition-all hover:scale-[1.02] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] bg-white text-black hover:bg-[#00E5FF] hover:text-[#0A0F24] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'INITIALIZING SYNC...' : 'INITIALIZE PATHWAY'}
              </button>
            </div>
          </div>

          {/* Right: Immersive Feature Visual Frame */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="relative h-[600px] w-full rounded-[48px] overflow-hidden border border-white/10 group">
              <img 
                src={program.img} 
                alt={program.title} 
                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div 
                className="absolute inset-0 opacity-20 mix-blend-overlay transition-opacity group-hover:opacity-40" 
                style={{ background: `radial-gradient(circle at center, ${program.accent}, transparent)` }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
