import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Check, Info, Calendar, MessageSquare, Phone, Clock, ChevronRight, Trophy, Crown, Dumbbell, Gift, ShieldCheck } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { TimerOffer } from '../components/TimerOffer';
import { useUI } from '../context/UIContext';
import BackgroundGlows from '../components/BackgroundGlows';
import { api, Membership, PageHeroData } from '../lib/api';

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
        ctx.fillStyle = `rgba(0, 229, 255, ${0.2 + scrollValue * 0.3})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.1 * (1 - dist / 200) * (1 + scrollValue)})`;
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,229,255,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(0,229,255,0.08),transparent_50%)]" />
    </div>
  );
};

const Hero = ({ data }: { data: PageHeroData | null }) => {
  const imageSrc = data?.image || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1600";
  const title = data?.title || "Join the FitX Elite";
  const subtitle = data?.subtitle || "YOUR KEY TO THE FITTEST YOU";
  const description = data?.description || "Choose the protocol that matches your ambition. Precision built for pure performance.";

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-transparent">
      <div className="relative w-full min-h-[420px] md:min-h-0 md:aspect-[25/9] h-auto flex flex-col justify-end">
        <div className="absolute inset-0">
          <img
            src={imageSrc}
            className="w-full h-full object-cover object-center opacity-60"
            alt="Membership Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 pb-12 px-6 md:pb-20 md:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="text-[#00E5FF] font-black text-xs md:text-sm tracking-[0.3em] uppercase mb-2 block animate-pulse">
              {subtitle}
            </span>
            <h1 className="font-black text-4xl md:text-8xl tracking-tighter mb-4 leading-none uppercase text-white whitespace-pre-line">
              {title}
            </h1>
            <p className="text-white/70 font-bold text-sm md:text-xl tracking-tight uppercase max-w-xl whitespace-pre-line">
              {description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FALLBACK_PACKAGES: Membership[] = [
  {
    id: 'starter',
    name: "Starter",
    price: "$49",
    period: "per 6 months",
    desc: "Essential access for those starting their fitness journey.",
    iconName: "Dumbbell",
    color: "from-[#00E5FF]/20 to-transparent",
    features: [
      "Access to Gym Floor",
      "Standard Locker Access",
      "2 Group Classes / Month",
      "Initial Fitness Assessment",
      "Mobile App Tracking"
    ],
    facilities: [
      "Cardio Loft",
      "Free Weights Area",
      "Showers & Saunas",
      "Parking"
    ]
  },
  {
    id: 'pro',
    name: "Pro",
    price: "$89",
    period: "per 6 months",
    desc: "Our most popular plan for dedicated athletes.",
    iconName: "Trophy",
    color: "from-[#00E5FF]/20 to-transparent",
    popular: true,
    features: [
      "Unlimited Gym Access",
      "Unlimited Group Classes",
      "1 Personal Training / Month",
      "Nutrition Consultation",
      "Priority Booking",
      "Pulse Heart-Rate Monitor"
    ],
    facilities: [
      "All Starter Facilities",
      "Premium Strength Zone",
      "Recovery Lounge Access",
      "Smart Lockers",
      "Juice Bar Discounts"
    ]
  },
  {
    id: 'elite',
    name: "Elite",
    price: "$149",
    period: "per 6 months",
    desc: "The ultimate fitness experience with zero compromises.",
    iconName: "Crown",
    color: "from-[#00E5FF]/20 to-transparent",
    features: [
      "24/7 VIP Access",
      "Unlimited 1-on-1 Coaching",
      "Custom Macro Planning",
      "Physiotherapy Sessions",
      "Guest Passes (2/Month)",
      "Exclusive Elite Events"
    ],
    facilities: [
      "All Pro Facilities",
      "Private Training Studio",
      "Cryotherapy Chamber",
      "VIP Lounge & Workspaces",
      "Complimentary Laundry"
    ]
  }
];

const renderMembershipIcon = (iconName: string) => {
  const props = { className: "w-8 h-8 text-[#00E5FF]" };
  switch (iconName) {
    case 'Dumbbell': return <Dumbbell {...props} className="w-8 h-8 text-[#00E5FF]" />;
    case 'Trophy': return <Trophy {...props} />;
    case 'Crown': return <Crown {...props} className="w-8 h-8 text-[#00E5FF]" />;
    default: return <Trophy {...props} />;
  }
};

export default function Memberships() {
  const { isLoggedIn, setIsLoginModalOpen } = useUI();
  const [packages, setPackages] = useState<Membership[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);

  useEffect(() => {
    api.getPageHeroes()
      .then(heroes => {
        const fitHero = heroes.find(h => h.pageKey === 'memberships');
        if (fitHero) setHeroData(fitHero);
      })
      .catch(err => console.error("Error loading memberships page hero", err));
  }, []);

  const content = heroData?.contentBlocks || {};

  // Form state for Contact Inquiry
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'MEMBERSHIP INQUIRY',
    plan: 'PRO',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const adminPlans = await api.getMemberships();

                if (adminPlans && adminPlans.length > 0) {
          setPackages(adminPlans);
          setSelectedPackage(adminPlans.length > 1 ? adminPlans[1] : adminPlans[0]);
        } else {
          setPackages(FALLBACK_PACKAGES);
          setSelectedPackage(FALLBACK_PACKAGES[1]);
        }
      } catch (err) {
        console.error("Using fallback packages due to error:", err);
        setPackages(FALLBACK_PACKAGES);
        setSelectedPackage(FALLBACK_PACKAGES[1]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAction = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      alert('Action initiated!');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill in your name and email!');
      return;
    }
    setSubmitting(true);
    try {
      await api.createContact({
        name: formData.name,
        email: formData.email,
        type: formData.type,
        plan: formData.plan,
        message: formData.message || `Inquiring about ${formData.plan} tier.`
      });
      alert('🎯 SUCCESS! Request transmitted successfully.');
      setFormData({ name: '', email: '', type: 'MEMBERSHIP INQUIRY', plan: 'PRO', message: '' });
    } catch (err) {
      alert('Could not transmit request. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen pt-16 selection:bg-[#FF7200]/30 premium-bg">
      <CanvasScrollBg />
      <BackgroundGlows />

      <div className="flex flex-col">
        {/* Hero Section Replace Top Text */}
        <Hero />

        <ScrollReveal type="slide-up">
          <TimerOffer />
        </ScrollReveal>

        {/* Packages Selection - Re-designed Cards */}
        <section className="px-6 md:px-24 mt-24 mb-16">
          <div className="text-center mb-12">
            <p className="text-[#00E5FF] font-black tracking-[0.3em] uppercase text-[10px] mb-4">{content.tiers_subtitle || 'SELECT PROTOCOL'}</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">{content.tiers_title || 'Membership Tiers'}</h2>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <ScrollReveal key={pkg.id} type="scale">
                <motion.div
                  onClick={() => setSelectedPackage(pkg)}
                  whileHover={{ y: -8 }}
                  className={`membership-card relative p-8 rounded-[32px] border-2 cursor-pointer transition-all duration-500 overflow-hidden h-full flex flex-col ${selectedPackage?.id === pkg.id
                    ? 'active scale-[1.02]'
                    : ''
                    }`}
                >
                  {pkg.popular && (
                    <div className="absolute top-6 right-6 bg-[#00E5FF] text-[#0A0F24] px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase shadow-lg">
                      POPULAR
                    </div>
                  )}

                  <div className="mb-8 w-14 h-14 rounded-2xl bg-[#1F2328] border border-white/10 flex items-center justify-center">
                    {renderMembershipIcon(pkg.iconName)}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-2xl font-black mb-2 tracking-tight uppercase force-text-white">{pkg.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black force-text-white">{pkg.price}</span>
                      <span className="force-text-white-muted opacity-60 font-black uppercase text-[10px] tracking-widest">{pkg.period}</span>
                    </div>
                  </div>

                  <p className="force-text-white-muted font-medium leading-relaxed mb-8 text-sm">
                    {pkg.desc}
                  </p>

                  <div className="mt-auto pt-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAction(); }}
                      className={`w-full py-4 rounded-xl font-black text-xs tracking-[0.2em] uppercase transition-all border ${selectedPackage?.id === pkg.id
                        ? 'bg-[#00E5FF] border-[#00E5FF] text-[#0A0F24] hover:bg-white hover:text-black hover:border-white'
                        : 'bg-transparent border-white/20 text-white hover:border-white'
                        }`}
                    >
                      SELECT PLAN
                    </button>
                  </div>

                  <div className={`absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br ${pkg.color} blur-3xl opacity-40 -z-10`} />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Deep Details (Selected Package) */}
        <section className="px-6 md:px-24 mb-32">
          <ScrollReveal type="slide-up">
            <AnimatePresence mode="wait">
              {selectedPackage && (
                <motion.div
                  key={selectedPackage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-6xl mx-auto bg-[#16191d] rounded-[40px] border border-white/5 p-8 md:p-20 overflow-hidden relative"
                >
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
                    <div className="space-y-12">
                      <div>
                        <h4 className="text-[#00E5FF] font-black text-[11px] tracking-[0.4em] uppercase mb-8 flex items-center gap-3">
                          <Info className="w-4 h-4" />
                          Core Features
                        </h4>
                        <div className="grid grid-cols-1 gap-6">
                          {selectedPackage.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-5 group">
                              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#00E5FF] group-hover:text-[#0A0F24] transition-all">
                                <Check className="w-3 h-3" />
                              </div>
                              <span className="text-white/80 font-bold text-lg tracking-tight group-hover:text-white transition-colors">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-12">
                      <div>
                        <h4 className="text-[#00E5FF] font-black text-[11px] tracking-[0.4em] uppercase mb-8 flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4" />
                          Club Facilities
                        </h4>
                        <div className="grid grid-cols-1 gap-6">
                          {selectedPackage.facilities.map((facility, idx) => (
                            <div key={idx} className="flex items-center gap-5 group">
                              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#00E5FF] transition-all">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                              </div>
                              <span className="text-white/80 font-bold text-lg tracking-tight group-hover:text-white transition-colors">{facility}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00E5FF]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollReveal>
        </section>

        {/* Booking & Inquiry Form */}
        <section className="px-6 md:px-24 pb-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Form Section - Spanning 8/12 cols for prominence */}
            <div className="lg:col-span-8 flex">
              <ScrollReveal type="slide-up" className="w-full flex">
                <div className="booking-card bg-[#16191d] rounded-[32px] border border-white/10 p-8 md:p-16 text-white w-full flex flex-col h-full">
                  <h2 className="font-black text-3xl md:text-5xl tracking-tighter mb-3 uppercase text-white">{content.contact_title || 'Secure Your Spot'}</h2>
                  <p className="text-white/50 font-medium text-base md:text-lg uppercase mb-12 tracking-tight">{content.contact_subtitle || 'Book your free trial session or message our elite consulting team.'}</p>

                  <form className="space-y-5 mt-auto" onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="YOUR FULL NAME"
                        className="dark-input w-full bg-[#121417] border border-white/10 rounded-xl p-5 font-bold text-xs tracking-widest text-white placeholder:text-white/20 focus:border-[#00E5FF] transition-all outline-none"
                      />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="EMAIL ADDRESS"
                        className="dark-input w-full bg-[#121417] border border-white/10 rounded-xl p-5 font-bold text-xs tracking-widest text-white placeholder:text-white/20 focus:border-[#00E5FF] transition-all outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="dark-input w-full bg-[#121417] border border-white/10 rounded-xl p-5 font-bold text-xs tracking-widest text-white appearance-none focus:border-[#00E5FF] transition-all outline-none cursor-pointer"
                      >
                        <option className="bg-[#1a1d21]" value="FREE TRIAL BOOKING">FREE TRIAL BOOKING</option>
                        <option className="bg-[#1a1d21]" value="MEMBERSHIP INQUIRY">MEMBERSHIP INQUIRY</option>
                        <option className="bg-[#1a1d21]" value="PERSONAL TRAINING APPOINTMENT">PERSONAL TRAINING APPOINTMENT</option>
                      </select>
                      <select
                        value={formData.plan}
                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                        className="dark-input w-full bg-[#121417] border border-white/10 rounded-xl p-5 font-bold text-xs tracking-widest text-white appearance-none focus:border-[#00E5FF] transition-all outline-none cursor-pointer"
                      >
                        <option className="bg-[#1a1d21]" value="STARTER">STARTER</option>
                        <option className="bg-[#1a1d21]" value="PRO">PRO</option>
                        <option className="bg-[#1a1d21]" value="ELITE">ELITE</option>
                      </select>
                    </div>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="HOW CAN WE HELP YOU HIT YOUR GOALS?"
                      rows={4}
                      className="dark-input w-full bg-[#121417] border border-white/10 rounded-xl p-5 font-bold text-xs tracking-widest text-white placeholder:text-white/20 focus:border-[#00E5FF] transition-all outline-none resize-none"
                    />

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-white text-black py-5 rounded-xl font-black text-[11px] tracking-[0.3em] uppercase hover:bg-[#00E5FF] hover:text-[#0A0F24] disabled:opacity-50 transition-all mt-4 shadow-xl"
                    >
                      {submitting ? 'TRANSMITTING...' : 'TRANSMIT REQUEST'}
                    </button>
                  </form>
                </div>
              </ScrollReveal>
            </div>

            {/* Info Section - Spanning 4/12 cols */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {[
                {
                  icon: <Calendar className="w-6 h-6 text-[#00E5FF]" />,
                  title: "Instant Booking",
                  desc: "Get your slot confirmed in real time."
                },
                {
                  icon: <MessageSquare className="w-6 h-6 text-[#00E5FF]" />,
                  title: "Expert Inquiry",
                  desc: "Speak directly to senior instructors."
                },
                {
                  icon: <ShieldCheck className="w-6 h-6 text-[#00E5FF]" />,
                  title: "Pulse Guarantee",
                  desc: "Total coverage. Zero hassle."
                }
              ].map((item, i) => (
                <ScrollReveal key={i} type="scale" className="flex-1 flex">
                  <div
                    onClick={handleAction}
                    className="info-card bg-[#16191d] p-8 rounded-[24px] border border-white/10 flex items-center gap-6 group cursor-pointer hover:border-[#00E5FF]/50 hover:bg-[#1F2328] transition-all w-full h-full"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#121417] border border-white/5 flex items-center justify-center flex-shrink-0 transition-all group-hover:border-[#00E5FF]">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-lg mb-1 uppercase text-white tracking-tight">{item.title}</h3>
                      <p className="text-white/40 font-bold text-[10px] tracking-wider uppercase leading-tight">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-[#00E5FF] group-hover:translate-x-1 transition-all" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
