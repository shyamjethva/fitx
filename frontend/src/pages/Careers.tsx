import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, DollarSign, Send, CheckCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

interface Job {
  id: string;
  title: string;
  dept: string;
  location: string;
  compensation: string;
  description: string;
}

const JOBS: Job[] = [
  {
    id: '1',
    title: 'Elite Athletic Performance Coach',
    dept: 'Athletic Division',
    location: 'Mumbai HQ / On-site',
    compensation: '₹12,00,000 - ₹18,00,000 / year',
    description: 'Design and deliver elite strength and conditioning regimens for national-level athletes and high-performance individuals.'
  },
  {
    id: '2',
    title: 'Full Stack Fitness Architect',
    dept: 'Digital Platform',
    location: 'Remote (India)',
    compensation: '₹15,00,000 - ₹24,00,000 / year',
    description: 'Architect the next generation of digital companion apps, telemetry integrations, and web gateways using modern frameworks.'
  },
  {
    id: '3',
    title: 'Nutritional Biologist & Consultant',
    dept: 'Biometrics & Diet',
    location: 'Hybrid / Bangalore',
    compensation: '₹10,00,000 - ₹15,00,000 / year',
    description: 'Devise custom biochemistry-aligned meal guidelines, track metabolic markers, and drive sustainable biometric transformations.'
  },
  {
    id: '4',
    title: 'Member Experience Lead',
    dept: 'Club Operations',
    location: 'Pune Facility / On-site',
    compensation: '₹8,00,000 - ₹12,00,000 / year',
    description: 'Manage premium front-of-house operations, build deep community relationships, and ensure standard-setting hospitality.'
  }
];

export default function Careers() {
  const [formData, setFormData] = useState({ name: '', email: '', position: '1', cover: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', position: '1', cover: '' });
    }, 4000);
  };

  return (
    <div className="relative w-full min-h-screen pt-32 pb-24 bg-black overflow-hidden selection:bg-[#00E5FF]/30">
      {/* Background Neon Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00E5FF]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00B0FF]/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal type="slide-up">
          <div className="text-center mb-20">
            <span className="text-[#00E5FF] font-black text-xs md:text-sm tracking-[0.4em] uppercase block mb-4">
              JOIN THE FITX REVOLUTION
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none mb-6">
              BUILD FUTURE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00B0FF]">ATHLETICS</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              We are not just a fitness center. We are a high-performance network. Join a cohort dedicated to engineering peak human capability.
            </p>
          </div>
        </ScrollReveal>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[
            { title: 'ELITE SALARY', desc: 'Industry-leading base pay models, structured performance multipliers, and financial rewards.' },
            { title: 'HYPER-EQUIPPED', desc: 'Daily access to biomechanically optimized facilities, biometrics testing, and private coaching spaces.' },
            { title: 'CONTINUOUS ED', desc: 'Full corporate sponsorship for global coaching certifications, sports nutrition programs, and medical workshops.' }
          ].map((perk, i) => (
            <ScrollReveal key={perk.title} type="scale">
              <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl space-y-4">
                <span className="text-xs font-black text-[#00E5FF] tracking-widest uppercase">PERK 0{i + 1}</span>
                <h3 className="text-xl font-bold text-white uppercase">{perk.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{perk.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Main Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Job Listings (Left 7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-8">Active Cohort Openings</h2>
            {JOBS.map((job) => (
              <ScrollReveal key={job.id} type="slide-up">
                <div className="group p-8 rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#00E5FF]/20 transition-all duration-500 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-black text-[#00E5FF] tracking-widest uppercase bg-[#00E5FF]/10 px-3 py-1 rounded-full">{job.dept}</span>
                      <h3 className="text-2xl font-bold text-white uppercase mt-3 group-hover:text-[#00E5FF] transition-colors">{job.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-white/60 text-sm leading-relaxed">{job.description}</p>

                  <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5 text-[11px] text-white/40 uppercase tracking-widest font-bold">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#00E5FF]" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#00E5FF]" />
                      <span>{job.compensation}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Form (Right 5 Columns) */}
          <div className="lg:col-span-5">
            <ScrollReveal type="scale">
              <div className="sticky top-28 p-8 md:p-10 rounded-[48px] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl space-y-8">
                <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">Rapid Uplink</h3>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-2">Submit Your Credentials</p>
                </div>

                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex flex-col items-center text-center gap-4"
                  >
                    <CheckCircle className="w-12 h-12 text-[#00E5FF]" />
                    <div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider">Uplink Success</h4>
                      <p className="text-white/60 text-xs mt-1">Our talent acquisition matrix has ingested your credentials. We will contact you soon.</p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Full Name</label>
                      <input 
                        type="text" required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00E5FF]/50 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email" required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00E5FF]/50 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Target Position</label>
                      <select 
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00E5FF]/50 transition-colors uppercase tracking-wider"
                      >
                        {JOBS.map(job => (
                          <option key={job.id} value={job.id} className="bg-neutral-950 text-white py-2">
                            {job.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Cover Letter Summary</label>
                      <textarea 
                        required rows={4}
                        value={formData.cover}
                        onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00E5FF]/50 transition-colors resize-none"
                        placeholder="Why do you wish to architect human performance at FitX?"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#00E5FF] to-[#00B0FF] text-slate-950 font-black text-xs tracking-[0.2em] uppercase py-5 rounded-2xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>SUBMIT DOSSIER</span>
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
