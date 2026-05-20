import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  type?: 'fade' | 'scale' | 'slide-up' | 'sticky';
  delay?: number;
}

export default function ScrollReveal({ children, className, type = 'fade' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.95, 1, 1, 0.95]);
  const translateY = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [40, 0, 0, -40]);
  
  // Sticky effect transforms
  const stickyScale = useTransform(scrollYProgress, [0.5, 1], [1, 0.8]);
  const stickyOpacity = useTransform(scrollYProgress, [0.5, 1], [1, 0]);
  const stickyTranslateY = useTransform(scrollYProgress, [0.5, 1], [0, -100]);

  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothTranslateY = useSpring(translateY, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const getTransform = () => {
    switch (type) {
      case 'sticky':
        return { 
          scale: stickyScale, 
          opacity: stickyOpacity, 
          y: stickyTranslateY,
          position: 'sticky' as const,
          top: 0
        };
      case 'scale':
        return { opacity: smoothOpacity, scale: smoothScale };
      case 'slide-up':
        return { opacity: smoothOpacity, y: smoothTranslateY };
      default:
        return { opacity: smoothOpacity };
    }
  };

  return (
    <motion.div
      ref={ref}
      style={getTransform()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
