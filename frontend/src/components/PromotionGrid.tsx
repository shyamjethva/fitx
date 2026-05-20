import React from 'react';
import { motion } from 'motion/react';

const activities = [
  { id: 1, title: 'Yoga', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Gym', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Dance', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Boxing', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800' },
];

export default function PromotionGrid() {
  return (
    <section className="py-32 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-display text-5xl md:text-8xl leading-none text-white mb-6 uppercase">
            One membership for all your fitness needs
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.map((act, index) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer"
            >
              <img 
                src={act.image} 
                alt={act.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8">
                <h3 className="font-display text-4xl force-text-white tracking-tighter uppercase">
                  {act.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
