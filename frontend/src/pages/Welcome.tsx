import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Flame, Target, Trophy } from 'lucide-react';

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
        ctx.fillStyle = `rgba(255, 114, 0, ${0.2 + scrollValue * 0.3})`; 
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 139, 16, ${0.1 * (1 - dist / 200) * (1 + scrollValue)})`; 
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,114,0,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,139,16,0.1),transparent_50%)]" />
    </div>
  );
};

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full relative bg-black overflow-hidden flex items-center justify-center selection:bg-[#FF7200]/30">
      <CanvasScrollBg />
      
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#FF7200]/20 blur-[120px] rounded-full opacity-60 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FF8B10]/10 blur-[150px] rounded-full opacity-40" />

      <div className="relative z-10 max-w-4xl px-6 w-full text-center py-20">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex justify-center mb-10"
        >
          <div className="w-24 h-24 bg-[#FF7200] rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,114,0,0.4)] relative">
             <CheckCircle2 className="w-12 h-12 text-black" strokeWidth={3} />
             <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute inset-0 border-2 border-[#FF7200] rounded-full"
             />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6">
            WELCOME TO THE<br />
            <span className="text-[#FF7200] italic">EVOLUTION</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-medium uppercase tracking-widest mb-16">
            Your profile has been activated successfully. <br/>The future of fitness begins now.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: <Flame />, title: "SET GOALS", desc: "Track your progress" },
            { icon: <Target />, title: "FIND CLASSES", desc: "Book your slots" },
            { icon: <Trophy />, title: "ACHIEVE", desc: "Unlock rewards" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + (idx * 0.15), duration: 0.5 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:border-[#FF7200]/40 hover:bg-white/10 transition-all group"
            >
              <div className="text-[#FF7200] w-10 h-10 mx-auto mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-white font-black text-lg tracking-tighter uppercase mb-2">{item.title}</h3>
              <p className="text-white/40 text-xs font-bold tracking-wider uppercase">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-black font-black px-12 py-5 rounded-full text-base tracking-widest uppercase flex items-center gap-3 mx-auto hover:bg-[#FF7200] hover:text-black transition-all shadow-[0_15px_40px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_40px_rgba(255,114,0,0.4)] active:scale-95 group"
          >
            GO TO DASHBOARD
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
