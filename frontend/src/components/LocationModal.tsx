import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  MapPin, 
  Building2, 
  History, 
  Compass, 
  Waves, 
  Palmtree, 
  Mountain, 
  Anchor, 
  Factory 
} from 'lucide-react';
import { useUI } from '../context/UIContext';

const CITIES = [
  { name: 'Bangalore', icon: <Building2 className="w-5 h-5" /> },
  { name: 'Delhi NCR', icon: <History className="w-5 h-5" /> },
  { name: 'Hyderabad', icon: <Compass className="w-5 h-5" /> },
  { name: 'Mumbai', icon: <Waves className="w-5 h-5" /> },
  { name: 'Chennai', icon: <Palmtree className="w-5 h-5" /> },
  { name: 'Pune', icon: <Mountain className="w-5 h-5" /> },
  { name: 'Kolkata', icon: <Anchor className="w-5 h-5" /> },
  { name: 'Ahmedabad', icon: <Factory className="w-5 h-5" /> },
];

export const LocationModal = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, setSelectedLocation, selectedLocation } = useUI();
  const [search, setSearch] = useState('');

  if (!isLocationModalOpen) return null;

  const filteredCities = CITIES.filter(city => 
    city.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-end pt-20 pr-6 md:pr-12 pointer-events-none">
        {/* Backdrop — only for closing */}
        <div 
          className="absolute inset-0 pointer-events-auto" 
          onClick={() => setIsLocationModalOpen(false)}
        />

        {/* Dropdown Card */}
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="booking-card relative w-full max-w-[320px] rounded-3xl shadow-[0_20px_45px_rgba(18,98,107,0.06)] overflow-hidden pointer-events-auto"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.7)'
          }}
        >
          {/* Search Bar */}
          <div className="p-4 border-b border-[#12626b]/8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search your city"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl py-2.5 pl-10 pr-4 text-slate-800 text-xs outline-none focus:ring-1 focus:ring-[#12626b]/20 focus:border-[#12626b] transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.45)',
                  border: '1px solid rgba(18, 98, 107, 0.12)'
                }}
              />
            </div>
          </div>

          <style>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Popular Cities */}
          <div 
            className="max-h-[280px] overflow-y-auto pr-1 no-scrollbar" 
            data-lenis-prevent="true"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="p-4 pb-2">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Popular Cities</p>
            </div>
            
            <div className="space-y-1 p-2">
              {filteredCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    setSelectedLocation(city.name.toUpperCase());
                    setIsLocationModalOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                    selectedLocation === city.name.toUpperCase() 
                      ? 'bg-[#12626b]/10 text-[#12626b]' 
                      : 'hover:bg-white/45 text-slate-600'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                    selectedLocation === city.name.toUpperCase()
                      ? 'border-[#12626b] bg-[#12626b]/20 text-[#12626b]'
                      : 'border-[#12626b]/10 bg-white/50 text-slate-500 group-hover:border-[#12626b]/30 group-hover:text-[#12626b]'
                  }`}>
                    {city.icon}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${
                    selectedLocation === city.name.toUpperCase() ? 'text-[#12626b]' : 'group-hover:text-[#12626b]'
                  }`}>
                    {city.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#12626b]/8 text-center bg-white/10">
            <button className="text-[9px] font-bold text-[#12626b] uppercase tracking-widest hover:underline">
              View all cities
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
