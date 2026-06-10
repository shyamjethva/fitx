import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, PageHeroData } from '../lib/api';

interface UIContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (val: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (val: boolean) => void;
  isFreeTrialModalOpen: boolean;
  setIsFreeTrialModalOpen: (val: boolean) => void;
  userRole: 'USER' | 'TRAINER';
  setUserRole: (val: 'USER' | 'TRAINER') => void;
  userProfileData: any;
  setUserProfileData: (val: any) => void;
  profileImage: string | null;
  setProfileImage: (val: string | null) => void;
  activeUserId: string | null;
  setActiveUserId: (val: string | null) => void;
  globalSettings: PageHeroData | null;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('fitx-token') !== null;
  });
  const [selectedLocation, setSelectedLocation] = useState('BANGALORE');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFreeTrialModalOpen, setIsFreeTrialModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<'USER' | 'TRAINER'>(() => {
    return (localStorage.getItem('fitx-role') as any) || 'USER';
  });
  const [userProfileData, setUserProfileData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('fitx-profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    return localStorage.getItem('fitx-avatar') || null;
  });
  const [activeUserId, setActiveUserId] = useState<string | null>(() => {
    return localStorage.getItem('fitx-userId') || null;
  });
  const [globalSettings, setGlobalSettings] = useState<PageHeroData | null>(null);

  useEffect(() => {
    const loadGlobalSettings = () => {
      api.getPageHeroes().then(data => {
        const globalHero = data.find(h => h.pageKey === 'global_settings');
        if (globalHero) setGlobalSettings(globalHero);
      }).catch(console.error);
    };

    loadGlobalSettings();
    const interval = window.setInterval(loadGlobalSettings, 15000);
    window.addEventListener('focus', loadGlobalSettings);
    document.addEventListener('visibilitychange', loadGlobalSettings);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', loadGlobalSettings);
      document.removeEventListener('visibilitychange', loadGlobalSettings);
    };
  }, []);

  useEffect(() => {
    const blocks = globalSettings?.contentBlocks || {};
    const root = document.documentElement;
    const primary = blocks.primary_color || '#00E5FF';
    const primaryLight = blocks.accent_color || '#33EBFF';
    const background = blocks.background_color || '#F8FAFC';
    const textColor = blocks.text_color || '#0A0F24';
    const headingFont = blocks.heading_font || '"Montserrat", sans-serif';
    const bodyFont = blocks.body_font || '"Poppins", sans-serif';

    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-primary-light', primaryLight);
    root.style.setProperty('--color-blue-500', primary);
    root.style.setProperty('--color-cyan-500', primary);
    root.style.setProperty('--cms-primary', primary);
    root.style.setProperty('--cms-primary-light', primaryLight);
    root.style.setProperty('--cms-background', background);
    root.style.setProperty('--cms-text', textColor);
    root.style.setProperty('--font-headline', headingFont);
    root.style.setProperty('--font-sans', bodyFont);
    document.body.style.backgroundColor = background;
    document.body.style.color = textColor;
    document.body.style.fontFamily = bodyFont;
  }, [globalSettings]);

  // Keep persistence layers synchronized on any modification
  React.useEffect(() => {
    if (isLoggedIn) {
      if (userRole) localStorage.setItem('fitx-role', userRole);
      if (activeUserId) localStorage.setItem('fitx-userId', activeUserId);
      if (profileImage) localStorage.setItem('fitx-avatar', profileImage);
      if (userProfileData) localStorage.setItem('fitx-profile', JSON.stringify(userProfileData));
    } else {
      // Complete session wipeout
      localStorage.removeItem('fitx-token');
      localStorage.removeItem('fitx-role');
      localStorage.removeItem('fitx-profile');
      localStorage.removeItem('fitx-avatar');
      localStorage.removeItem('fitx-userId');
    }
  }, [isLoggedIn, userRole, activeUserId, profileImage, userProfileData]);

  return (
    <UIContext.Provider value={{
      isLoggedIn, setIsLoggedIn,
      selectedLocation, setSelectedLocation,
      isLoginModalOpen, setIsLoginModalOpen,
      isLocationModalOpen, setIsLocationModalOpen,
      isFreeTrialModalOpen, setIsFreeTrialModalOpen,
      userRole, setUserRole,
      userProfileData, setUserProfileData,
      profileImage, setProfileImage,
      activeUserId, setActiveUserId,
      globalSettings
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
