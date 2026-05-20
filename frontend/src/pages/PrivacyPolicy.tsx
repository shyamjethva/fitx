import React from 'react';
import { ShieldCheck, Eye, Lock, FileText } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <Eye className="w-5 h-5 text-[#00E5FF]" />,
      title: '1. Data Harvesting & Metric Scopes',
      desc: 'We register vital metrics under active workouts (e.g. heartbeat rates, metabolic velocity, physical output coordinates, muscle density indicators). This is gathered to populate your premium analytics graph and adapt IoT weight resistance dynamically.'
    },
    {
      icon: <Lock className="w-5 h-5 text-[#00E5FF]" />,
      title: '2. Cryptographic Protection Matrix',
      desc: 'All physiological telemetry is encapsulated using 256-bit envelope encryption keys in transit and at rest. We maintain strict tenant isolation parameters on our backend databases to keep your biometrics personal.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />,
      title: '3. Data Sovereignty & Freezing',
      desc: 'You hold absolute ownership of your biometric digital footprint. You have the right to request comprehensive telemetry summaries, freeze temporary tracking channels, or permanently purge all biometric data records from our networks at any time.'
    },
    {
      icon: <FileText className="w-5 h-5 text-[#00E5FF]" />,
      title: '4. Third-Party Sharing Rules',
      desc: 'FitX does not sell, rent, or lease your physiological datasets to any advertising network or external service. Telemetry stays completely within the secure bounds of the FitX digital companion grid.'
    }
  ];

  return (
    <div className="relative w-full min-h-screen pt-32 pb-24 bg-black overflow-hidden selection:bg-[#00E5FF]/30 text-white/80">
      {/* Background Neon Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00E5FF]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00B0FF]/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal type="slide-up">
          <div className="text-center mb-20">
            <span className="text-[#00E5FF] font-black text-xs md:text-sm tracking-[0.4em] uppercase block mb-4">
              BIOMETRIC & DATA SECURITY
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none mb-6">
              PRIVACY <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00B0FF]">POLICY</span>
            </h1>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-4">
              Last Updated: May 19, 2026 • Document Version: 4.8.2-SEC
            </p>
          </div>
        </ScrollReveal>

        {/* Content Box */}
        <ScrollReveal type="scale">
          <div className="p-8 md:p-14 rounded-[48px] border border-white/5 bg-white/[0.01] backdrop-blur-3xl shadow-2xl space-y-12">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">PREAMBLE</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                At FitX, we believe your biometric tracking is as important as your muscle building. This Privacy Policy details exactly how our physical sensors, IoT devices, and online portals interact with your personal indices. By accessing our gyms or utilizing our subscriptions, you agree to the telemetry structures laid out below.
              </p>
            </div>

            <div className="space-y-8">
              {sections.map(sec => (
                <div key={sec.title} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      {sec.icon}
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{sec.title}</h3>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed pl-13">
                    {sec.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">BIOMETRIC COMPLIANCE</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Our athletic datasets align fully with international telemetry privacy acts and state security rules. If you have questions regarding biometric isolation compliance, please contact our Data Governance Officer.
              </p>
              <div className="bg-[#00E5FF]/5 border border-[#00E5FF]/10 p-6 rounded-2xl">
                <p className="text-[10px] font-bold tracking-widest text-[#00E5FF] uppercase">Direct Inquiries Address</p>
                <p className="text-white/80 font-bold text-xs uppercase tracking-wider mt-2">governance@fitx.com</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
