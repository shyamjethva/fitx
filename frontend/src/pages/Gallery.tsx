import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Instagram, Play, Maximize2, ExternalLink, Camera, Box, Film, X } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { TimerOffer } from '../components/TimerOffer';
import BackgroundGlows from '../components/BackgroundGlows';
import FitnessSubNav from '../components/FitnessSubNav';
import { api, GalleryItem } from '../lib/api';

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

const Hero = () => {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-transparent">
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[25/9]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1600"
            className="w-full h-full object-cover object-center opacity-70"
            alt="Gallery Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-6 md:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="font-black text-5xl md:text-8xl tracking-tighter mb-4 leading-none uppercase text-white" style={{ color: '#ffffff' }}>
              Visual <br /> Fit<span className="text-[#FF7200]">X</span>
            </h1>
            <p className="text-white/70 font-bold text-lg md:text-xl tracking-tight uppercase max-w-2xl" style={{ color: 'rgba(255,255,255,0.7)' }}>
              High-performance aesthetics captured at our worldwide centers.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const categories = [
  { id: 'all', name: 'ALL PULSE', icon: <Camera className="w-3.5 h-3.5" /> },
  { id: 'gym', name: 'GYM PHOTOS', icon: <Camera className="w-3.5 h-3.5" /> },
  { id: '3d', name: '3D EQUIPMENT', icon: <Box className="w-3.5 h-3.5" /> },
  { id: 'reels', name: 'VIDEO REELS', icon: <Film className="w-3.5 h-3.5" /> }
];

const FALLBACK_GALLERY: GalleryItem[] = [
  // GYM IMAGES
  { id: "1", type: 'gym', title: "Elite Platform", img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200" },
  { id: "20", type: 'gym', title: "Momentum Grid", img: "/gym2.jpeg" },
  { id: "21", type: 'gym', title: "Iron Corner", img: "/gym3.jpeg" },
  
  // VIDEOS
  { id: "5", type: 'reels', title: "Pulse Rush", img: "/vid2.mp4", isVideo: true },
  { id: "6", type: 'reels', title: "Functional Drive", img: "/vid3.mp4", isVideo: true },
  { id: "7", type: 'reels', title: "Peak Perform", img: "/vid4.mp4", isVideo: true },

  // 3D EQUIPMENT
  { id: "8", type: '3d', title: "Chest Press XR", img: "/3d1.png" },
  { id: "9", type: '3d', title: "Leg Press Core", img: "/3d2.png" },
  { id: "10", type: '3d', title: "Cable Multi Station", img: "/3d3.png" },
  { id: "11", type: '3d', title: "Smith Machine Pro", img: "/3d4.png" },
  { id: "12", type: '3d', title: "Dumbbell Set X", img: "/3d5.png" },
  { id: "13", type: '3d', title: "Squat Rack Elite", img: "/3d6.png" },
  { id: "14", type: '3d', title: "Bench Press Pro", img: "/3d7.png" },
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.getGallery(FALLBACK_GALLERY);
        setGalleryItems(data);
      } catch (e) {
        setGalleryItems(FALLBACK_GALLERY);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredItems = activeTab === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.type === activeTab);

  const isMasonry = activeTab === 'all';
  const layoutClass = isMasonry
    ? "max-w-screen-2xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6"
    : "max-w-screen-2xl mx-auto flex flex-wrap justify-center gap-8";

  return (
    <div className="flex flex-col w-full premium-bg min-h-screen pb-20 overflow-x-hidden text-white font-sans relative">
      <CanvasScrollBg />
      <BackgroundGlows />
      
      {/* Sub Nav injected at top (below main nav height via padding or explicit placement) */}
      <div className="pt-16">
        <FitnessSubNav />
      </div>

      {/* New Hero Header */}
      <Hero />

      <ScrollReveal type="slide-up">
         <TimerOffer />
      </ScrollReveal>

      {/* Categorization Bar */}
      <section className="mt-24 mb-12 px-6 flex justify-center">
         <ScrollReveal type="slide-up">
            <div className="category-bar flex flex-wrap justify-center gap-3 bg-transparent border border-white/10 p-2 rounded-full backdrop-blur-md">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-[10px] font-black tracking-widest uppercase transition-all border ${
                    activeTab === cat.id 
                      ? 'active bg-[#FF7200] text-white border-[#FF7200] shadow-[0_5px_15px_rgba(255,114,0,0.3)]' 
                      : 'bg-transparent text-white/50 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
         </ScrollReveal>
      </section>

      {/* Gallery Grid - Smart layout switching */}
      <section className="px-6 md:px-24 mb-32">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-[#FF7200] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            layout
            className={layoutClass}
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onClick={() => setSelectedItem(item)}
                  className={`relative break-inside-avoid rounded-[24px] overflow-hidden group cursor-pointer border-2 border-transparent hover:border-[#FF7200]/40 shadow-xl transition-all duration-500 ${!isMasonry ? 'w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]' : 'w-full'} ${item.isVideo ? 'aspect-[9/16]' : 'aspect-[4/3]'} ${item.type === '3d' ? 'bg-gradient-to-b from-[#1a1c20] to-[#0d0e11]' : 'bg-black'} ${isMasonry ? 'mb-6' : ''}`}
                >
                  {item.isVideo ? (
                    <video
                      src={item.img}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <img
                      src={item.img}
                      className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${item.type === '3d' ? 'object-contain p-8' : 'object-cover'}`}
                      alt={item.title}
                    />
                  )}

                  {/* Video Overlay for Visual Hierarchy */}
                  {item.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl group-hover:scale-110 group-hover:bg-[#FF7200] group-hover:border-[#FF7200] transition-all duration-500">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <div className="flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="space-y-1">
                        <span className="text-[#FF7200] text-[9px] font-black tracking-[0.3em] uppercase">
                          {item.isVideo ? 'DYNAMIC REEL' : item.type === '3d' ? 'SYSTEM OVERVIEW' : 'CENTER CAPTURE'}
                        </span>
                        <h3 className="text-xl font-black uppercase tracking-tight force-text-white">{item.title}</h3>
                      </div>
                      <div 
                        onClick={() => setSelectedItem(item)}
                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-500 shadow-lg hover:bg-[#FF7200] hover:text-white cursor-pointer"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Social CTA Section */}
      <section className="px-6 md:px-24 pb-20">
        <ScrollReveal type="scale">
          <div className="booking-card max-w-4xl mx-auto rounded-[32px] bg-[#16191d] p-10 flex flex-col items-center text-center text-white relative overflow-hidden border border-white/10 shadow-2xl">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#1F2328] border border-white/10 flex items-center justify-center mb-6">
                <Instagram className="w-7 h-7 text-[#FF7200]" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 leading-none">Join the <br /> Visual Pulse</h2>
              <p className="text-white/50 font-medium text-base tracking-tight uppercase mb-10 max-w-md">Tag your achievements and get featured in the international grid.</p>
              
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-[#00E5FF] text-[#0A0F24] px-8 py-4 rounded-xl font-black text-[10px] tracking-[0.3em] uppercase flex items-center gap-3 hover:bg-[#33EBFF] transition-all shadow-[0_10px_30px_rgba(0,229,255,0.2)] hover:scale-105" style={{ color: '#0A0F24' }}>
                <span>LAUNCH INSTAGRAM</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7200]/10 rounded-full blur-[100px] -translate-y-32 translate-x-32 pointer-events-none" />
          </div>
        </ScrollReveal>
      </section>

      {/* Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center rounded-3xl overflow-hidden bg-neutral-950 border border-white/10 shadow-2xl cursor-default"
            >
              {selectedItem.isVideo ? (
                <video
                  src={selectedItem.img}
                  autoPlay
                  controls
                  loop
                  className="max-h-[80vh] w-auto object-contain shadow-2xl"
                />
              ) : (
                <img
                  src={selectedItem.img}
                  alt={selectedItem.title}
                  className={`max-h-[80vh] w-auto object-contain shadow-2xl ${selectedItem.type === '3d' ? 'p-8 bg-gradient-to-b from-[#1a1c20] to-[#0d0e11]' : ''}`}
                />
              )}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 text-center select-none cursor-default"
            >
              <h3 className="text-2xl font-black uppercase tracking-tighter force-text-white mb-1">{selectedItem.title}</h3>
              <p className="text-xs font-black tracking-widest uppercase text-[#FF7200]">
                {selectedItem.isVideo ? 'FULLSPEED REEL' : 'HIGH-FIDELITY CAPTURE'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
