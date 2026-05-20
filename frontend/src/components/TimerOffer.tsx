import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { api, PromotionalOfferData } from '../lib/api';

export const TimerOffer = () => {
  const [offer, setOffer] = useState<PromotionalOfferData | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    api.getPromotionalOffer()
      .then(res => {
        if (res) {
          setOffer(res);
        }
      })
      .catch(err => console.error("Failed loading promotional offer:", err));
  }, []);

  useEffect(() => {
    if (!offer || !offer.isActive || !offer.targetDate) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(offer.targetDate) - +new Date();
      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [offer]);

  if (!offer || !offer.isActive) return null;

  const currentTextColor = offer.textColor || '#000000';

  return (
    <section 
      className="py-4 relative overflow-hidden"
      style={{
        backgroundColor: offer.bgColor || '#ff5a3d',
        color: currentTextColor
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-center gap-4 md:gap-8 relative z-10">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center gap-2"
        >
          <Clock className="w-5 h-5" style={{ color: currentTextColor }} />
          <span className="font-black text-xs md:text-sm tracking-[0.3em] uppercase" style={{ color: currentTextColor }}>
            {offer.title}
          </span>
        </motion.div>

        <div className="h-4 w-[1px] block" style={{ backgroundColor: `${currentTextColor}33` }} />

        <div className="flex items-center gap-4">
          <span className="font-black text-lg md:text-2xl tracking-tighter tabular-nums" style={{ color: currentTextColor }}>
            SALE ENDS IN: {String(timeLeft.hours).padStart(2, '0')}H {String(timeLeft.minutes).padStart(2, '0')}M {String(timeLeft.seconds).padStart(2, '0')}S
          </span>
        </div>

        <div className="h-4 w-[1px] block" style={{ backgroundColor: `${currentTextColor}33` }} />

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-black text-[10px] md:text-xs tracking-widest uppercase block"
          style={{ color: `${currentTextColor}cc` }}
        >
          {offer.subtitle}
        </motion.span>
      </div>

      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,black_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>
    </section>
  );
};
