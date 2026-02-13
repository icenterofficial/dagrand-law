
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SEO } from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Globe, MapPin, Mail, ArrowRight, AlertCircle, CheckCircle2, List, X, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const MotionDiv = motion.div as any;

const SECTIONS = [
  { id: 'changes', title: '1. Changes to Policy' },
  { id: 'collection', title: '2. Information We Collect' },
  { id: 'usage', title: '3. Use & Disclosure' },
  { id: 'cookies', title: '4. Cookies & Technology' },
  { id: 'rights', title: '5. Your Rights' },
  { id: 'links', title: '6. Third-Party Links' },
  { id: 'international', title: '7. International Visitors' },
  { id: 'security', title: '8. Security' },
  { id: 'contact', title: '9. Contact Us' },
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simple scroll spy to highlight active section
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false); // Close mobile menu if open
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Height of sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-brand-gray dark:bg-brand-dark min-h-screen transition-colors duration-300 font-sans">
      <SEO 
        title="Privacy Policy"
        description="Privacy Policy of Dagrand Law Office regarding collection, use, and disclosure of Personal Information."
      />
      <PageHeader 
        title="Privacy Policy" 
        subtitle="Last Updated: 01 March 2026" 
      />

      {/* MOBILE STICKY SUB-HEADER (Like Practice Detail) */}
      <div className="lg:hidden sticky top-[72px] z-40 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 px-4 py-3 mb-6 flex items-center justify-between shadow-sm transition-all duration-300">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-navy dark:hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors border ${mobileMenuOpen ? 'bg-brand-gold text-white border-brand-gold' : 'bg-brand-gray dark:bg-white/10 text-brand-navy dark:text-white border-gray-200 dark:border-white/5 hover:bg-brand-gold hover:text-white'}`}
          >
              {mobileMenuOpen ? <X className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
              Contents
          </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT SIDEBAR - TABLE OF CONTENTS (Desktop Sticky Widget) */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="sticky top-28 space-y-6">
              
              {/* Contents Widget */}
              <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-sm shadow-sm">
                  <h3 className="font-serif font-bold text-lg text-brand-navy dark:text-white mb-4 flex items-center gap-2">
                      <List className="h-5 w-5 text-brand-gold" />
                      Contents
                  </h3>
                  <nav className="space-y-1">
                    {SECTIONS.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollTo(section.id)}
                        className={`w-full text-left px-3 py-2.5 rounded text-sm transition-all duration-200 flex items-center justify-between group ${
                          activeSection === section.id 
                            ? 'bg-brand-navy text-white font-bold shadow-md' 
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-brand-navy dark:hover:text-white'
                        }`}
                      >
                        <span className="truncate">{section.title}</span>
                        {activeSection === section.id && <ArrowRight className="h-3 w-3 shrink-0" />}
                      </button>
                    ))}
                  </nav>
              </div>

              {/* Commitment Badge */}
              <div className="p-6 bg-brand-navy/5 dark:bg-white/5 rounded-sm border border-brand-navy/10 dark:border-white/10">
                <Shield className="h-8 w-8 text-brand-gold mb-3" />
                <p className="text-xs text-brand-navy dark:text-gray-300 font-medium leading-relaxed">
                  We are committed to protecting your privacy and complying with the Law on Electronic Commerce (2019).
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT - MAIN DOCUMENT */}
          <div className="lg:w-3/4">
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 p-8 md:p-12"
            >
              {/* Introduction */}
              <div id="intro" className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 font-light leading-loose">
                <p className="lead text-xl text-brand-navy dark:text-white font-serif font-medium mb-8">
                  This Privacy Policy applies to Personal Information collected by Dagrand Law Office through <span className="text-brand-gold font-bold">www.dagrand.net</span> and our digital services.
                </p>
                
                <div className="bg-brand-navy/5 dark:bg-black/20 p-6 rounded-lg border-l-4 border-brand-navy dark:border-brand-gold mb-8">
                  <h4 className="flex items-center gap-2 font-bold text-brand-navy dark:text-white mb-2 not-prose">
                    <Lock className="h-4 w-4" /> Note on Attorney-Client Privilege
                  </h4>
                  <p className="text-sm m-0">
                    While this Privacy Policy governs how we handle data collected through our Services, it does not alter or supersede the professional duties of confidentiality and attorney-client privilege regarding information provided to us during the course of legal representation.
                  </p>
                </div>

                <p className="text-sm">
                  <span className="font-bold text-brand-navy dark:text-white">Accessibility:</span> If you require support or an alternative format to review this Privacy Policy, please contact us through Section 9 below.
                </p>

                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-200 text-xs font-bold uppercase tracking-wide rounded-md border border-red-100 dark:border-red-900/20 my-8">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  If you do not agree with any part of this policy, please do not use our services.
                </div>
              </div>

              <div className="border-b border-gray-100 dark:border-white/10 my-12"></div>

              {/* SECTION 1 */}
              <section id="changes" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">01</span>
                  Changes to This Privacy Policy
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-loose">
                  We reserve the right to amend this Privacy Policy at our discretion and at any time. When we make changes, we will post the updated policy on this page and update the "Last Updated" date. Your continued use of our Services following the posting of changes constitutes your acceptance of such changes.
                </p>
              </section>

              {/* SECTION 2 */}
              <section id="collection" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">02</span>
                  Personal Information We May Collect
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  "Personal Information" means any information that identifies, relates to, describes, or is reasonably capable of being associated with an individual. We may collect:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Direct Identifiers", desc: "Name, address, email, phone numbers." },
                    { label: "Personal Records", desc: "Signatures, financial & payment info." },
                    { label: "Protected Characteristics", desc: "Age, marital status, gender." },
                    { label: "Commercial Info", desc: "Services purchased, KYC checks." },
                    { label: "Internet Activity", desc: "IP address, browsing history, device info." },
                    { label: "Geolocation Data", desc: "Physical location via IP or office visits." },
                    { label: "Professional Info", desc: "Job title, organization details." },
                    { label: "Sensitive Info", desc: "Gov IDs (Passport/ID Cards), case details." },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5">
                      <h4 className="font-bold text-brand-navy dark:text-white text-sm mb-1">{item.label}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 3 */}
              <section id="usage" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">03</span>
                  Collection, Use, and Disclosure
                </h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy dark:text-white mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-brand-gold" /> How We Collect
                    </h3>
                    <ul className="list-none space-y-2 pl-1">
                      {['Directly from you (registration, forms, consultation)', 'Through Social Media interactions', 'From Third Parties (government registries)', 'Automated Technologies (cookies)'].map((text, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy dark:text-white mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-brand-gold" /> How We Use
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                      We use your information for lawful business purposes including service delivery, communication, internal operations improvements, and legal compliance (including AML checks).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy dark:text-white mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-brand-gold" /> How We Disclose
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      We do not sell your Personal Information. We may disclose it to Service Providers (IT, accountants), Legal Authorities (courts, government agents), or during Business Transfers.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 4 */}
              <section id="cookies" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">04</span>
                  Cookies & Technology
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-loose text-sm">
                  We use cookies and similar tracking technologies (like Google Analytics) to track the activity on our services and hold certain information. Cookies are files with a small amount of data stored on your device.
                </p>
              </section>

              {/* SECTION 5 */}
              <section id="rights" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">05</span>
                  Your Rights and Choices
                </h2>
                <ul className="space-y-4">
                  <li className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg">
                    <span className="font-bold text-brand-navy dark:text-white block mb-1">Opt-Out of Marketing</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Unsubscribe from newsletters via the link in emails.</span>
                  </li>
                  <li className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg">
                    <span className="font-bold text-brand-navy dark:text-white block mb-1">Access and Correction</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Request access to your data or corrections to inaccurate info.</span>
                  </li>
                  <li className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg">
                    <span className="font-bold text-brand-navy dark:text-white block mb-1">Location Data</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Disable location services on your mobile device.</span>
                  </li>
                </ul>
              </section>

              {/* SECTION 6 */}
              <section id="links" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">06</span>
                  Third-Party Links
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-loose">
                  Our Services may contain links to third-party websites (LinkedIn, Facebook, etc). We are not responsible for their privacy practices.
                </p>
              </section>

              {/* SECTION 7 */}
              <section id="international" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">07</span>
                  International Visitors
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-loose">
                  Services are operated from Cambodia. Information may be processed in Cambodia. By using services, you consent to this transfer.
                </p>
              </section>

              {/* SECTION 8 */}
              <section id="security" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">08</span>
                  Security
                </h2>
                <div className="flex items-start gap-4 p-6 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400 shrink-0 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your Personal Information. However, no transmission over the Internet is 100% secure.
                  </p>
                </div>
              </section>

              {/* SECTION 9 - CONTACT */}
              <section id="contact" className="scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">09</span>
                  Questions or Comments
                </h2>
                
                <div className="bg-brand-navy text-white p-8 rounded-xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold opacity-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                  
                  <h3 className="font-serif font-bold text-xl mb-6 relative z-10">Dagrand Law Office</h3>
                  
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-1" />
                      <p className="text-sm text-gray-300 leading-relaxed">
                        Building no.162, Street 51 corner street 334,<br/> 
                        Sangkat Boeung KengKang 1, Khan Chamkamorn, Phnom Penh.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Mail className="h-5 w-5 text-brand-gold shrink-0" />
                      <a href="mailto:info@dagrand.net" className="text-sm text-white hover:text-brand-gold transition-colors font-bold tracking-wide">
                        info@dagrand.net
                      </a>
                    </div>
                    <div className="flex items-center gap-4">
                      <Globe className="h-5 w-5 text-brand-gold shrink-0" />
                      <a href="https://www.dagrand.net" className="text-sm text-white hover:text-brand-gold transition-colors">
                        www.dagrand.net
                      </a>
                    </div>
                  </div>
                </div>
              </section>

            </MotionDiv>
          </div>
        </div>
      </div>

      {/* Floating Mobile Menu (Sidebar Style - Portal to Body) */}
      {createPortal(
        <AnimatePresence>
            {mobileMenuOpen && (
                <>
                    <MotionDiv 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 z-[1000] lg:hidden backdrop-blur-sm"
                    />
                    <MotionDiv 
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white dark:bg-brand-dark z-[1001] shadow-2xl border-l border-gray-100 dark:border-white/5 flex flex-col h-[100dvh]"
                    >
                        {/* Header Section - Fixed at top of drawer */}
                        <div className="bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 p-5 flex justify-between items-center z-10 shrink-0">
                            <h3 className="font-serif font-bold text-xl text-brand-navy dark:text-white flex items-center gap-2">
                                <List className="h-5 w-5 text-brand-gold" />
                                Contents
                            </h3>
                            <button 
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 bg-gray-100 dark:bg-white/10 rounded-full text-gray-500 dark:text-gray-300 hover:bg-brand-gold hover:text-white transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        {/* Scrollable Content Section */}
                        {/* Added styles to enforce visibility */}
                        <style>{`
                            .drawer-scroll::-webkit-scrollbar {
                                width: 6px;
                                display: block;
                            }
                            .drawer-scroll::-webkit-scrollbar-track {
                                background: rgba(0,0,0,0.05);
                            }
                            .dark .drawer-scroll::-webkit-scrollbar-track {
                                background: rgba(255,255,255,0.05);
                            }
                            .drawer-scroll::-webkit-scrollbar-thumb {
                                background-color: #b49b67;
                                border-radius: 3px;
                            }
                            .drawer-scroll {
                                scrollbar-width: thin;
                                scrollbar-color: #b49b67 rgba(0,0,0,0.05);
                            }
                        `}</style>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 drawer-scroll">
                            {SECTIONS.map((section) => (
                                <button 
                                    key={section.id}
                                    onClick={() => scrollTo(section.id)}
                                    className={`w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm transition-all ${
                                        activeSection === section.id 
                                        ? 'bg-brand-navy text-white font-bold shadow-md' 
                                        : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                                    }`}
                                >
                                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${activeSection === section.id ? 'bg-brand-gold' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                                    <span className="leading-snug">{section.title}</span>
                                </button>
                            ))}
                        </div>
                    </MotionDiv>
                </>
            )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
};

export default PrivacyPolicy;
