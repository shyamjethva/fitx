import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, LogOut, Camera, CheckCircle2, Award, Briefcase } from 'lucide-react';
import BackgroundGlows from '../components/BackgroundGlows';
import { useUI } from '../context/UIContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function TrainerDashboard() {
  const { userProfileData, setUserProfileData, setIsLoggedIn, profileImage, setProfileImage, activeUserId } = useUI();
  const navigate = useNavigate();

  // Active trainer ID for display
  const displayId = activeUserId ? `FITX-COACH-${activeUserId.slice(-4).toUpperCase()}` : 'FITX-COACH';

  // Form states loaded from context and synchronized
  const [profile, setProfile] = useState({ 
    name: userProfileData?.name || 'Coach Master', 
    email: userProfileData?.email || 'trainer@fitx.com', 
    spec: userProfileData?.spec || 'Elite CrossFit Trainer', 
    cert: userProfileData?.cert || 'ACE-CPT Certified', 
    bio: userProfileData?.bio || 'Dedicated to push athletes beyond physical limits' 
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfileData) {
      setProfile({
        name: userProfileData.name || 'Coach Master',
        email: userProfileData.email || 'trainer@fitx.com',
        spec: userProfileData.spec || 'Elite CrossFit Trainer',
        cert: userProfileData.cert || 'ACE-CPT Certified',
        bio: userProfileData.bio || 'Dedicated to push athletes beyond physical limits'
      });
    }
  }, [userProfileData]);

  // Upload/change trainer avatar
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUserId) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setProfileImage(base64Image);
        try {
          const updated = await api.updateTrainerProfile(activeUserId, {
            img: base64Image
          });
          if (updated) {
            setUserProfileData(updated);
          }
        } catch (err) {
          console.error("Failed uploading trainer avatar:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile inputs to MongoDB
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUserId) return;
    setIsSaving(true);
    try {
      const updated = await api.updateTrainerProfile(activeUserId, {
        name: profile.name,
        email: profile.email,
        spec: profile.spec,
        cert: profile.cert,
        bio: profile.bio
      });
      
      if (updated) {
        setUserProfileData(updated);
        setIsEditing(false);
        alert('Trainer profile saved successfully!');
      }
    } catch (err) {
      console.error("Trainer profile save failed:", err);
      alert("Failed saving updates to database.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full premium-bg text-[#0A0F24] font-sans relative overflow-x-hidden py-16 px-4 flex items-center justify-center">
      <BackgroundGlows />
      
      <div className="w-full max-w-2xl relative z-10">
        
        {/* FitX Logo Header Block */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-[#0A0F24] rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-[#00E5FF] rounded-sm rotate-45" />
            </div>
            <span className="font-sans text-2xl tracking-tighter text-[#0A0F24] uppercase font-black">
              fit<span className="text-[#00E5FF]">X</span>
            </span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0A0F24]/60">MASTER COACH CONSOLE</p>
        </div>

        {/* Coach Basic Info Card (Translucent White Glass) */}
        <div 
          className="rounded-[36px] shadow-[0_30px_70px_rgba(18,98,107,0.06)] overflow-hidden p-8 md:p-12 text-slate-800"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.65)'
          }}
        >
          
          {/* Top Info Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-[#12626b]/8 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-white/50 border-2 border-[#12626b]/30 overflow-hidden relative group-hover:border-[#12626b] transition-all shadow-sm">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-black text-[#12626b] bg-white/70">
                    {profile.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <label htmlFor="trainer-avatar-upload" className="absolute inset-0 bg-[#12626b]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity z-25">
                  <Camera className="w-6 h-6 text-white animate-pulse" />
                </label>
              </div>
              <input 
                id="trainer-avatar-upload"
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden" 
              />
            </div>

            <div className="text-center sm:text-left flex-grow">
              <span className="text-[9px] font-black text-[#12626b] tracking-[0.3em] uppercase bg-[#12626b]/8 px-4 py-1.5 rounded-full border border-[#12626b]/15 inline-block mb-3">
                {displayId}
              </span>
              <h2 className="text-3xl font-black tracking-tight text-slate-800 uppercase leading-none">{profile.name}</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 flex items-center gap-1.5 justify-center sm:justify-start">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#12626b]" /> Certified FitX Coach
              </p>
            </div>
          </div>

          {/* Form / Details Container */}
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block">FULL NAME</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <User className="w-4 h-4 text-[#12626b]" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                    className="w-full bg-white/45 border border-[#12626b]/12 disabled:opacity-75 disabled:cursor-not-allowed rounded-xl py-3.5 pl-12 pr-4 text-slate-800 font-bold text-sm outline-none focus:ring-1 focus:ring-[#12626b]/20 focus:border-[#12626b] transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block">EMAIL ADDRESS</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-4 h-4 text-[#12626b]" />
                  </div>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                    className="w-full bg-white/45 border border-[#12626b]/12 disabled:opacity-75 disabled:cursor-not-allowed rounded-xl py-3.5 pl-12 pr-4 text-slate-800 font-bold text-sm outline-none focus:ring-1 focus:ring-[#12626b]/20 focus:border-[#12626b] transition-all"
                  />
                </div>
              </div>

              {/* Specialization */}
              <div className="space-y-2">
                <label className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block">SPECIALIZATION</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Briefcase className="w-4 h-4 text-[#12626b]" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.spec}
                    onChange={(e) => setProfile({ ...profile, spec: e.target.value })}
                    required
                    className="w-full bg-white/45 border border-[#12626b]/12 disabled:opacity-75 disabled:cursor-not-allowed rounded-xl py-3.5 pl-12 pr-4 text-slate-800 font-bold text-sm outline-none focus:ring-1 focus:ring-[#12626b]/20 focus:border-[#12626b] transition-all"
                  />
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-2">
                <label className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block">CERTIFICATIONS</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Award className="w-4 h-4 text-[#12626b]" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.cert}
                    onChange={(e) => setProfile({ ...profile, cert: e.target.value })}
                    required
                    className="w-full bg-white/45 border border-[#12626b]/12 disabled:opacity-75 disabled:cursor-not-allowed rounded-xl py-3.5 pl-12 pr-4 text-slate-800 font-bold text-sm outline-none focus:ring-1 focus:ring-[#12626b]/20 focus:border-[#12626b] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Bio Details */}
            <div className="space-y-2 pt-2">
              <label className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block">COACH BIO / METHODOLOGY</label>
              <textarea
                disabled={!isEditing}
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-white/45 border border-[#12626b]/12 disabled:opacity-75 disabled:cursor-not-allowed rounded-xl p-4 text-slate-800 font-bold text-sm outline-none focus:ring-1 focus:ring-[#12626b]/20 focus:border-[#12626b] transition-all resize-none"
                placeholder="Share your coaching philosophy..."
              />
            </div>

            {/* Editing actions */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4 border-t border-[#12626b]/8 mt-8">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setProfile({
                        name: userProfileData?.name || 'Coach Master',
                        email: userProfileData?.email || 'trainer@fitx.com',
                        spec: userProfileData?.spec || 'Elite CrossFit Trainer',
                        cert: userProfileData?.cert || 'ACE-CPT Certified',
                        bio: userProfileData?.bio || 'Dedicated to push athletes beyond physical limits'
                      });
                    }}
                    className="flex-1 bg-[#12626b]/5 hover:bg-[#12626b]/10 text-[#12626b] font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest border border-[#12626b]/10 active:scale-95"
                  >
                    DISCARD CHANGES
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-[#12626b] to-[#15565e] text-white font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(18,98,107,0.15)] active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? 'SYNCHRONIZING...' : 'SAVE SYSTEM PROFILE'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-gradient-to-r from-[#12626b] to-[#15565e] text-white font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(18,98,107,0.15)] active:scale-95 text-center"
                  >
                    EDIT COACH PROFILE
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-grow-0 sm:px-8 bg-[#12626b]/5 hover:bg-red-500 hover:text-white border border-[#12626b]/10 text-red-600 py-4 rounded-2xl transition-all text-xs uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> DISCONNECT
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Security Footnote Banner */}
        <div className="mt-6 text-center">
          <p className="text-white/20 text-[8px] font-black uppercase tracking-widest leading-relaxed flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3 text-[#00E5FF]" /> FitX Secure Authentication Console • Live MongoDB Sync
          </p>
        </div>
      </div>
    </div>
  );
}
