/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TopNavBar } from './components/TopNavBar';
import { Footer } from './components/Footer';
import GlobalQRWidget from './components/GlobalQRWidget';
import Home from './pages/Home';
import About from './pages/About';
import Trainers from './pages/Trainers';
import Memberships from './pages/Memberships';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Fitness from './pages/Fitness';
import Blogs from './pages/Blogs';
import Gallery from './pages/Gallery';
import FitXElite from './pages/FitXElite';
import FitXPro from './pages/FitXPro';
import FitXHome from './pages/FitXHome';
import FitXTransform from './pages/FitXTransform';
import Bootcamp from './pages/Bootcamp';
import Welcome from './pages/Welcome';
import {
  TransformPlus,
  LuxuryGyms
} from './pages/FitnessCategories';
import Careers from './pages/Careers';
import Security from './pages/Security';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';

import { useUI, UIProvider } from './context/UIContext';
import { LoginModal } from './components/LoginModal';
import { LocationModal } from './components/LocationModal';
import { FreeTrialModal } from './components/FreeTrialModal';
import ScrollToTop from './components/ScrollToTop';

function AppContent() {
  const location = useLocation();
  const { isLoggedIn, setIsLoginModalOpen } = useUI();
  
  // Login Popup Timer Logic
  useEffect(() => {
    if (isLoggedIn) return;

    let interval: ReturnType<typeof setInterval>;
    
    const timeout = setTimeout(() => {
      if (!isLoggedIn) {
        setIsLoginModalOpen(true);
        interval = setInterval(() => {
          if (!isLoggedIn) setIsLoginModalOpen(true);
        }, 120000);
      }
    }, 30000);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [isLoggedIn, setIsLoginModalOpen]);

  // Hide global elements on dashboard/welcome routes
  const isIsolatedRoute = ['/dashboard', '/schedule', '/welcome'].includes(location.pathname);

  // Premium smooth scroll initialization
  useEffect(() => {
    // Pause/destroy Lenis on isolated dashboard screens to enable absolute browser sub-element scrolling
    if (isIsolatedRoute) {
      if ((window as any).lenis) {
        (window as any).lenis.destroy();
        delete (window as any).lenis;
      }
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1.1,
    });

    (window as any).lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, [isIsolatedRoute]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-[#D8DCDF] font-sans antialiased selection:bg-[#FF7200] selection:text-black">
      {!isIsolatedRoute && <TopNavBar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/contactus" element={<Contact />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/fitness/elite" element={<FitXElite />} />
          <Route path="/fitness/pro" element={<FitXPro />} />
          <Route path="/fitness/home" element={<FitXHome />} />
          <Route path="/fitness/transform" element={<FitXTransform />} />
          <Route path="/fitness/bootcamp" element={<Bootcamp />} />
          <Route path="/fitness/transform-plus" element={<TransformPlus />} />
          <Route path="/fitness/luxury-gyms" element={<LuxuryGyms />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:slug" element={<ProgramDetail />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedule" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/security" element={<Security />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isIsolatedRoute && <Footer />}
      {!isIsolatedRoute && <GlobalQRWidget />}

      {/* Modals */}
      <LoginModal />
      <LocationModal />
      <FreeTrialModal />
    </div>
  );
}

export default function App() {
  return (
    <UIProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </UIProvider>
  );
}


