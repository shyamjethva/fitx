import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useUI } from '../context/UIContext';

const fitnessLinks = [
  { key: 'fitness_elite', name: 'FitX ELITE', path: '/fitness/elite' },
  { key: 'fitness_pro', name: 'FitX PRO', path: '/fitness/pro' },
  { key: 'fitness_home', name: 'FitX HOME', path: '/fitness/home' },
  { key: 'fitness_transform', name: 'FitX TRANSFORM', path: '/fitness/transform' },
  { key: 'fitness_bootcamp', name: 'BOOTCAMP', path: '/fitness/bootcamp' },
  { key: 'fitness_gallery', name: 'GALLERY', path: '/gallery' }
];

const isEnabled = (value: unknown) => !['false', '0', 'off', 'no'].includes(String(value).toLowerCase());

const FitnessSubNav = () => {
  const location = useLocation();
  const { globalSettings } = useUI();
  const blocks = globalSettings?.contentBlocks || {};
  const links = fitnessLinks
    .filter((item) => isEnabled(blocks[`${item.key}_enabled`] ?? true))
    .map((item) => ({ ...item, name: blocks[`${item.key}_label`] || item.name }));

  return (
    <div className="w-full bg-[#0A0F24]/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 overflow-x-auto no-scrollbar">
      <div className="max-w-5xl mx-auto flex justify-start md:justify-center items-center gap-6 md:gap-14 py-4 px-6 min-w-max md:min-w-0">
        {links.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className="whitespace-nowrap text-[12px] font-black transition-all uppercase tracking-[0.15em] relative py-1"
              style={{ color: isActive ? '#00E5FF' : 'rgba(255, 255, 255, 0.6)' }}
            >
              {item.name}
              {isActive && (
                <motion.div
                  layoutId="activeFitnessTab"
                  className="absolute -bottom-4 left-0 right-0 h-[2px] bg-[#00E5FF]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FitnessSubNav;
