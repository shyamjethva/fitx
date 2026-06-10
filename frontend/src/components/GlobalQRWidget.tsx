import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUI } from '../context/UIContext';

/**
 * GlobalQRWidget — Fixed bottom-right square QR badge shown on every page.
 * Automatically hides when footer becomes visible to prevent overlap.
 */
export default function GlobalQRWidget() {
  const [isVisible, setIsVisible] = useState(true);
  const { globalSettings } = useUI();
  const blocks = globalSettings?.contentBlocks || {};

  useEffect(() => {
    const handleScroll = () => {
      // Calculate if we are near the bottom of the page where the footer sits
      const scrolledFromTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;

      // If the user gets within 300px of the bottom (roughly footer start), hide it.
      const isNearFooter = (scrolledFromTop + viewportHeight) > (totalHeight - 450);

      if (isNearFooter && isVisible) {
        setIsVisible(false);
      } else if (!isNearFooter && !isVisible) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Run once on mount to ensure consistent state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[200] flex flex-col items-center gap-1.5 md:gap-2 rounded-2xl md:rounded-[20px] p-2 md:p-3 shadow-[0_15px_40px_rgba(18,98,107,0.06)] w-[85px] md:w-[110px]"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.7)'
          }}
        >
          {/* QR Code — square */}
          <div className="w-full aspect-square rounded-lg overflow-hidden border border-[#12626b]/8">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://fitx.app"
              alt="FitX App QR"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Label */}
          <p className="text-slate-800 text-[6.5px] md:text-[8px] font-black uppercase tracking-tighter text-center leading-tight">
            Scan to download<br />fitX App
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
