import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
      (window as any).lenis.resize();
      
      const timer = setTimeout(() => {
        (window as any).lenis?.resize();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}
