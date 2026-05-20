import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, Clock, ChevronRight, Search, Tag, X } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { TimerOffer } from '../components/TimerOffer';
import { useUI } from '../context/UIContext';
import { api, Blog } from '../lib/api';
import BackgroundGlows from '../components/BackgroundGlows';

const categories = ["All", "Nutrition", "Training", "Lifestyle", "Recovery", "Mindset"];

const FALLBACK_BLOGS: Blog[] = [
  {
    id: "1",
    title: "The Ultimate Guide to Hypertrophy: Science-Backed Growth",
    excerpt: "Learn the specific rep ranges, volume, and recovery strategies needed to maximize muscle protein synthesis.",
    category: "Training",
    author: "Dr. Alex Rivier",
    date: "May 09, 2026",
    readTime: "8 min read",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    featured: true,
    content: "Hypertrophy, the physiological increase in muscle size, remains one of the primary objectives of resistance training. To truly understand muscle growth, one must look at the science-backed pillars of mechanical tension, metabolic stress, and muscle damage.\n\nMechanical tension is arguably the most potent driver of hypertrophy. When you lift heavy weights through a full range of motion, muscle fibers experience tension that triggers internal biochemical cascades. This stimulates muscle protein synthesis (MPS) for up to 48 hours post-workout.\n\nTo optimize mechanical tension, rep ranges between 6 to 12 reps at 70-85% of your 1-Rep Max are ideal. Furthermore, progressive overload—gradually increasing the weight, reps, or volume over time—is mandatory to keep forcing muscular adaptations.\n\nSecondary to tension is metabolic stress. This is characterized by the 'pump'—the buildup of metabolites like lactate and hydrogen ions during high-rep, short-rest training formats. This swelling triggers cellular signals that stimulate muscle expansion.\n\nLastly, ensure your nutritional recovery is locked in. Consuming 1.6 to 2.2 grams of high-quality protein per kilogram of bodyweight alongside a slight caloric surplus provides the building blocks to repair and grow the micro-tears created during intense performance training."
  },
  {
    id: "2",
    title: "Macronutrient Timing: Does It Really Matter?",
    excerpt: "Debunking the myths around the anabolic window and exploring optimal timing for carbs and protein.",
    category: "Nutrition",
    author: "Sarah Chen",
    date: "May 08, 2026",
    readTime: "6 min read",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
    content: "For decades, the 'anabolic window'—the mythical 30-minute post-workout period where protein must be consumed—has been gospel in fitness communities. But does science actually support this strict timeframe, or is macronutrient timing far more flexible?\n\nModern research demonstrates that the body is highly receptive to nutrient uptake for several hours post-exercise. Instead of rushing to consume a shake immediately, focus on your total daily protein intake and consistent dosing throughout the day.\n\nIdeally, you should aim to distribute your protein intake across 4 to 5 meals spaced 3 to 4 hours apart. Each meal should contain at least 0.4 grams of protein per kilogram of bodyweight to trigger the muscle protein synthesis threshold.\n\nCarbohydrate timing, however, is highly dependent on training frequency. If you are training twice a day, rapid glycogen replenishment via high-glycemic carbs post-workout is crucial. For once-daily lifters, simply hitting your carb targets by the end of the day is sufficient to restore depleted energy stores.\n\nIn summary: while extreme timing rules are largely exaggerated, sensible distribution of nutrients around your training session will maximize energy levels, fuel optimal recovery, and drive physical evolution."
  },
  {
    id: "3",
    title: "Mastering the Mindset: The Psychology of Consistency",
    excerpt: "How to build unbreakable habits and stay motivated when the initial excitement fades away.",
    category: "Mindset",
    author: "Marcus Thorne",
    date: "May 07, 2026",
    readTime: "5 min read",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    content: "Physical transformation is often viewed as a purely physiological challenge. However, the root of all long-term physical success is cognitive. Without mastering the psychology of consistency, even the most perfect diet or training regimen will ultimately fail.\n\nMotivation is a fleeting chemical state. It spikes after watching an inspiring video or buying new gear, but vanishes when alarm clocks ring at 5:00 AM on a freezing winter morning. To build unbreakable habits, you must shift your focus from motivation to systems.\n\nStart by designing friction-free routines. Pack your training gear the night before, schedule workouts as non-negotiable professional calendar entries, and select a gym that is directly on your daily commute path.\n\nFurthermore, decouple your identity from temporary outcomes. Instead of measuring only weight scales, celebrate structural habit completions—like hitting 4 workouts in a row or completing weekly macro prep sessions.\n\nOver time, these micro-completions rewire your brain. Fitness transitions from an effort-heavy task into an automated lifestyle identity. You are no longer someone 'trying to get fit'; you are an athlete who simply executes daily routines."
  }
];

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await api.getBlogs(FALLBACK_BLOGS);
        // Map backend fallback data if missing custom paragraphs
        const withContent = data.map((b: Blog, idx: number) => ({
          ...b,
          content: b.content || FALLBACK_BLOGS[idx]?.content || FALLBACK_BLOGS[0].content
        }));
        setBlogs(withContent);
      } catch (err) {
        setBlogs(FALLBACK_BLOGS);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(b => {
    const matchesCategory = activeCategory === "All" || b.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredBlog = filteredBlogs.find(b => b.featured) || (filteredBlogs.length > 0 ? filteredBlogs[0] : null);
  const otherBlogs = filteredBlogs.filter(b => b.id !== featuredBlog?.id);

  return (
    <div className="flex flex-col w-full premium-bg min-h-screen pt-32 pb-20 overflow-x-hidden relative selection:bg-[#00E5FF]/20">
      <BackgroundGlows />
      
      {/* Centered Premium Title Header */}
      <section className="px-6 md:px-24 text-center max-w-5xl mx-auto mb-16">
        <ScrollReveal type="slide-up">
          <span className="text-[#00E5FF] font-black text-xs md:text-sm tracking-[0.4em] uppercase block mb-4">
            ATHLETIC LIFESTYLE INTEL
          </span>
          <h1 className="font-sans text-white font-black text-6xl md:text-8xl tracking-tight mb-6 leading-none uppercase">
            FitX Journal
          </h1>
          <p className="font-sans text-white/60 font-bold text-lg tracking-tight uppercase max-w-2xl mx-auto leading-relaxed">
            Expert insights on training, nutrition, and lifestyle to fuel your fitness journey.
          </p>
        </ScrollReveal>
      </section>

      {/* Spacing alignment: Center-aligned Search Bar & Filter categories */}
      <section className="px-6 md:px-24 mb-20 flex flex-col items-center gap-6 max-w-4xl mx-auto w-full">
        <ScrollReveal type="slide-up" className="w-full">
          {/* Search Input Control */}
          <div className="relative w-full group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#00E5FF] transition-colors" />
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="SEARCH ARTICLES..."
               className="w-full bg-white/5 border border-white/10 rounded-[24px] py-6 pl-16 pr-6 font-sans text-white text-xs tracking-widest uppercase focus:outline-none focus:border-[#00E5FF]/50 transition-all shadow-xl"
             />
          </div>
        </ScrollReveal>

        <ScrollReveal type="slide-up" className="w-full flex justify-center">
          {/* Categories Horizontal Tabs */}
          <div className="flex flex-wrap gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-[32px] backdrop-blur-2xl shadow-2xl justify-center items-center">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-4 rounded-[24px] font-sans text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-[#00E5FF] to-[#00B0FF] text-slate-950 font-black shadow-[0_4px_20px_rgba(0,229,255,0.35)] scale-105' 
                      : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      <TimerOffer />

      {/* Featured Post Card - Img text contrast high with absolute layering */}
      {featuredBlog && (
        <section className="px-6 md:px-24 mb-32 max-w-7xl mx-auto w-full">
          <ScrollReveal type="scale">
            <div 
              onClick={() => setSelectedBlog(featuredBlog)}
              className="blog-featured-card group relative w-full h-[600px] md:h-[700px] rounded-[60px] overflow-hidden border border-white/5 cursor-pointer shadow-2xl z-0"
            >
              <img src={featuredBlog.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt={featuredBlog.title} />
              
              {/* High Contrast Gradient Overlay for flawless text reading */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent z-10 pointer-events-none" />

              {/* Text Container with elevated z-index */}
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-24 flex flex-col justify-end items-start gap-8 z-20">
                <div className="flex items-center gap-4">
                  <span className="bg-gradient-to-r from-[#00E5FF] to-[#00B0FF] text-black px-6 py-2 rounded-full font-sans text-[10px] font-black tracking-widest uppercase shadow-lg">FEATURED DAILY</span>
                  <span className="text-[#00E5FF] font-sans text-xs font-black uppercase tracking-widest bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-[#00E5FF]/20 shadow-md">{featuredBlog.category}</span>
                </div>

                <div className="max-w-4xl space-y-6">
                  <h2 className="font-sans blog-image-title font-black text-4xl md:text-7xl leading-tight tracking-tighter group-hover:text-[#00E5FF] transition-colors">
                    {featuredBlog.title}
                  </h2>
                  <p className="font-sans blog-image-description text-lg md:text-2xl font-bold leading-snug max-w-2xl">
                    {featuredBlog.excerpt}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-white/95" />
                    </div>
                    <span className="text-white/95 font-sans font-bold text-sm uppercase">{featuredBlog.author}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-white/95" />
                    <span className="text-white/95 font-sans font-bold text-sm uppercase">{featuredBlog.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-white/95" />
                    <span className="text-white/95 font-sans font-bold text-sm uppercase">{featuredBlog.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* All Blogs Grid */}
      <section className="px-6 md:px-24 max-w-7xl mx-auto w-full">
        <ScrollReveal type="slide-up" className="mb-12">
          <h2 className="font-sans text-white font-black text-4xl md:text-5xl tracking-tight uppercase">Latest Articles</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherBlogs.map((blog) => (
            <ScrollReveal key={blog.id} type="scale">
              <motion.div
                whileHover={{ y: -10 }}
                onClick={() => setSelectedBlog(blog)}
                className="group flex flex-col h-full bg-white/5 border border-white/5 rounded-[40px] overflow-hidden hover:bg-white/[0.08] transition-all duration-500 cursor-pointer shadow-xl"
              >
                <div className="relative h-72 overflow-hidden">
                  <img src={blog.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={blog.title} />
                  <div className="absolute top-6 left-6">
                    <span className="bg-black/90 backdrop-blur-md text-white px-4 py-2 rounded-full font-sans text-[10px] font-black tracking-widest uppercase border border-[#00E5FF]/30 shadow-lg">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow gap-6">
                  <div className="space-y-4">
                    <h3 className="font-sans text-white font-black text-2xl leading-tight group-hover:text-[#00E5FF] transition-colors">
                      {blog.title}
                    </h3>
                    <p className="font-sans blog-card-description text-sm font-bold leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-white/20" />
                      <span className="text-white/20 font-sans font-bold text-[10px] uppercase tracking-widest">{blog.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#00E5FF] font-black text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>READ MORE</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-24">
          <ScrollReveal type="scale">
            <button className="bg-white/5 border border-white/10 text-white px-16 py-6 rounded-[30px] font-sans font-black text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all">
              LOAD MORE ARTICLES
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* Dynamic Full Article Reading Overlay Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="blog-reader-overlay fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-3xl flex justify-center items-start py-6 md:py-10 px-4"
            data-lenis-prevent
            data-lenis-prevent-wheel
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="blog-reader-panel relative w-full max-w-4xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl"
            >
              {/* Floating Close Button */}
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-6 right-6 z-40 bg-black/60 border border-white/10 text-white hover:text-[#00E5FF] hover:border-[#00E5FF]/30 p-3 px-5 rounded-full backdrop-blur-md transition-all font-bold uppercase tracking-widest text-[10px] flex items-center gap-2"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close Reader</span>
              </button>

              {/* Large Cover Image Header */}
              <div className="relative w-full h-[400px]">
                <img
                  src={selectedBlog.img}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                
                {/* Meta Details overlay */}
                <div className="absolute bottom-8 left-8 right-8 space-y-3">
                  <span className="bg-[#00E5FF] text-slate-950 px-4 py-1.5 rounded-full font-sans text-[10px] font-black tracking-widest uppercase">
                    {selectedBlog.category}
                  </span>
                  <h1 className="text-2xl md:text-4xl font-black text-white force-text-white uppercase tracking-tight leading-tight max-w-3xl">
                    {selectedBlog.title}
                  </h1>
                </div>
              </div>

              {/* Article Content Area */}
              <div className="blog-reader-content p-8 md:p-12 space-y-8">
                {/* Credentials Matrix */}
                <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-white/5 text-[10px] blog-reader-meta uppercase tracking-widest font-bold">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00E5FF]" />
                    <span>{selectedBlog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#00E5FF]" />
                    <span>{selectedBlog.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#00E5FF]" />
                    <span>{selectedBlog.readTime}</span>
                  </div>
                </div>

                {/* Article paragraphs with clean readability styling */}
                <div className="blog-reader-body text-base md:text-lg leading-relaxed space-y-6 normal-case font-medium">
                  {(selectedBlog.content || selectedBlog.excerpt + "\n\nThis article outlines the primary bio-metrical and physical optimization steps required to build functional mastery. Consistent progressive load updates alongside clean cellular food intake forms the base layers for peak performance indices.").split('\n\n').map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

                {/* Back Navigation Button */}
                <div className="pt-8 border-t border-white/5">
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="bg-white/5 border border-white/10 hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/10 text-white font-black text-xs tracking-widest uppercase px-8 py-4 rounded-2xl transition-all"
                  >
                    ← Back to Journal
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
