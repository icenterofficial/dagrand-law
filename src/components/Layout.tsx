import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Phone, Mail, Clock, Linkedin, ChevronRight, Settings, Moon, Sun, Home, Info, Users, Briefcase, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONTACT_INFO } from '../../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { InstallPWA } from './InstallPWA';
import { FloatingContact } from './FloatingContact';

// Define Variants type locally to avoid import errors
type Variants = {
  [key: string]: {
    [key: string]: any;
  };
};

const MotionDiv = motion.div as any;

const SettingsPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { theme, toggleTheme, fontSize, setFontSize } = useTheme();
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute top-14 right-0 w-72 bg-white dark:bg-[#0f2b4a] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl p-5 z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('displaySettings')}</span>
         <button onClick={onClose} className="text-gray-400 hover:text-brand-gold transition-colors">
            <X className="h-4 w-4" />
         </button>
      </div>

      {/* Theme Toggle - Clean Segmented Control */}
      <div className="bg-gray-100 dark:bg-black/20 p-1 rounded-xl flex items-center relative mb-6">
          {/* Active Slider Background */}
          <MotionDiv 
            layout
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-brand-navy shadow-sm rounded-lg"
            initial={false}
            animate={{ x: theme === 'dark' ? '100%' : '0%' }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
          
          <button 
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg relative z-10 text-sm font-bold transition-colors ${theme === 'light' ? 'text-brand-navy' : 'text-gray-500 dark:text-gray-400'}`}
          >
             <Sun className="h-4 w-4" /> {t('light')}
          </button>
          <button 
            onClick={() => theme === 'light' && toggleTheme()}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg relative z-10 text-sm font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-500'}`}
          >
             <Moon className="h-4 w-4" /> {t('dark')}
          </button>
      </div>

      {/* Font Size - Visual 'Aa' Scale (Cleaner than buttons) */}
      <div>
         <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-brand-navy dark:text-white">{t('textSize')}</span>
            <span className="text-xs text-gray-400">{fontSize === 'normal' ? t('default') : fontSize === 'large' ? '115%' : '130%'}</span>
         </div>
         
         <div className="flex items-center justify-between bg-gray-100 dark:bg-black/20 rounded-xl px-2 py-2">
             <button 
               onClick={() => setFontSize('normal')}
               className={`w-full h-10 flex items-center justify-center rounded-lg transition-all ${fontSize === 'normal' ? 'bg-white dark:bg-brand-gold shadow-sm text-brand-navy dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
             >
               <span className="text-sm font-bold">Aa</span>
             </button>
             
             <div className="h-4 w-[1px] bg-gray-300 dark:bg-white/10 mx-1"></div>

             <button 
               onClick={() => setFontSize('large')}
               className={`w-full h-10 flex items-center justify-center rounded-lg transition-all ${fontSize === 'large' ? 'bg-white dark:bg-brand-gold shadow-sm text-brand-navy dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
             >
               <span className="text-lg font-bold">Aa</span>
             </button>

             <div className="h-4 w-[1px] bg-gray-300 dark:bg-white/10 mx-1"></div>

             <button 
               onClick={() => setFontSize('xl')}
               className={`w-full h-10 flex items-center justify-center rounded-lg transition-all ${fontSize === 'xl' ? 'bg-white dark:bg-brand-gold shadow-sm text-brand-navy dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
             >
               <span className="text-xl font-bold">Aa</span>
             </button>
         </div>
      </div>
    </MotionDiv>
  );
};

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-white/5 border border-white/20 rounded-full p-1 backdrop-blur-sm">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-300 ${
          language === 'en' 
            ? 'bg-brand-gold text-white shadow-sm' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('cn')}
        className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-300 ${
          language === 'cn' 
            ? 'bg-brand-gold text-white shadow-sm' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        中文
      </button>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { t } = useLanguage();
  const { theme, toggleTheme, fontSize, setFontSize } = useTheme();
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close setting popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: t('home'), path: '/', icon: Home },
    { name: t('about'), path: '/about', icon: Info },
    { name: t('team'), path: '/team', icon: Users },
    { name: t('practice'), path: '/practice-areas', icon: Briefcase },
    { name: t('updates'), path: '/updates', icon: FileText },
    { name: t('contact'), path: '/contact', icon: Phone },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  // Sidebar Framer Motion Variants (Updated for Right Side)
  const sidebarVariants: Variants = {
    closed: { 
        x: "100%", // Start off-screen right
        transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
    open: { 
        x: 0, 
        transition: { 
            type: "spring", stiffness: 300, damping: 30,
            staggerChildren: 0.05,
            delayChildren: 0.1
        } 
    }
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, x: 20 }, // Slide slightly from right
    open: { opacity: 1, x: 0 }
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className={`absolute inset-0 bg-brand-navy dark:bg-brand-dark transition-opacity duration-300 ${scrolled ? 'opacity-95' : 'opacity-0 bg-gradient-to-b from-brand-navy/90 to-transparent'}`}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <img 
                src="https://raw.githubusercontent.com/icenterofficial/dagrand/refs/heads/main/public/assets/images/logo.png" 
                alt="Dagrand Law Office" 
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-1 py-2 text-sm font-medium tracking-wide transition-colors duration-200 group ${
                      active ? 'text-brand-gold' : 'text-gray-200 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold transform origin-center transition-transform duration-300 ease-out ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  </Link>
                );
              })}
              
              {/* Divider */}
              <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
              
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Settings Trigger for Desktop */}
              <div className="relative" ref={settingsRef}>
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${isSettingsOpen ? 'bg-brand-gold text-white rotate-90' : 'text-white/80 hover:bg-white/10 hover:text-brand-gold'}`}
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <AnimatePresence>
                     {isSettingsOpen && <SettingsPopup isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
                  </AnimatePresence>
              </div>

            </div>
          </div>
          <div className="-mr-2 flex lg:hidden items-center gap-3">
            {/* Mobile Language Switcher */}
            <LanguageSwitcher />

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
            />

            {/* Right Drawer */}
            <MotionDiv
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              // Fixed h-[100dvh] prevents cut-off on mobile scroll
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-brand-navy dark:bg-[#0f1d30] z-[100] shadow-2xl flex flex-col lg:hidden border-l border-white/10 h-[100dvh]"
            >
                {/* Drawer Header */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 bg-black/10 shrink-0">
                    <img 
                      src="https://raw.githubusercontent.com/icenterofficial/dagrand/refs/heads/main/public/assets/images/logo.png" 
                      alt="Dagrand Law Office" 
                      className="h-10 w-auto object-contain"
                    />
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Scrollable Links Area */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navLinks.map((link) => {
                        const active = isActive(link.path);
                        return (
                            <MotionDiv key={link.path} variants={itemVariants}>
                                <Link
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 group ${
                                        active 
                                        ? 'bg-brand-gold text-white shadow-lg' 
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <link.icon className={`h-5 w-5 ${active ? 'text-white' : 'text-brand-gold group-hover:text-white transition-colors'}`} />
                                    <span className="text-sm font-bold tracking-wide">{link.name}</span>
                                    {active && <ChevronRight className="h-4 w-4 ml-auto opacity-70" />}
                                </Link>
                            </MotionDiv>
                        );
                    })}
                </div>

                {/* Drawer Footer (Settings) - Removed Lang Switcher from here */}
                <div className="p-6 border-t border-white/10 bg-black/20 shrink-0">
                    
                    {/* Settings Controls */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme}
                            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3 active:scale-95 transition-all hover:bg-white/10"
                        >
                            {theme === 'dark' ? <Moon className="h-4 w-4 text-brand-gold" /> : <Sun className="h-4 w-4 text-brand-gold" />}
                            <span className="text-xs font-bold text-gray-300">{theme === 'dark' ? t('dark') : t('light')}</span>
                        </button>

                        {/* Font Size Toggle */}
                        <button 
                            onClick={() => {
                                const next = fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xl' : 'normal';
                                setFontSize(next);
                            }}
                            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3 active:scale-95 transition-all hover:bg-white/10"
                        >
                            <span className="font-serif font-bold text-brand-gold text-sm">Aa</span>
                            <span className="text-xs font-bold text-gray-300">{fontSize === 'normal' ? 'Std' : fontSize === 'large' ? 'Lg' : 'XL'}</span>
                        </button>
                    </div>
                </div>
            </MotionDiv>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const { t, getContent } = useLanguage();
  const address = getContent(CONTACT_INFO.address, CONTACT_INFO.address_cn);
  const hours = getContent(CONTACT_INFO.businessHours, CONTACT_INFO.businessHours_cn);

  return (
    <footer className="bg-brand-dark text-gray-400 pt-16 pb-8 border-t border-brand-navy/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              
              {/* Column 1: Brand */}
              <div className="space-y-6">
                  <Link to="/" className="inline-block">
                      <img 
                        src="https://raw.githubusercontent.com/icenterofficial/dagrand/refs/heads/main/public/assets/images/logo.png" 
                        alt="Dagrand Law Office" 
                        className="h-12 w-auto object-contain"
                      />
                  </Link>
                  <p className="text-sm leading-relaxed text-gray-400">
                      {t('footerDesc')}
                  </p>
                  <div className="flex gap-4">
                      <a href={CONTACT_INFO.linkedin} target="_blank" rel="noreferrer" className="bg-brand-navy p-2 rounded-full hover:bg-brand-gold hover:text-brand-navy hover:-translate-y-1 transition-all duration-300 shadow-md">
                          <Linkedin className="h-4 w-4" />
                      </a>
                  </div>
              </div>

              {/* Column 2: Links */}
              <div>
                  <h3 className="text-white font-serif font-bold text-lg mb-6">{t('quickLinks')}</h3>
                  <ul className="space-y-3 text-sm">
                      {[
                          { name: t('home'), path: '/' },
                          { name: t('about'), path: '/about' },
                          { name: t('team'), path: '/team' },
                          { name: t('practice'), path: '/practice-areas' },
                      ].map((link) => (
                          <li key={link.path}>
                              <Link to={link.path} className="flex items-center gap-2 hover:text-brand-gold hover:translate-x-1 transition-all duration-300">
                                  <ChevronRight className="h-3 w-3 text-brand-gold" />
                                  {link.name}
                              </Link>
                          </li>
                      ))}
                  </ul>
              </div>

              {/* Column 3: Contact */}
              <div className="lg:col-span-2">
                  <h3 className="text-white font-serif font-bold text-lg mb-6">{t('contactInfo')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-4">
                          <div className="flex items-start gap-3">
                              <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                              <span>{address}</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-brand-gold shrink-0" />
                              <span>{hours}</span>
                          </div>
                      </div>
                      <div className="space-y-4">
                          <div className="flex items-start gap-3">
                              <Phone className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                              <div className="flex flex-col gap-1">
                                  {CONTACT_INFO.phones.map((phone, idx) => (
                                      <span key={idx} className="hover:text-white transition-colors cursor-default"><span className="text-xs text-gray-500 mr-2 uppercase">{phone.label}:</span>{phone.number}</span>
                                  ))}
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-brand-gold shrink-0" />
                              <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors underline decoration-transparent hover:decoration-brand-gold underline-offset-4 duration-300">{CONTACT_INFO.email}</a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
              <p>&copy; {new Date().getFullYear()} Dagrand Law Office. {t('rightsReserved')}</p>
              <div className="flex gap-6">
                  <span className="hover:text-gray-300 cursor-pointer transition-colors">{t('privacyPolicy')}</span>
                  <span className="hover:text-gray-300 cursor-pointer transition-colors">{t('termsOfService')}</span>
                  <Link to="/admin" className="hover:text-brand-gold cursor-pointer transition-colors">{t('adminLogin')}</Link>
              </div>
          </div>
      </div>
    </footer>
  );
};

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-brand-dark transition-colors duration-300 selection:bg-brand-gold/30 relative">
            <InstallPWA />
            <FloatingContact />
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};