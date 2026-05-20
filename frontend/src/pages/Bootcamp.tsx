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
  Dumbbell,
  Flame,
  Timer,
  Utensils,
  ClipboardList,
  MapPin,
  Calendar,
  GraduationCap,
  Scale,
  Bike,
  Heart
} from 'lucide-react';
import FitnessSubNav from '../components/FitnessSubNav';
import ScrollReveal from '../components/ScrollReveal';
import { TimerOffer } from '../components/TimerOffer';
import { useUI } from '../context/UIContext';
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
        ctx.fillStyle = 'rgba(255, 107, 0, 0.3)';
        ctx.fill();
      });
      animationFrame = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [dimensions]);

  return (
    <div className="fixed inset-0 -z-10 bg-[#050505]">
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="opacity-40" />
    </div>
  );
};

const Hero = ({ data }: { data: PageHeroData | null }) => {
  const { isLoggedIn, setIsLoginModalOpen, userProfileData } = useUI();
  const [submitting, setSubmitting] = useState(false);

  const title = data?.title || 'A 6-WEEK WEIGHT LOSS\nPROGRAM';
  const subtitle = data?.subtitle || 'TALK TO EXPERT';
  const rawDescription = data?.description || 'Small batch workouts at center\n1:1 Nutritionist & personalised meal plans\nLifestyle coach to help you with healthy habits';
  const image = data?.image || 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=1200';
  const ctaText = data?.ctaText || 'TALK TO EXPERT';

  const bullets = rawDescription.split('\n').filter(Boolean);

  const handleApply = async () => {
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
        plan: '6-WEEK BOOTCAMP',
        message: 'User requested callback for 6-Week Weight Loss Bootcamp.'
      });
      alert('🎯 SUCCESS! Expert callback request registered.');
    } catch (err) {
      console.error("Application fail:", err);
      alert('Failed to register request. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="hero" className="relative w-full overflow-hidden scroll-mt-32 bg-[#0A0F24]">
      <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row min-h-[85vh]">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-20 py-10 lg:py-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-12">
              {title.includes('<br />') ? (
                <span dangerouslySetInnerHTML={{ __html: title }} />
              ) : title.includes('\n') ? (
                <span dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }} />
              ) : title.includes(' ') ? (
                <>
                  {title.substring(0, title.lastIndexOf(' '))} <span className="text-[#FF7200]">{title.substring(title.lastIndexOf(' ') + 1)}</span>
                </>
              ) : (
                <span className="text-[#FF7200]">{title}</span>
              )}
            </h1>

            <ul className="space-y-6 mb-12">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-4 text-white/90 text-xl font-bold">
                  <ChevronRight className="w-5 h-5 text-orange-500" />
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleApply}
                disabled={submitting}
                className="bg-white text-black font-black px-12 py-4 rounded-md tracking-widest text-[10px] uppercase hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,107,0,0.2)] disabled:opacity-50"
              >
                {submitting ? 'REGISTERING...' : ctaText}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 relative min-h-[60vh] lg:min-h-0">
          <img
            src={image}
            className="absolute inset-0 w-full h-full object-cover object-center"
            alt={title}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent lg:hidden block" />
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Small group workouts with personalised trainer attention",
      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800"
    },
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "1:1 Nutrition coaching & personalised meal plans",
      img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800"
    },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: "Coaches will help you build discipline & healthy habits",
      img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section id="how-it-works" className="py-12 border-t border-white/5 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-20 items-start relative">
        <div className="md:w-1/3 md:sticky md:top-40 self-start pt-10">
          <p className="text-white/40 font-black tracking-[0.2em] uppercase text-[10px] mb-4">How it works</p>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
            Weight loss made simple,<br />fun & permanent!
          </h2>
        </div>

        <div className="md:w-2/3 relative">
          <div className="absolute left-[31px] top-6 bottom-20 w-[1px] bg-white/10" />

          <div className="space-y-40">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex gap-6 relative"
              >
                <div className="w-16 h-16 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-white shrink-0 relative z-10 shadow-[0_0_20px_rgba(255,107,0,0.05)]">
                  {step.icon}
                </div>

                <div className="flex flex-col gap-6 w-full">
                  <h3 className="text-white font-black text-xl md:text-2xl uppercase tracking-tight leading-tight">
                    {step.title}
                  </h3>
                  <div className="rounded-[32px] overflow-hidden border border-white/5 bg-[#1c1c1c] aspect-[16/9] w-full max-w-[500px]">
                    <img src={step.img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={step.title} />
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

const AdditionalFeatures = () => {
  const features = [
    {
      title: "Weekly masterclasses",
      desc: "Workshops by experts on various aspects of weight loss",
      icon: <GraduationCap className="w-8 h-8 text-orange-500" />,
      gradient: "from-orange-500/10 to-transparent"
    },
    {
      title: "Community",
      desc: "Strong and accountable community with a singular vision",
      icon: <Users className="w-8 h-8 text-blue-500" />,
      gradient: "from-blue-500/10 to-transparent"
    },
    {
      title: "Sustain the weight loss",
      desc: "A plan that ensures you don't gain the weight back",
      icon: <Scale className="w-8 h-8 text-green-500" />,
      gradient: "from-green-500/10 to-transparent"
    }
  ];

  return (
    <section className="py-12 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-white/40 font-black tracking-[0.4em] uppercase text-[10px] mb-3">Features</p>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
            And you'll also get
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-[#1c1c1c] rounded-[40px] p-6 flex flex-col items-center text-center border border-white/5 relative overflow-hidden group"
            >
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
                <div className="absolute inset-0 bg-white/5 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100" />
              </div>

              <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-4 relative z-10">
                {feature.title}
              </h3>
              <p className="text-white/40 font-bold text-sm leading-relaxed uppercase tracking-wide relative z-10">
                {feature.desc}
              </p>

              <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WeeklySnapshot = () => {
  const schedule = [
    { day: "M", type: "AT-CENTER WORKOUT", title: "Partner + Station workouts + Games", icon: <Users className="w-5 h-5" />, color: "bg-emerald-500" },
    { day: "T", type: "HOME WORKOUT", title: "Workouts recommended by trainers", icon: <Bike className="w-5 h-5" />, color: "bg-sky-500" },
    { day: "W", type: "AT-CENTER WORKOUT", title: "Full body + Team workouts + Games", icon: <Activity className="w-5 h-5" />, color: "bg-emerald-500" },
    { day: "T", type: "HOME WORKOUT", title: "Hatha Yoga + Step count challenge", icon: <Zap className="w-5 h-5" />, color: "bg-sky-500" },
    { day: "F", type: "AT-CENTER WORKOUT", title: "Strength Circuit + Core & Stability workout", icon: <Dumbbell className="w-5 h-5" />, color: "bg-emerald-500" },
    { day: "S", type: "WEEKLY MASTERCLASS", title: "Mobility | Movements | Nutrition | Dance + more", icon: <GraduationCap className="w-5 h-5" />, color: "bg-rose-500" },
    { day: "S", type: "ACTIVE RECOVERY", title: "Walk and Relax", icon: <Heart className="w-5 h-5" />, color: "bg-orange-500" },
  ];

  return (
    <section className="py-12 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-20">
        <div className="md:w-1/2 pt-10 md:sticky md:top-32 self-start">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight mb-12">
              Snapshot of your<br />week
            </h2>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 text-white/60 font-bold text-lg uppercase tracking-tight">
                <Check className="w-5 h-5 text-[#FF7200]" />
                Weekly Catchups with the nutritionist
              </li>
              <li className="flex items-center gap-4 text-white/60 font-bold text-lg uppercase tracking-tight">
                <Check className="w-5 h-5 text-[#FF7200]" />
                On demand 1:1 calls as per your chosen slot
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="md:w-1/2 w-full h-full">
           <div className="bg-[#1c1c1c] rounded-[40px] border border-white/10 shadow-2xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {schedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center p-6 md:p-8 hover:bg-white/[0.02] transition-all group"
                  >
                    <div className="w-12 text-white/20 font-black text-xl mr-8 group-hover:text-white transition-colors">{item.day}</div>
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                          <span className="text-white/40 font-black text-[10px] tracking-widest uppercase">{item.type}</span>
                       </div>
                       <h3 className="text-white font-bold text-base md:text-lg tracking-tight uppercase leading-none">{item.title}</h3>
                    </div>
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:text-white group-hover:bg-white/10 transition-all border border-white/5">
                       {item.icon}
                    </div>
                  </motion.div>
                ))}
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
    { 
      q: "How is Iron Pulse Bootcamp different from FitXpass Elite?", 
      a: "While FitXpass Elite offers general access to centers and classes, Bootcamp is a goal-oriented, 6-week intensive transformation program. It includes small-batch personalized training, 1:1 nutrition coaching, and dedicated lifestyle support which are not part of standard memberships." 
    },
    { 
      q: "What happens if I miss some class(es) because of travel or other commitments?", 
      a: "We understand life happens. You can access the recorded versions of your home workouts, and your lifestyle coach will help you stay on track with your nutrition and daily goals until you return." 
    },
    { 
      q: "Can I cancel / refund my Bootcamp memberships?", 
      a: "Bootcamp memberships are goal-driven and batch-based. Refunds are generally not provided once a batch begins, but we do offer one-time batch transfers under exceptional circumstances." 
    },
    { 
      q: "Can I be a part of bootcamp if I have any medical issues?", 
      a: "We recommend consulting your doctor first. Our trainers can provide modifications for many exercises, but specific medical conditions may require a more tailored approach than a group bootcamp." 
    },
    { 
      q: "How do I ensure maximum results?", 
      a: "Consistency is key. By attending your center workouts, following your personalized meal plan, and staying in regular touch with your lifestyle coach, you'll be on the fastest path to results." 
    },
    { 
      q: "What happens if the Bootcamp dates are modified/cancelled?", 
      a: "In the rare event of a date modification or cancellation by Iron Pulse, participants will be offered a full refund or a guaranteed slot in the next available batch of their choice." 
    }
  ];

  return (
    <section id="faq" className="py-16 border-t border-white/5 scroll-mt-32">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-20 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">FAQ</h2>
            <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">IRON PULSE BOOTCAMP</p>
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
                  <div className="w-1 h-1 rounded-full bg-orange-500" />
                  <span className="text-white font-bold text-sm md:text-base group-hover:text-orange-500 transition-all">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-white/20 transition-transform duration-500 ${openIndex === i ? 'rotate-180 text-orange-500' : ''}`} />
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

export default function Bootcamp() {
  const { isLoggedIn, setIsLoginModalOpen, userProfileData } = useUI();
  const [submitting, setSubmitting] = useState(false);
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);

  useEffect(() => {
    api.getPageHeroes()
      .then(heroes => {
        const bootcampHero = heroes.find(h => h.pageKey === 'bootcamp');
        if (bootcampHero) setHeroData(bootcampHero);
      })
      .catch(err => console.error("Error loading bootcamp hero", err));
  }, []);

  const handleApply = async () => {
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
        plan: '6-WEEK BOOTCAMP',
        message: 'User clicked SECURE YOUR SLOT for 6-Week Bootcamp.'
      });
      alert('🎯 SUCCESS! Your Bootcamp application is registered.');
    } catch (err) {
      console.error("Application fail:", err);
      alert('Failed to submit application. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen pt-16 selection:bg-orange-500/30 premium-bg">
      <CanvasScrollBg />
      <FitnessSubNav />


      <div className="flex flex-col">
        <Hero data={heroData} />
        <TimerOffer />
        <ScrollReveal type="slide-up"><HowItWorks /></ScrollReveal>
        <ScrollReveal type="slide-up"><AdditionalFeatures /></ScrollReveal>
        <ScrollReveal type="slide-up"><WeeklySnapshot /></ScrollReveal>
        
        {/* Final CTA Section */}
        <section className="py-40 px-6 md:px-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-4xl md:text-6xl font-black text-white uppercase mb-12 tracking-tighter italic">Ready for the challenge?</h2>
             <p className="text-white/40 text-xl md:text-2xl font-bold leading-relaxed mb-16 uppercase">
                Join the next batch of Iron Pulse Bootcamp. Limited slots available for maximum focus and results.
             </p>
             <button 
                onClick={handleApply}
                disabled={submitting}
                className="bg-white text-black font-black px-16 py-6 rounded-2xl tracking-[0.4em] uppercase text-xs hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,107,0,0.1)] disabled:opacity-50"
             >
                {submitting ? 'SUBMITTING...' : 'SECURE YOUR SLOT'}
             </button>
          </div>
        </section>

        <ScrollReveal type="slide-up"><FAQSection /></ScrollReveal>
      </div>
    </div>
  );
}
