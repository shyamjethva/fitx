import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { api, Membership } from '../lib/api';

export default function MembershipStacks() {
  const [plans, setPlans] = useState<Membership[]>([]);

  useEffect(() => {
    api.getMemberships()
      .then(data => {
        if (data && data.length > 0) {
          setPlans(data);
        }
      })
      .catch(err => console.error("Error loading memberships:", err));
  }, []);

  const fallbackPlans = [
    {
      name: 'ELITE',
      desc: 'Unlimited access to group classes, all gyms and at-home workouts',
      color: 'text-[#FF7200]'
    },
    {
      name: 'PRO',
      desc: 'Unlimited access to all PRO gyms and at-home workouts',
      color: 'text-[#FF8B10]'
    },
    {
      name: 'SELECT',
      desc: 'Unlimited access to select gyms and all at-home workouts',
      color: 'text-[#FF9942]'
    }
  ];

  const displayPlans = plans.length > 0 ? plans.map(p => ({
    name: p.name.toUpperCase(),
    desc: p.desc,
    color: p.name.toUpperCase() === 'ELITE' ? 'text-[#FF7200]' : p.name.toUpperCase() === 'PRO' ? 'text-[#FF8B10]' : 'text-[#FF9942]'
  })) : fallbackPlans;

  return (
    <section className="py-12 px-6 md:px-12 bg-transparent">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 justify-center">
        {displayPlans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            className="flex-1 glass-panel p-6 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:border-[#FF7200]/50 transition-all duration-500"
          >
            <span className="font-bold text-xs tracking-widest text-white/40 uppercase mb-4">
              fitxpass
            </span>
            <h3 className={cn("font-display text-5xl mb-6 tracking-wider", plan.color)}>
              {plan.name}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-[250px]">
              {plan.desc}
            </p>
            
            <div className="mt-8 h-1 w-0 bg-[#FF7200] group-hover:w-12 transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
