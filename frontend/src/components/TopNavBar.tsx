import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { MapPinned, CircleUser, ChevronDown, Menu, X } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { motion, AnimatePresence } from 'motion/react';

export const TopNavBar = () => {
  const location = useLocation();
  const {
    selectedLocation,
    setIsLocationModalOpen,
    setIsLoginModalOpen,
    isLoggedIn,
    globalSettings,
    userProfileData,
    gymName
  } = useUI();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileLoginOpen, setIsMobileLoginOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'FITNESS', path: '/fitness' },
    { name: 'PROGRAMS', path: '/programs' },
    { name: 'MEMBERSHIPS', path: '/memberships' },
  ];
  const apiOrigin = ((import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:5000/api').replace(/\/api\/?$/, '');
  const normalizeAssetUrl = (url?: string) =>
    url ? url.replace(/^http:\/\/(?:localhost|127\.0\.0\.1):5000/i, apiOrigin) : '';
  const logoUrl = normalizeAssetUrl(
    globalSettings?.contentBlocks?.logo_url || globalSettings?.video || ''
  );

  const isScrollAwayPage =
    location.pathname.startsWith('/fitness') ||
    location.pathname === '/gallery' ||
    location.pathname.startsWith('/programs');

  return (
    <>
      <header className={cn(
        "w-full z-50 px-6 md:px-12 h-16 flex justify-between items-center transition-all duration-500",
        isScrollAwayPage ? "absolute" : "fixed",
        (location.pathname === '/' && !isScrolled) ? "bg-transparent" : "bg-black border-b border-white/5",
        !isScrollAwayPage && "top-0"
      )}>
        {/* Left: Logo */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center gap-2 group">
            {logoUrl ? (
              <img src={logoUrl} alt="FitX Logo" className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-4 h-4 bg-black rounded-sm rotate-45" />
                </div>
                <span className="font-sans text-xl md:text-2xl tracking-tighter text-white uppercase font-black">
                  {gymName === 'FitX' ? (
                    <>fit<span className="text-primary">X</span></>
                  ) : (
                    <>{gymName}</>
                  )}
                </span>
              </>
            )}
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => {
            const isActive = link.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => {
                  if (link.path === '/programs') {
                    sessionStorage.removeItem('fitx_programs_active_tab');
                    sessionStorage.removeItem('fitx_programs_scroll_y');
                  }
                }}
                className={cn(
                  "font-sans text-[13px] font-bold tracking-[0.1em] transition-all duration-300 relative py-1 hover:text-[#00E5FF]",
                  isActive ? "text-[#00E5FF]" : "text-white/60"
                )}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Utilities */}
        <div className="flex-1 flex items-center justify-end gap-4 md:gap-8">
          {/* Location Selector */}
          <div
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="font-sans text-[11px] font-bold text-white group-hover:text-primary uppercase tracking-widest transition-colors">
              {selectedLocation}
            </span>
            <MapPinned className="w-4 h-4 text-white group-hover:text-primary transition-colors" />
            <ChevronDown className="w-3 h-3 text-white/40" />
          </div>

          {/* Join Button (Get App Style) */}
          <button
            onClick={() => {
              const footer = document.querySelector('footer');
              footer?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:flex border border-white/30 text-white font-sans px-5 py-2 text-[11px] font-bold tracking-widest hover:bg-white hover:text-black transition-all rounded-[4px] uppercase"
          >
            GET APP
          </button>

          {/* Icons & Hamburger */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    navigate('/welcome');
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
                className={cn(
                  "transition-colors flex items-center gap-2 focus:outline-none p-1",
                  isLoggedIn ? "text-primary" : "text-white/70 hover:text-white"
                )}
              >
                <CircleUser className="w-6 h-6" />
                {isLoggedIn && userProfileData?.name && (
                  <span className="font-sans text-[11px] font-bold tracking-widest uppercase hidden md:inline-block">
                    {userProfileData.name.split(' ')[0]}
                  </span>
                )}
                {!isLoggedIn && <ChevronDown className="w-3 h-3 opacity-50" />}
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden text-white hover:text-primary transition-colors p-1"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 bg-[#0A0F24] border-b border-white/10 z-50 p-6 flex flex-col gap-6 md:hidden backdrop-blur-lg shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-sans text-lg font-black tracking-[0.15em] transition-all duration-300 py-2 uppercase"
                    style={{ color: isActive ? '#00E5FF' : '#ffffff' }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <hr className="border-white/10" />

            <div className="flex flex-col gap-4">
              {/* Location in Mobile Menu */}
              <div
                onClick={() => {
                  setIsLocationModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-between cursor-pointer group py-2"
              >
                <div className="flex items-center gap-2">
                  <MapPinned className="w-5 h-5 transition-colors" style={{ color: '#ffffff' }} />
                  <span className="font-sans text-sm font-black uppercase tracking-widest" style={{ color: '#ffffff' }}>
                    LOCATION: {selectedLocation}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
              </div>

              {/* Profile in Mobile Menu */}
              <div className="flex flex-col gap-1">
                <div
                  onClick={() => setIsMobileLoginOpen(!isMobileLoginOpen)}
                  className="flex items-center justify-between cursor-pointer py-2 group"
                >
                  <div className="flex items-center gap-3">
                    <CircleUser className="w-5 h-5" style={{ color: '#ffffff' }} />
                    <span className="font-sans text-sm font-black uppercase tracking-widest text-white group-hover:text-[#00E5FF] transition-colors">
                      {isLoggedIn ? "MY PROFILE" : "LOGIN / ACCESS"}
                    </span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isMobileLoginOpen ? "rotate-180" : "")} style={{ color: 'rgba(255,255,255,0.4)' }} />
                </div>

                <AnimatePresence>
                  {isMobileLoginOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pl-8 flex flex-col gap-2 border-l border-white/10"
                    >
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileLoginOpen(false);
                          if (isLoggedIn) {
                            navigate('/welcome');
                          } else {
                            setIsLoginModalOpen(true);
                          }
                        }}
                        className="py-2 text-left font-sans text-xs font-black tracking-widest text-white/60 hover:text-[#00E5FF] uppercase transition-colors"
                      >
                        • {isLoggedIn ? 'User Dashboard' : 'User Account Portal'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* GET APP in Mobile Menu */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const footer = document.querySelector('footer');
                  footer?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full border border-[#00E5FF] text-[#00E5FF] font-sans py-3 text-xs font-black tracking-widest transition-all rounded-lg uppercase text-center mt-2 bg-[#00E5FF]/10 hover:bg-[#00E5FF] hover:text-[#0A0F24]"
                style={{ color: '#00E5FF' }}
              >
                GET APP
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
