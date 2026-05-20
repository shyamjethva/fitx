import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MembershipStacks from '../components/MembershipStacks';
import ScrollReveal from '../components/ScrollReveal';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { TimerOffer } from '../components/TimerOffer';
import { api, Membership, GalleryItem, Blog } from '../lib/api';

export default function Home() {
   const { setIsFreeTrialModalOpen, isLoggedIn, setIsLoginModalOpen } = useUI();
   const [memberships, setMemberships] = useState<Membership[]>([]);
   const [gallery, setGallery] = useState<GalleryItem[]>([]);
   const [blogs, setBlogs] = useState<Blog[]>([]);

   useEffect(() => {
      // 1. Fetch memberships from database
      api.getMemberships()
         .then(data => setMemberships(data))
         .catch(err => console.error("Error loading memberships:", err));

      // 2. Fetch gallery from database
      api.getGallery()
         .then(data => setGallery(data))
         .catch(err => console.error("Error loading gallery:", err));

      // 3. Fetch blogs from database
      api.getBlogs()
         .then(data => setBlogs(data))
         .catch(err => console.error("Error loading blogs:", err));
   }, []);

   const fadeInUp = {
      initial: { opacity: 0, y: 60 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-100px" },
      transition: { duration: 0.8, ease: "easeOut" }
   };

   const defaultActivityImages = [
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=400",
      "/fitxpass.jpeg",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=400",
   ];

   const dbGymImages = gallery.filter(item => item.type === 'gym').map(item => item.img);
   const activityImages = dbGymImages.length >= 4 ? dbGymImages.slice(0, 8) : defaultActivityImages;

   return (
      <div className="flex flex-col w-full premium-bg overflow-x-hidden">
         <Hero />
         <TimerOffer />

         <ScrollReveal type="slide-up">
            <MembershipStacks />
         </ScrollReveal>

         {/* 3. Overlapping Images Section */}
         <ScrollReveal type="sticky">
            <section className="py-10 bg-transparent relative px-4 md:px-20">
               <div className="max-w-7xl mx-auto relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[40px] overflow-hidden shadow-2xl">
                     <motion.div className="relative aspect-[4/3] w-full h-full">
                        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Yoga" />
                        <div className="absolute inset-0 bg-black/40" />
                     </motion.div>
                     <motion.div className="relative aspect-[4/3] w-full h-full">
                        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Workout" />
                        <div className="absolute inset-0 bg-black/40" />
                     </motion.div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 px-4 text-center">
                     <motion.h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] force-text-white font-black tracking-tight drop-shadow-[0_0_30px_rgba(0,0,0,0.95)] max-w-5xl mx-auto w-full">
                        One membership for all <br className="md:hidden" /> your fitness needs
                     </motion.h2>
                  </div>
               </div>
            </section>
         </ScrollReveal>

         {/* 4. Group Class Grid */}
         <ScrollReveal type="sticky">
            <section className="py-10 bg-transparent relative overflow-hidden px-4 md:px-20">
               <div className="max-w-7xl mx-auto relative">
                  <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none px-4">
                     <motion.h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] force-text-white text-center font-black tracking-tight max-w-5xl uppercase italic drop-shadow-[0_0_30px_rgba(0,0,0,0.95)] w-full">
                        Fun, trainer led <br className="md:hidden" /> group classes
                     </motion.h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-0 rounded-[40px] overflow-hidden shadow-2xl opacity-100 cursor-pointer">
                     {activityImages.map((src, idx) => (
                        <motion.div key={idx} className="relative aspect-[3/4] w-full h-full border border-white/5 transition-all duration-500 hover:scale-[1.02] z-0 hover:z-10">
                           <img src={src} className="w-full h-full object-cover" alt="Activity" />
                           <div className="absolute inset-0 bg-black/40" />
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>
         </ScrollReveal>

         {/* 5. Plan Comparison Section */}
         <ScrollReveal type="slide-up">
            <section className="py-10 bg-transparent relative overflow-hidden px-4 md:px-20">
               <div className="max-w-7xl mx-auto flex flex-col items-center">
                  <motion.h2 className="font-sans text-[60px] md:text-[120px] text-white font-black tracking-tight mb-4 leading-none">FitXPass</motion.h2>
                  <Link to="/fitness" className="font-sans text-[#FF8B10] font-black text-sm tracking-widest uppercase mb-4">LEARN MORE</Link>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-10 justify-center max-w-5xl mx-auto">
                     {(memberships.length > 0 ? memberships : [
                        {
                           name: 'ELITE',
                           desc: 'Unlimited access to group classes, all gyms and at-home workouts',
                           features: ['At-center group classes', 'All ELITE & PRO gyms']
                        },
                        {
                           name: 'PRO',
                           desc: 'Unlimited access to all PRO gyms and at-home workouts',
                           features: ['At-center group classes', 'All PRO gyms']
                        },
                        {
                           name: 'STARTER',
                           desc: 'Unlimited access to select gyms and all at-home workouts',
                           features: ['Select gym access', 'All at-home workouts']
                        }
                     ]).map((plan, idx) => {
                        const name = plan.name.toUpperCase();
                        const path = name === 'ELITE' ? '/fitness/elite' : name === 'PRO' ? '/fitness/pro' : '/fitness';
                        const image = idx === 0 ? "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600" :
                           idx === 1 ? "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600" :
                              "/fitxpass.jpeg";
                        return (
                           <motion.div key={name} className="flex flex-col">
                              <Link to={path} className="relative aspect-[4/3] rounded-[30px] overflow-hidden mb-8 border border-white/10 group cursor-pointer block">
                                 <img src={image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={name} />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />
                                 <div className="absolute bottom-6 left-6">
                                    <p className="font-sans force-text-white-muted text-[10px] font-black tracking-widest uppercase mb-1">FitXPass</p>
                                    <h3 className={`font-sans text-4xl font-black tracking-tight ${name === 'ELITE' ? 'text-[#FF7200]' : name === 'PRO' ? 'text-[#FF8B10]' : 'force-text-white'}`}>{name}</h3>
                                 </div>
                              </Link>
                              <div className="flex-1 px-2">
                                 <p className="font-sans text-white font-black text-xl mb-6 uppercase leading-tight tracking-tight">{plan.desc}</p>
                                 <ul className="space-y-4 mb-10">
                                    {(plan.features || []).slice(0, 2).map((feat: string, fIdx: number) => (
                                       <li key={fIdx} className="flex items-start gap-3 text-white/70 font-bold font-sans text-xs leading-relaxed uppercase tracking-wide"><div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />{feat}</li>
                                    ))}
                                 </ul>
                              </div>
                              <div className="flex gap-3 px-2">
                                 <button
                                    onClick={() => setIsFreeTrialModalOpen(true)}
                                    className="flex-1 bg-white/5 text-white py-3 rounded-xl font-black font-sans text-[10px] tracking-widest uppercase"
                                 >
                                    TRY FOR FREE
                                 </button>
                                 <Link
                                    to={path}
                                    className="flex-1 bg-[#00E5FF] text-[#0A0F24] py-3 rounded-xl font-black font-sans text-[10px] tracking-widest uppercase text-center flex items-center justify-center hover:bg-[#33EBFF] transition-all"
                                    style={{ color: '#0A0F24' }}
                                 >
                                    LEARN MORE
                                 </Link>
                              </div>
                           </motion.div>
                        );
                     })}
                  </div>
               </div>
            </section>
         </ScrollReveal>

         {/* 6. Feature Showcase Row 1 */}
         <ScrollReveal type="slide-up">
            <section className="py-10 bg-transparent px-4 md:px-20">
               <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Link to="/fitness/transform" className="relative aspect-square md:aspect-[5/4] rounded-[40px] overflow-hidden bg-gradient-to-b from-[#124a44] to-[#0b211f] p-8 flex flex-col group cursor-pointer">
                     <div className="flex justify-between items-start z-10 relative">
                        <div>
                           <h3 className="font-sans text-white font-bold text-3xl md:text-4xl mb-2 tracking-tight">FitX Transform</h3>
                           <p className="font-sans text-white/70 text-base md:text-lg">Get coached to lose weight for good</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm"><ChevronRight className="w-5 h-5" /></div>
                     </div>
                     <div className="mt-auto flex justify-center relative translate-y-10 group-hover:translate-y-6 transition-transform duration-500">
                        <motion.div initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} className="w-[95%] shadow-[0_30px_60px_rgba(0,0,0,0.4)] rounded-t-[24px] overflow-hidden aspect-[4/5]">
                           <img src="/transform_hero.jpeg" className="w-full h-full object-cover object-top" alt="Scale" />
                        </motion.div>
                     </div>
                  </Link>

                  <motion.div whileHover={{ y: -10 }} className="relative aspect-square md:aspect-[5/4] rounded-[40px] overflow-hidden bg-gradient-to-b from-[#282c31] to-[#1a1c1e] p-8 flex flex-col group cursor-pointer">
                     <div className="flex justify-between items-start z-10 relative">
                        <div>
                           <h3 className="font-sans text-white font-bold text-3xl md:text-4xl mb-2 tracking-tight">The FitX way</h3>
                           <p className="font-sans text-white/70 text-base md:text-lg">Making health easy, one day at a time</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm"><ChevronRight className="w-5 h-5" /></div>
                     </div>
                     <div className="mt-auto flex justify-center relative w-full h-[65%] items-end">
                        <div className="relative w-full h-full flex justify-center items-end translate-y-8">
                           {/* Back Left Card */}
                           <motion.div className="absolute w-[45%] aspect-[3/4] bg-[#eebaba] rounded-[16px] z-10 shadow-lg overflow-hidden border border-white/5 -translate-x-24 translate-y-12 rotate-[-6deg] group-hover:rotate-[-3deg] transition-all duration-500">
                              <img src="/fitx2.jpeg" className="w-full h-full object-cover" />
                           </motion.div>
                           {/* Back Right Card */}
                           <motion.div className="absolute w-[45%] aspect-[3/4] bg-[#e0d09a] rounded-[16px] z-10 shadow-lg overflow-hidden border border-white/5 translate-x-24 translate-y-12 rotate-[6deg] group-hover:rotate-[3deg] transition-all duration-500">
                              <img src="/fitx3.jpeg" className="w-full h-full object-cover" />
                           </motion.div>
                           {/* Center Main Card */}
                           <motion.div className="absolute w-[52%] aspect-[3/4] bg-[#121212] rounded-[16px] z-20 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 translate-y-4 group-hover:translate-y-0 transition-all duration-500" initial={{ y: 40 }} whileInView={{ y: 0 }}>
                              <img src="/fitx1.jpeg" className="w-full h-full object-cover" />
                           </motion.div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </section>
         </ScrollReveal>

         {/* 8. Wellness Hub Bento Grid */}
         <ScrollReveal type="sticky">
            <section className="py-10 bg-transparent px-4 md:px-20">
               <motion.div className="max-w-7xl mx-auto rounded-[40px] bg-gradient-to-br from-[#2d333d] to-[#1a1e24] p-6 md:p-12 flex flex-col lg:flex-row gap-12 overflow-hidden relative items-center">
                  {/* Ambient Background Glows */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7200]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF8B10]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
                  <div className="lg:w-1/2 flex flex-col justify-center z-10">
                     <h2 className="font-sans text-white font-bold text-4xl md:text-6xl tracking-tight mb-4 leading-tight">Wellness Hub</h2>
                     <p className="font-sans text-white/70 text-lg mb-8">One place for all your well-being needs</p>
                     <Link to="/programs" className="font-sans flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors text-white font-bold py-3 px-6 rounded-full w-fit tracking-wide text-sm">WORKOUT GEAR <ChevronRight className="w-4 h-4" /></Link>
                  </div>
                  <div className="lg:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-4 h-[350px] z-10 w-full">
                     <div className="row-span-2 rounded-[30px] bg-[#121414] overflow-hidden group cursor-pointer"><img src="/eq1.jpeg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                     <div className="rounded-[30px] bg-[#212b4d] overflow-hidden group cursor-pointer"><img src="/eq2.jpeg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                     <div className="rounded-[30px] bg-[#4d3b21] overflow-hidden group cursor-pointer"><img src="/eq3.jpeg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                     <div className="rounded-[30px] bg-[#4d212b] overflow-hidden group cursor-pointer"><img src="/eq4.jpeg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                     <div className="rounded-[30px] bg-[#3b214d] overflow-hidden group cursor-pointer"><img src="/eq5.jpeg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                  </div>
               </motion.div>
            </section>
         </ScrollReveal>

         {/* 9. App Download Section */}
         <ScrollReveal type="sticky">
            <section className="py-10 bg-transparent px-4 md:px-20">
               <motion.div className="max-w-7xl mx-auto rounded-[40px] bg-gradient-to-br from-[#1a1c1d] via-[#FF7200]/10 to-[#0d1616] p-6 md:p-12 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative">
                  <div className="lg:w-1/2 flex flex-col z-10">
                     <h2 className="font-sans text-white font-bold text-4xl md:text-6xl tracking-tight mb-4 leading-tight">Download the app</h2>
                     <p className="font-sans text-white/70 text-lg mb-8 max-w-md">Start your fitness journey with us. Join the FitX family!</p>
                     <div className="flex flex-wrap gap-4"><motion.a whileHover={{ scale: 1.05 }} href="#" className="h-12"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" className="h-full" /></motion.a><motion.a whileHover={{ scale: 1.05 }} href="#" className="h-12"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-full" /></motion.a></div>
                  </div>
                  <div className="lg:w-1/2 relative h-[450px] flex items-center justify-center perspective-[2000px]">
                     <motion.div
                        initial={{ rotateY: 15, rotateX: 5, rotateZ: -10 }}
                        whileInView={{ rotateY: 10, rotateX: 2, rotateZ: -5 }}
                        className="w-[200px] h-[400px] bg-[#121414] rounded-[32px] border-[6px] border-[#2d333d] shadow-2xl overflow-hidden relative"
                     >
                        <img src="/fitness_app_mockup.png" className="w-full h-full object-cover" alt="Premium Fitness App UI" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                     </motion.div>
                  </div>
               </motion.div>
            </section>
         </ScrollReveal>

         {/* 9.5. FitX Journal / Blogs Section */}
         <ScrollReveal type="slide-up">
            <section className="py-16 bg-transparent px-4 md:px-20 max-w-7xl mx-auto w-full">
               <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                  <div>
                     <p className="text-[#00E5FF] font-black text-xs tracking-[0.3em] uppercase mb-4">LATEST INTEL</p>
                     <h2 className="font-sans text-white font-black text-4xl md:text-6xl tracking-tight leading-none uppercase">FitX Journal</h2>
                  </div>
                  <Link to="/blogs" className="text-[#00E5FF] font-black text-sm tracking-widest uppercase border-b border-[#00E5FF]/20 hover:border-[#00E5FF] transition-all pb-1 mt-4 md:mt-0 flex items-center gap-2">
                     VIEW ALL ARTICLES <ChevronRight className="w-4 h-4" />
                  </Link>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {(blogs.length > 0 ? blogs.slice(0, 3) : [
                     {
                        id: "1",
                        title: "The Ultimate Guide to Hypertrophy: Science-Backed Growth",
                        excerpt: "Learn the specific rep ranges, volume, and recovery strategies needed to maximize muscle protein synthesis.",
                        category: "Training",
                        readTime: "8 min read",
                        img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800"
                     },
                     {
                        id: "2",
                        title: "Macronutrient Timing: Does It Really Matter?",
                        excerpt: "Debunking the myths around the anabolic window and exploring optimal timing for carbs and protein.",
                        category: "Nutrition",
                        readTime: "6 min read",
                        img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800"
                     },
                     {
                        id: "3",
                        title: "Mastering the Mindset: The Psychology of Consistency",
                        excerpt: "How to build unbreakable habits and stay motivated when the initial excitement fades away.",
                        category: "Mindset",
                        readTime: "5 min read",
                        img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"
                     }
                  ]).map((blog) => (
                     <motion.div
                        key={blog.id}
                        whileHover={{ y: -8 }}
                        className="group flex flex-col h-full bg-white/5 border border-white/5 rounded-[32px] overflow-hidden hover:bg-white/[0.08] transition-all duration-500 cursor-pointer shadow-xl"
                     >
                        <Link to="/blogs" className="block relative h-64 overflow-hidden">
                           <img src={blog.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={blog.title} />
                           <div className="absolute top-4 left-4">
                              <span className="bg-black/85 text-white px-3 py-1.5 rounded-full font-sans text-[8px] font-black tracking-widest uppercase border border-[#00E5FF]/20 shadow-md">
                                 {blog.category}
                              </span>
                           </div>
                        </Link>
                        <div className="p-6 flex flex-col flex-grow gap-4">
                           <h3 className="font-sans text-white font-black text-xl leading-snug group-hover:text-[#00E5FF] transition-colors line-clamp-2">
                              {blog.title}
                           </h3>
                           <p className="font-sans text-white/50 text-xs font-bold leading-relaxed line-clamp-3">
                              {blog.excerpt}
                           </p>
                           <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                              <span className="text-white/30 font-sans font-bold text-[9px] uppercase tracking-widest">{blog.readTime}</span>
                              <Link to="/blogs" className="flex items-center gap-1.5 text-[#00E5FF] font-black text-[9px] tracking-widest uppercase">
                                 READ <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </section>
         </ScrollReveal>

         {/* 10. Join the Family Section */}
         <ScrollReveal type="slide-up">
            <section className="py-10 bg-transparent px-4 md:px-20">
               <div className="max-w-7xl mx-auto flex flex-col items-center">
                  <motion.h2 className="font-sans text-white font-black text-6xl md:text-[100px] tracking-tight mb-20 text-center leading-none">Join the FitX family</motion.h2>
                  <div className="max-w-3xl w-full">
                     <motion.div
                        onClick={() => {
                           if (!isLoggedIn) {
                              setIsLoginModalOpen(true);
                           } else {
                              // Optional: Redirect to careers or something
                           }
                        }}
                        whileHover={{ y: -10 }}
                        className="relative aspect-video rounded-[50px] bg-[#121414] flex flex-col items-center justify-center text-center group cursor-pointer overflow-hidden border border-white/5"
                     >
                        <img src="/career.webp" className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" alt="Careers" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="relative z-10 flex flex-col items-center">
                           <h3 className="font-sans text-white font-black text-5xl tracking-tight mb-8">Careers at FitX</h3>
                           <button className="font-sans text-blue-400 font-black text-sm tracking-widest uppercase hover:underline">LEARN MORE</button>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </section>
         </ScrollReveal>
      </div>
   );
}
