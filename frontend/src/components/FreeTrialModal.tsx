import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, MapPin, Home, ArrowRight } from 'lucide-react';
import { useUI } from '../context/UIContext';

export const FreeTrialModal = () => {
  const { isFreeTrialModalOpen, setIsFreeTrialModalOpen, setIsLoginModalOpen } = useUI();

  const handleBookNow = () => {
    setIsFreeTrialModalOpen(false);
    setIsLoginModalOpen(true);
  };

  if (!isFreeTrialModalOpen) return null;

  const trials = [
    {
      title: 'Group Classes',
      subtitle: 'Yoga, Dance Fitness, Strength and more',
      sessions: '02 Free Sessions',
      buttonText: 'BOOK NOW',
      icon: <Users className="w-6 h-6" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10'
    },
    {
      title: 'Gym Sessions',
      subtitle: 'Workout at ELITE and PRO gyms',
      sessions: '02 Free Sessions',
      buttonText: 'BOOK NOW',
      icon: <MapPin className="w-6 h-6" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10'
    },
    {
      title: '7-DAY HOME TRIAL',
      subtitle: 'Workout at home with calorie tracking',
      sessions: '7 days free trial',
      buttonText: 'GET STARTED',
      icon: <Home className="w-6 h-6" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFreeTrialModalOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          data-lenis-prevent
          className="auth-modal relative w-full max-w-xl bg-[#262b31] border border-white/5 rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] overflow-y-auto scrollbar-hide"
        >
          {/* Header */}
          <div className="p-6 pb-6 text-center">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Take a free trial</h2>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Access gyms and at-home workouts</p>
            
            <button 
              onClick={() => setIsFreeTrialModalOpen(false)}
              className="absolute right-8 top-8 p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white/40" />
            </button>
          </div>

          <div className="px-10 pb-12 space-y-4">
            {trials.map((trial, index) => (
              <div key={index}>
                <div className="flex items-center justify-between py-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl ${trial.bgColor} flex items-center justify-center ${trial.color}`}>
                      {trial.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-black text-lg uppercase tracking-tight mb-1">{trial.title}</h3>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{trial.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <button 
                      onClick={handleBookNow}
                      className="bg-white text-[#ff5a3d] font-black px-6 py-2 rounded-lg text-[10px] tracking-widest uppercase mb-2 hover:bg-[#ff5a3d] hover:text-white transition-all"
                    >
                      {trial.buttonText}
                    </button>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest block">{trial.sessions}</p>
                  </div>
                </div>
                {index < trials.length - 1 && (
                   <div className="h-px bg-white/5 w-full ml-20" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
