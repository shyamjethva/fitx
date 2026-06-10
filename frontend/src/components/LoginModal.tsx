import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, ArrowRight, User, Mail, Activity, Award, Camera, Phone, AlertTriangle } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { api } from '../lib/api';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

export const LoginModal = () => {
  const { isLoginModalOpen } = useUI();
  if (!isLoginModalOpen) return null;
  
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "placeholder-client-id"}>
      <LoginModalContent />
    </GoogleOAuthProvider>
  );
};

const LoginModalContent = () => {
  const { 
    setIsLoginModalOpen, setIsLoggedIn, 
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
  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        if (tokenResponse.access_token) {
          // Since we are using Implicit flow with custom UI, we send access_token to backend
          const response = await api.googleLogin(tokenResponse.access_token);
          if (response && response.success && response.token) {
            localStorage.setItem('fitx-token', response.token);
            setUserRole(response.role as any);
            setUserProfileData(response.data);
            setActiveUserId(response.data.id || response.data._id);
            if (response.data.avatar) setProfileImage(response.data.avatar);
            
            setIsLoggedIn(true);
            setIsLoginModalOpen(false);
            resetForm();
          } else {
            setErrorMsg('Google authentication server returned invalid signal.');
          }
        }
      } catch (err: any) {
        console.error('Google Login failure:', err);
        setErrorMsg(err.message || 'Google Auth failed. Access denied.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setErrorMsg('Google Sign-In was unsuccessful.');
    }
  });

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
                className="w-full bg-[#00E5FF] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white text-black hover:text-black force-hover-text-black font-black py-4 mt-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase shadow-[0_10px_25px_rgba(0,229,255,0.25)] active:scale-95"
              >
                {isLoading ? 'Processing Gateway...' : mode === 'login' ? 'AUTHENTICATE & ENTER' : 'GENERATE FITX PROFILE'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Google Login Divider */}
            <div className="relative mt-6 mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#1c1c1c] px-4 text-white/40 font-bold uppercase tracking-widest">Or</span>
              </div>
            </div>

            {/* Google Login Button */}
            <div className="flex justify-center w-full">
              <button
                type="button"
                onClick={() => handleGoogleAuth()}
                className="w-full bg-white/5 hover:bg-white hover:text-black border border-white/10 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                CONTINUE WITH GOOGLE
              </button>
            </div>

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
