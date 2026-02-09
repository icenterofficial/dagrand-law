import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Scale } from 'lucide-react';

const MotionDiv = motion.div as any;

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // 1. Listen for the native event (Works in real Android/Chrome environment)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 2. DEMO FALLBACK: Force show after 3 seconds if not installed
    // (This ensures you see the UI in AI Studio / Preview environments)
    const timer = setTimeout(() => {
       setIsVisible(_prev => {
           // Only show if not already showing and not installed
           return true; 
       });
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsVisible(false);
      }
    } else {
      // Manual instruction for Preview/Desktop where native prompt is missing
      alert("To install: Click the 'Install' icon in your browser address bar (top right) or 'Add to Home Screen' in your mobile browser menu.");
      setIsVisible(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // If already installed as an app, don't show anything
  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionDiv
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-[380px] z-[100]"
        >
          {/* Main Glass Card */}
          <div className="relative overflow-hidden rounded-2xl bg-[#0f2b4a]/90 backdrop-blur-xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] group">
            
            {/* Ambient Lighting Effect */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-gold/20 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-navy/50 rounded-full blur-[40px] pointer-events-none"></div>

            <div className="p-5 relative z-10">
                {/* Header Row: Close Button */}
                <button 
                    onClick={handleClose} 
                    className="absolute top-3 right-3 p-1.5 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
                >
                    <X className="h-3.5 w-3.5" />
                </button>

                <div className="flex gap-4">
                    {/* App Icon Simulation */}
                    <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-navy to-black border border-white/10 shadow-lg flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                             {/* Inner Shine */}
                             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
                             <Scale className="h-6 w-6 text-brand-gold relative z-10" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 pt-0.5 pr-6">
                        <h4 className="text-white font-serif font-bold text-base tracking-wide">Install Application</h4>
                        <p className="text-gray-300 text-xs mt-1 leading-relaxed font-light">
                            Add <span className="text-brand-gold font-medium">Dagrand Law</span> to your home screen for faster access.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-5">
                    <button 
                        onClick={handleInstallClick}
                        className="flex-1 bg-gradient-to-r from-brand-gold to-[#d4af37] text-white text-xs font-bold uppercase tracking-widest py-2.5 px-4 rounded-lg shadow-lg shadow-brand-gold/20 hover:shadow-brand-gold/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Download className="h-3.5 w-3.5" /> Install App
                    </button>
                    <button 
                        onClick={handleClose}
                        className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                        Not Now
                    </button>
                </div>
            </div>
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};