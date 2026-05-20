import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useUI } from '../context/UIContext';

export const Footer = () => {
   const { globalSettings } = useUI();

   return (
      <footer className="bg-black text-white py-4 px-2 md:px-6 border-t border-white/5">
         <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">

            {/* Left Section: Branding & About */}
            <div className="col-span-1 lg:col-span-4 flex flex-col">
               <div className="flex items-center gap-2 mb-6 md:mb-8 group">
                  {globalSettings?.video ? (
                     <img src={globalSettings.video} alt="FitX Logo" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                     <>
                        <div className="w-8 h-8 bg-[#00E5FF] rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 duration-300">
                           <div className="w-4 h-4 bg-[#0A0F24] rounded-sm rotate-45" />
                        </div>
                        <span className="font-sans text-3xl md:text-3xl tracking-tight text-white uppercase font-black">
                           fit<span className="text-[#00E5FF]">X</span>
                        </span>
                     </>
                  )}
               </div>
               <p className="font-sans text-white/50 text-sm leading-relaxed max-w-sm mb-4">
                  At FitX, we make group workouts fun, daily food healthy & tasty, mental fitness easy with yoga & meditation, and medical & lifestyle care hassle-free.
               </p>
               <p className="font-sans text-[#00E5FF] font-black tracking-widest text-xs uppercase">#BeBetterEveryDay</p>
            </div>

            {/* Links Column 1 */}
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-4 lg:gap-6">
               <Link to="/fitness" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">FitX for business</Link>
               <Link to="/fitness/elite" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">FitX ELITE</Link>
               <Link to="/fitness/pro" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">FitX PRO</Link>
               <Link to="/fitness/home" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">FitX HOME</Link>
               <Link to="/fitness/transform" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">FitX TRANSFORM</Link>
            </div>

            {/* Links Column 2 */}
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-4 lg:gap-6">
               <Link to="/fitness" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">Partner.fit</Link>
               <Link to="/blogs" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">Blogs</Link>
               <Link to="/careers" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">Careers</Link>
               <Link to="/security" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">Security</Link>
            </div>

            {/* Links Column 3 */}
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-4 lg:gap-6">
               <Link to="/help-center" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">Help Center</Link>
               <Link to="/contact" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">Contact Us</Link>
               <Link to="/privacy-policy" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">Privacy Policy</Link>
               <Link to="/fitness" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">FitX BMI Calculator</Link>
               <Link to="/about" className="font-sans text-white/50 hover:text-white transition-colors text-xs font-bold uppercase">Terms & Conditions</Link>
            </div>

            {/* Right Section: Apps & Social */}
            <div className="col-span-1 lg:col-span-2 flex flex-col items-start lg:items-end gap-6">
               {globalSettings?.image && (
                  <div className="mb-2">
                     <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 cursor-pointer" onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>Scan to Join</p>
                     <img src={globalSettings.image} alt="QR Code" className="w-24 h-24 object-cover rounded-xl bg-white p-1" />
                  </div>
               )}
               <div className="flex flex-col gap-4">
                  <a href="#" className="h-10 md:h-12 block"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-full" /></a>
                  <a href="#" className="h-10 md:h-12 block"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-full" /></a>
               </div>

               <div className="flex gap-4 lg:translate-x-4">
                  <a href={globalSettings?.contentBlocks?.youtube_url || "https://youtube.com"} target="_blank" rel="noopener noreferrer" className="footer-social-icon"><Youtube /></a>
                  <a href={globalSettings?.contentBlocks?.facebook_url || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className="footer-social-icon"><Facebook /></a>
                  <a href={globalSettings?.contentBlocks?.twitter_url || "https://x.com"} target="_blank" rel="noopener noreferrer" className="footer-social-icon"><Twitter /></a>
                  <a href={globalSettings?.contentBlocks?.instagram_url || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="footer-social-icon"><Instagram /></a>
                  <a href={globalSettings?.contentBlocks?.linkedin_url || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="footer-social-icon"><Linkedin /></a>
               </div>
            </div>

         </div>
      </footer>
   );
};
