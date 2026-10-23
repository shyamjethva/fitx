import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, Shield, Activity, LogOut, Camera, CheckCircle2, Award } from 'lucide-react';
import BackgroundGlows from '../components/BackgroundGlows';
import { useUI } from '../context/UIContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function Dashboard() {
  const { 
    setIsLoggedIn, userRole, profileImage, setProfileImage, 
    activeUserId, userProfileData, setUserProfileData 
  } = useUI();
  const navigate = useNavigate();

  // Active user ID for display
  const displayId = activeUserId ? `FITX-${activeUserId.slice(-6).toUpperCase()}` : 'FITX-GUEST';

  // Form states loaded from context and synchronized
  const [profile, setProfile] = useState({ 
    name: userProfileData?.name || 'Active Member', 
    email: userProfileData?.email || 'member@fitx.com', 
    phone: userProfileData?.phone || '+91 99999 99999', 
    bio: userProfileData?.appliedProgram || 'Fitness enthusiast | Dedicated to daily heavy lifting' 
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfileData) {
      setProfile({
        name: userProfileData.name || 'Active Member',
        email: userProfileData.email || 'member@fitx.com',
        phone: userProfileData.phone || '+91 99999 99999',
        bio: userProfileData.appliedProgram || 'Fitness enthusiast | Dedicated to daily heavy lifting'
      });
    }
  }, [userProfileData]);

  // Upload/change profile avatar
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUserId) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setProfileImage(base64Image);
        try {
          const updated = await api.updateUserProfile(activeUserId, {
            avatar: base64Image
          });
          if (updated) {
            setUserProfileData(updated);
          }
        } catch (err) {
          console.error("Failed uploading profile avatar:", err);
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
      const updated = await api.updateUserProfile(activeUserId, {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        appliedProgram: profile.bio
      });
      
      if (updated) {
        setUserProfileData(updated);
        setIsEditing(false);
        alert('Profile saved successfully!');
      }
    } catch (err) {
      console.error("Profile save failed:", err);
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
    <div className="min-h-screen w-full font-sans relative overflow-x-hidden py-16 px-4 flex items-center justify-center" style={{ backgroundImage: 'url(/3d_gym_person.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      
      <div className="w-full max-w-2xl relative z-10">
        
        {/* FitX Logo Header Block */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white/90 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-[#FFA040] rounded-sm rotate-45" />
            </div>
            <span className="font-sans text-2xl tracking-tighter text-white uppercase font-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              fit<span className="text-[#FFA040]">X</span>
            </span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/80 drop-shadow-md">MASTER USER CONSOLE</p>
        </div>

        {/* User Basic Info Card (Glassmorphism) */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/40 shadow-[0_8px_32px_0_rgba(255, 160, 64,0.3)] overflow-hidden p-8 md:p-12 text-white">
          
          {/* Top Info Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-white/30 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/60 overflow-hidden relative group-hover:border-[#FFA040] transition-all shadow-xl">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-black text-[#FFA040] bg-[#0A0F24]">
                    {profile.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <label htmlFor="dashboard-avatar-upload" className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <Camera className="w-6 h-6 text-white animate-pulse" />
                </label>
              </div>
              <input 
                id="dashboard-avatar-upload"
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden" 
              />
            </div>

            <div className="text-center sm:text-left flex-grow">
              <span className="text-[9px] font-black text-[#FFA040] tracking-[0.3em] uppercase bg-[#FFA040]/10 px-3 py-1 rounded-full border border-[#FFA040]/20 inline-block mb-2">
                {displayId}
              </span>
              <h2 className="text-3xl font-black tracking-tight text-white uppercase leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{profile.name}</h2>
              <p className="text-xs font-bold text-white/80 uppercase tracking-widest mt-1.5 flex items-center gap-1.5 justify-center sm:justify-start drop-shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFA040]" /> Active Member Status
              </p>
            </div>
          </div>

          {/* Form / Details Container */}
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="flex flex-col gap-6">
              
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[8px] font-black text-white/80 uppercase tracking-widest block drop-shadow-md">FULL NAME</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <User className="w-4 h-4 text-[#FFA040]" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-inner disabled:opacity-75 disabled:cursor-not-allowed rounded-xl py-3.5 pl-12 pr-4 text-white font-bold text-sm outline-none focus:ring-2 focus:ring-[#FFA040] transition-all drop-shadow-md placeholder:text-white/60"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[8px] font-black text-white/80 uppercase tracking-widest block drop-shadow-md">EMAIL ADDRESS</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-4 h-4 text-[#FFA040]" />
                  </div>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-inner disabled:opacity-75 disabled:cursor-not-allowed rounded-xl py-3.5 pl-12 pr-4 text-white font-bold text-sm outline-none focus:ring-2 focus:ring-[#FFA040] transition-all drop-shadow-md placeholder:text-white/60"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[8px] font-black text-white/80 uppercase tracking-widest block drop-shadow-md">MOBILE NUMBER</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Phone className="w-4 h-4 text-[#FFA040]" />
                  </div>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    required
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-inner disabled:opacity-75 disabled:cursor-not-allowed rounded-xl py-3.5 pl-12 pr-4 text-white font-bold text-sm outline-none focus:ring-2 focus:ring-[#FFA040] transition-all drop-shadow-md placeholder:text-white/60"
                  />
                </div>
              </div>

              {/* Membership Plan */}
              <div className="space-y-2">
                <label className="text-[8px] font-black text-white/80 uppercase tracking-widest block drop-shadow-md">ACTIVE MEMBERSHIP PLAN</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Award className="w-4 h-4 text-[#FFA040]" />
                  </div>
                  <input
                    type="text"
                    disabled
                    value={`${userProfileData?.activePlan || 'FITX ELITE'} (${userProfileData?.planDuration || '12 MONTHS'})`}
                    className="w-full bg-white/5 backdrop-blur-sm border border-white/20 opacity-80 rounded-xl py-3.5 pl-12 pr-4 text-white font-bold text-sm outline-none cursor-not-allowed drop-shadow-sm shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Bio Details */}
            <div className="space-y-2 pt-2">
              <label className="text-[8px] font-black text-white/80 uppercase tracking-widest block drop-shadow-md">PERSONAL BIO / FITNESS FOCUS</label>
              <textarea
                disabled={!isEditing}
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-inner disabled:opacity-75 disabled:cursor-not-allowed rounded-xl p-4 text-white font-bold text-sm outline-none focus:ring-2 focus:ring-[#FFA040] transition-all drop-shadow-md placeholder:text-white/60 resize-none"
                placeholder="Share your active fitness goals..."
              />
            </div>

            {/* Editing actions */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4 border-t border-white/30 mt-8">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setProfile({
                        name: userProfileData?.name || 'Active Member',
                        email: userProfileData?.email || 'member@fitx.com',
                        phone: userProfileData?.phone || '+91 99999 99999',
                        bio: userProfileData?.appliedProgram || 'Fitness enthusiast | Dedicated to daily heavy lifting'
                      });
                    }}
                    className="flex-1 bg-white/5 hover:bg-white hover:text-black force-hover-text-black text-white font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest border border-white/5 active:scale-95"
                  >
                    DISCARD CHANGES
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-[#FFA040] hover:bg-white text-black hover:text-black force-hover-text-black font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(255, 160, 64,0.25)] active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? 'SYNCHRONIZING...' : 'SAVE SYSTEM PROFILE'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-[#FFA040] hover:bg-white text-black hover:text-black force-hover-text-black font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(255, 160, 64,0.25)] active:scale-95 text-center"
                  >
                    EDIT ACCOUNT DETAILS
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-grow-0 sm:px-8 bg-white/5 hover:bg-[#FFA040] hover:text-black border border-white/5 hover:border-[#FFA040] text-white font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2"
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
          <p className="text-white/80 text-[8px] font-black uppercase tracking-widest leading-relaxed flex items-center justify-center gap-1.5 drop-shadow-md">
            <Shield className="w-3 h-3 text-[#FFA040]" /> FitX Secure Authentication Console • Live MongoDB Sync
          </p>
        </div>
      </div>
    </div>
  );
}
