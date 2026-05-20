import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, ArrowRight, User, Mail, Activity, Award, Camera, Phone, AlertTriangle } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { api } from '../lib/api';

export const LoginModal = () => {
  const { 
    isLoginModalOpen, setIsLoginModalOpen, setIsLoggedIn, 
    setUserRole, setUserProfileData, profileImage, setProfileImage,
    setActiveUserId
  } = useUI();
  const navigate = useNavigate();

  // Modes: login OR register
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState<'USER' | 'TRAINER'>('USER');
  const [spec, setSpec] = useState('');
  const [cert, setCert] = useState('');

  if (!isLoginModalOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setPhoneNumber('');
    setSpec('');
    setCert('');
    setErrorMsg(null);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setErrorMsg(null);
  };

  // LOGIN LOGIC
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await api.login(email, password);
      
      if (response && response.success && response.token) {
        // Save session locally
        localStorage.setItem('fitx-token', response.token);
        
        // Set active context
        setUserRole(response.role as any);
        setUserProfileData(response.data);
        setActiveUserId(response.data.id || response.data._id);
        if (response.data.avatar) setProfileImage(response.data.avatar);
        
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        resetForm();
        navigate('/welcome');
      } else {
        setErrorMsg('Authentication server returned invalid signal.');
      }
    } catch (err: any) {
      console.error('Login failure:', err);
      setErrorMsg(err.message || 'Invalid credentials. Access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER LOGIC
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const payload = {
      name: fullName,
      email: email.toLowerCase().trim(),
      phone: phoneNumber,
      password,
      role: selectedRole,
      spec: selectedRole === 'TRAINER' ? spec : undefined,
      cert: selectedRole === 'TRAINER' ? cert : undefined,
      avatar: profileImage || undefined
    };

    try {
      const response = await api.registerProfile(payload);
      
      if (response && response.success && response.token) {
        // Save session
        localStorage.setItem('fitx-token', response.token);
        
        // Update context state
        setUserRole(response.role as any);
        setUserProfileData(response.data);
        setActiveUserId(response.data.id || response.data._id);
        
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        resetForm();
        navigate('/welcome');
      } else {
        setErrorMsg('Registration process met unexpected database conflict.');
      }
    } catch (err: any) {
      console.error('Registration failure:', err);
      // Unique constraints explicitly return nice names
      setErrorMsg(err.message || 'Profile generation failed. Credentials in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsLoginModalOpen(false);
            setTimeout(() => resetForm(), 300);
          }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          layout
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          data-lenis-prevent
          className="auth-modal relative w-full max-w-md bg-[#1c1c1c] border border-white/10 rounded-[32px] shadow-[0_32px_64px_rgba(0,0,0,0.5)] z-10 flex flex-col max-h-[92vh] overflow-y-auto scrollbar-hide"
        >
          {/* Glow accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E5FF] via-cyan-500 to-[#00E5FF]" />

          <div className="p-8 pb-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00E5FF] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                <div className="w-4 h-4 bg-black rounded-sm rotate-45" />
              </div>
              <span className="font-sans text-xl tracking-tighter text-white uppercase font-black">
                fit<span className="text-[#00E5FF]">X</span>
              </span>
            </div>
            <button 
              onClick={() => {
                setIsLoginModalOpen(false);
                setTimeout(() => resetForm(), 300);
              }}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white/40" />
            </button>
          </div>

          {/* Error notification ribbon */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
                className="px-8"
              >
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 text-red-500 mb-2">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider leading-tight">Security Alert</p>
                    <p className="text-[11px] font-medium mt-1 leading-relaxed text-white/80">{errorMsg}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-8 pt-4">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 leading-tight">
              {mode === 'login' ? 'Access\nYour Vault' : 'Join the\nMovement'}
            </h2>
            <p className="text-white/40 text-xs font-bold mb-6 uppercase tracking-widest">
              {mode === 'login' ? 'Enter email and password' : 'Create a FitX master profile'}
            </p>

            <form onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
              
              {/* Registration Exclusive Fields */}
              {mode === 'register' && (
                <>
                  {/* Avatar Upload */}
                  <div className="flex justify-center mb-2">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-[1.5rem] bg-black/30 border-2 border-white/10 flex items-center justify-center overflow-hidden relative group-hover:border-[#00E5FF] transition-colors shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-white/20 flex flex-col items-center gap-1">
                            <Camera className="w-6 h-6 opacity-40" />
                            <span className="text-[7px] font-black tracking-wider text-[#00E5FF] uppercase">ADD PHOTO</span>
                          </div>
                        )}
                        <label htmlFor="profile-upload-modal" className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                          <Camera className="w-5 h-5 text-white" />
                        </label>
                      </div>
                      <input 
                        id="profile-upload-modal"
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="hidden" 
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 border-r border-white/10 pr-3">
                      <User className="w-4 h-4 text-[#00E5FF]" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-14 pr-4 text-white font-bold text-sm focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 border-r border-white/10 pr-3">
                      <Phone className="w-4 h-4 text-[#00E5FF]" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Mobile Number (eg. 9876543210)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-14 pr-4 text-white font-bold text-sm focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 outline-none transition-all"
                    />
                  </div>
                </>
              )}

              {/* Common Email Field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 border-r border-white/10 pr-3">
                  <Mail className="w-4 h-4 text-[#00E5FF]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address (eg. user@gmail.com)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-14 pr-4 text-white font-bold text-sm focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 outline-none transition-all"
                />
              </div>

              {/* Common Password Field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 border-r border-white/10 pr-3">
                  <Lock className="w-4 h-4 text-[#00E5FF]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'login' ? 'Password' : 'Set Account Password'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-14 pr-4 text-white font-bold text-sm tracking-wide focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 outline-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00E5FF] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white text-black font-black py-4 mt-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase shadow-[0_10px_25px_rgba(0,229,255,0.25)] active:scale-95"
              >
                {isLoading ? 'Processing Gateway...' : mode === 'login' ? 'AUTHENTICATE & ENTER' : 'GENERATE FITX PROFILE'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Toggle Link */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#00E5FF] transition-colors"
              >
                {mode === 'login' ? "Don't have an account? Create One" : 'Already registered? Login Here'}
              </button>
            </div>
          </div>

          {/* Bottom banner */}
          <div className="px-8 pb-8">
            <div className="pt-6 border-t border-white/5">
              <p className="text-white/20 text-[8px] text-center font-bold uppercase tracking-widest leading-relaxed">
                FitX Advanced Security Stack • Encrypted Session
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
