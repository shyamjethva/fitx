import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Key, EyeOff, Server, Terminal, AlertTriangle, CheckCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Security() {
  const [formData, setFormData] = useState({ name: '', email: '', desc: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', desc: '' });
    }, 4000);
  };

  const protocols = [
    {
      icon: <EyeOff className="w-6 h-6 text-[#00E5FF]" />,
      title: 'Biometric Isolation',
      desc: 'All heart rate indicators, physiological thresholds, and muscle index telemetry are kept strictly localized and isolated.'
    },
    {
      icon: <Key className="w-6 h-6 text-[#00E5FF]" />,
      title: 'Cryptographic Auth',
      desc: 'Double-envelope encryption on member tokens and access gateways prevents dynamic spoofing or unauthorized entry.'
    },
    {
      icon: <Server className="w-6 h-6 text-[#00E5FF]" />,
      title: 'Distributed Infrastructure',
      desc: 'Zero single-point-of-failure clusters ensure the fitness telemetry systems maintain 99.99% high-availability uplinks.'
    },
    {
      icon: <Terminal className="w-6 h-6 text-[#00E5FF]" />,
      title: 'Continuous Penetration Testing',
      desc: 'Ethical security architects constantly probe our IoT lockers and server relays to proactively defend against vulnerabilities.'
    }
  ];

  return (
    <div className="relative w-full min-h-screen pt-32 pb-24 bg-black overflow-hidden selection:bg-[#00E5FF]/30">
      {/* Background Neon Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00E5FF]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00B0FF]/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal type="slide-up">
          <div className="text-center mb-24">
            <span className="text-[#00E5FF] font-black text-xs md:text-sm tracking-[0.4em] uppercase block mb-4">
              SECURE TELEMETRY & HARDWARE
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none mb-6">
              MILITARY GRADE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00B0FF]">SAFEGUARDS</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              At FitX, physical excellence demands informational security. Your physical biometrics and monetary telemetry are protected by enterprise architecture.
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {protocols.map((p, i) => (
            <ScrollReveal key={p.title} type="slide-up">
              <div className="p-10 rounded-[40px] border border-white/5 bg-white/[0.01] hover:border-[#00E5FF]/15 hover:bg-white/[0.03] transition-all duration-500 flex flex-col md:flex-row gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {p.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{p.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Advisory Splitting Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Advisory Block */}
          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal type="slide-up">
              <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/25 px-4 py-2 rounded-full text-amber-500 font-bold uppercase tracking-widest text-[9px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Responsible Disclosure Program</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mt-4">
                Found a <span className="text-[#00E5FF]">vulnerability</span> in our ecosystem?
              </h2>
              <p className="text-white/50 text-sm leading-relaxed max-w-lg">
                We reward security architects and researchers who responsibly disclose system bugs, telemetry bypasses, or hardware vulnerabilities inside our premium facilities. Let us strengthen the shield together.
              </p>
              <div className="flex gap-8 pt-4 text-xs font-bold uppercase tracking-wider text-white/40">
                <div>
                  <div className="text-white font-black text-xl text-[#00E5FF]">24 hrs</div>
                  <div className="mt-1">Response Guarantee</div>
                </div>
                <div className="w-[1px] bg-white/10" />
                <div>
                  <div className="text-white font-black text-xl text-[#00E5FF]">Bounty</div>
                  <div className="mt-1">Eligible Submissions</div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Form Advisory Block */}
          <div className="lg:col-span-6">
            <ScrollReveal type="scale">
              <div className="p-8 md:p-10 rounded-[48px] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl space-y-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">File Disclosure</h3>

                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex flex-col items-center text-center gap-4"
                  >
                    <CheckCircle className="w-12 h-12 text-[#00E5FF]" />
                    <div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider">Report Filed</h4>
                      <p className="text-white/60 text-xs mt-1">Our cybersecurity operations command center has received your logs. Response dispatched shortly.</p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Name / Alias</label>
                      <input 
                        type="text" required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00E5FF]/50 transition-colors"
                        placeholder="Cipher_Knight"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Contact Email</label>
                      <input 
                        type="email" required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00E5FF]/50 transition-colors"
                        placeholder="cipher@secure.io"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Vulnerability & Steps to Reproduce</label>
                      <textarea 
                        required rows={4}
                        value={formData.desc}
                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00E5FF]/50 transition-colors resize-none font-mono text-xs"
                        placeholder="Host: fitx.com&#10;Vector: API telemetry query bypass...&#10;Payload: ..."
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#00E5FF] to-[#00B0FF] text-slate-950 font-black text-xs tracking-[0.2em] uppercase py-5 rounded-2xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>DISCLOSE ADVISORY</span>
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
