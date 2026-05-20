import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import FitnessSubNav from '../components/FitnessSubNav';
import ScrollReveal from '../components/ScrollReveal';
import { useUI } from '../context/UIContext';
import { TimerOffer } from '../components/TimerOffer';

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
      ctx.save();
      ctx.translate(dimensions.width / 2, dimensions.height / 2);
      ctx.rotate(scrollValue * Math.PI * 2);
      ctx.scale(1 + scrollValue * 0.5, 1 + scrollValue * 0.5);
      ctx.translate(-dimensions.width / 2, -dimensions.height / 2);

      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > dimensions.width) p.vx *= -1;
        if (p.y < 0 || p.y > dimensions.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${0.2 + scrollValue * 0.3})`;
        ctx.fill();
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
    </div>
  );
};

const FitnessCategoryPage = ({ title, subtitle, img }: { title: string, subtitle: string, img: string }) => {
  const { setIsFreeTrialModalOpen } = useUI();
  return (
    <div className="relative w-full min-h-screen pt-16 selection:bg-primary/30 premium-bg">
      <CanvasScrollBg />
      <FitnessSubNav />
      
      <div className="flex flex-col">
        <section className="relative w-full aspect-[21/9] md:aspect-[25/9] overflow-hidden">
          <img src={img} className="w-full h-full object-cover grayscale opacity-60" alt={title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end pb-20 px-6 md:px-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-9xl font-black force-text-white mb-6 tracking-tighter uppercase italic leading-none">
                {title.split(' ')[0]}<span className="text-[#FF7200]">{title.split(' ')[1] ? ` ${title.split(' ')[1]}` : ''}</span>
              </h1>
              <p className="force-text-white-muted font-black text-xl md:text-3xl tracking-tight uppercase max-w-2xl">
                {subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        <ScrollReveal type="slide-up">
           <TimerOffer />
        </ScrollReveal>

        <section className="py-40 px-6 md:px-20">
          <div className="max-w-4xl mx-auto">
             <h2 className="text-4xl md:text-6xl font-black text-white uppercase mb-12 tracking-tighter italic">Experience {title}</h2>
             <p className="text-white/40 text-xl md:text-2xl font-bold leading-relaxed mb-16 uppercase">
                Premium training environment engineered for results. World-class equipment, elite trainers, and an unmatched fitness community.
             </p>
             <button 
                onClick={() => setIsFreeTrialModalOpen(true)}
                className="bg-white text-black font-black px-16 py-6 rounded-2xl tracking-[0.4em] uppercase text-xs hover:scale-105 transition-all"
             >
                BOOK FREE TRIAL
             </button>
          </div>
        </section>
      </div>
    </div>
  );
};


export const TransformPlus = () => (
  <FitnessCategoryPage 
    title="TRANSFORM PLUS" 
    subtitle="Advanced medical & lifestyle care for total body optimization." 
    img="https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&q=80&w=2400" 
  />
);

export const LuxuryGyms = () => (
  <FitnessCategoryPage 
    title="LUXURY GYMS" 
    subtitle="The pinnacle of fitness. Unparalleled luxury and exclusivity." 
    img="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=2400" 
  />
);
