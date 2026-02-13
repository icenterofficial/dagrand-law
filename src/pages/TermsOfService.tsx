
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SEO } from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Shield, Lock, Globe, FileText, AlertTriangle, Copyright, Server, Ban, ArrowRight, List, X, ArrowLeft, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const MotionDiv = motion.div as any;

const SECTIONS = [
  { id: 'website', title: '1. Website Info' },
  { id: 'privacy', title: '2. Data Protection' },
  { id: 'ip', title: '3. Intellectual Property' },
  { id: 'usage', title: '4. Use of Website' },
  { id: 'liability', title: '5. Limitation of Liability' },
  { id: 'amendments', title: '6. Amendments' },
  { id: 'law', title: '7. Law & Jurisdiction' },
  { id: 'contact', title: '8. Contact Us' },
];

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('website');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    
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
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
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
        title="Terms of Service"
        description="Terms of Service for Dagrand Law Office regarding the use of our website and services."
      />
      <PageHeader 
        title="Terms of Service" 
        subtitle="Last Updated: 01 March 2026" 
      />

      {/* MOBILE STICKY SUB-HEADER */}
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
          
          {/* LEFT SIDEBAR - TABLE OF CONTENTS */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="sticky top-28 space-y-6">
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
              <div className="p-6 bg-brand-navy/5 dark:bg-white/5 rounded-sm border border-brand-navy/10 dark:border-white/10">
                <Scale className="h-8 w-8 text-brand-gold mb-3" />
                <p className="text-xs text-brand-navy dark:text-gray-300 font-medium leading-relaxed">
                  By using this Website, you consent to these Terms of Service.
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
              {/* Introduction Text */}
              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                 <p className="lead text-xl text-brand-navy dark:text-white font-serif font-medium">
                    The website accessible via the URL <span className="text-brand-gold font-bold">https://www.dagrand.net</span> (hereinafter the "Website") contains legal and practical information relating to Dagrand Law Office.
                 </p>
              </div>

              {/* SECTION 1 */}
              <section id="website" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">01</span>
                  Dagrand Law Office Website
                </h2>
                <div className="text-gray-600 dark:text-gray-300 leading-loose text-sm">
                  <p className="mb-4">
                    The Website is edited and operated by Dagrand Law Office, a professional law office registered with the Bar Association of the Kingdom of Cambodia (BAKC).
                  </p>
                  <p>
                    By using the Website, you consent to these Terms of Service, which incorporate other terms and conditions and legal notices that appear on this Website.
                  </p>
                </div>
              </section>

              {/* SECTION 2 */}
              <section id="privacy" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">02</span>
                  Personal Data Protection
                </h2>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-lg border border-blue-100 dark:border-blue-900/20">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-loose m-0">
                        In connection with the use of this Website, Dagrand Law Office will process certain personal data about users. These processing activities will be carried out in accordance with the laws in force in the Kingdom of Cambodia, and with the terms of our <Link to="/privacy-policy" className="text-brand-gold hover:underline font-bold">Privacy Policy</Link> accessible on this Website.
                    </p>
                </div>
              </section>

              {/* SECTION 3 */}
              <section id="ip" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">03</span>
                  Intellectual Property
                </h2>
                
                <div className="space-y-8">
                    <div>
                        <h3 className="font-bold text-brand-navy dark:text-white mb-3 flex items-center gap-2 text-lg">
                            <Copyright className="h-4 w-4 text-brand-gold" /> Ownership of Content
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-loose">
                            User acknowledges that the Website and all of its content, including, but not limited to, the Website architecture, as well as any text, articles, information, photographs, videos, images, illustrations, software, trademarks, and logos available on this Website (together “Content”), are protected by applicable intellectual property laws and are the exclusive property of, or licensed by, Dagrand Law Office.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-brand-navy dark:text-white mb-3 flex items-center gap-2 text-lg">
                            <Globe className="h-4 w-4 text-brand-gold" /> Third-Party Content
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-loose mb-3">
                            Some Content displayed on the Website may be quoted, reproduced, embedded, or downloaded from third‑party sources. Such Content remain the intellectual property of their respective owners. Dagrand Law Office does not claim proprietary rights in Content that is clearly identified as originating from third parties or that is used under license or license-free, fair use, consent, or other lawful exceptions.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-loose">
                            Unless a specific license or permission is expressly provided on the Website, users must obtain permission from the original rights holder before copying, redistributing, republishing, or otherwise using third‑party Content for any purpose beyond viewing on the Website.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-brand-navy dark:text-white mb-3 flex items-center gap-2 text-lg">
                            <FileText className="h-4 w-4 text-brand-gold" /> Use of Content by Users
                        </h3>
                        <div className="text-gray-600 dark:text-gray-300 text-sm leading-loose space-y-4">
                            <p>
                                Dagrand Law Office grants the user a license to (i) access and use the Website, and (ii) download the documents that are made available to the user, free of charge, via the Website, in the form of electronic files specifically identified as downloadable material. Please note that the license granted to the user is a non-exclusive, revocable, personal, non-assignable, non-transferable, and non-sublicensable license worldwide.
                            </p>
                            <div className="bg-red-50 dark:bg-red-900/10 p-4 border-l-4 border-red-400 dark:border-red-500 rounded-r">
                                <p className="text-xs text-gray-700 dark:text-gray-300 m-0">
                                    <strong>Restrictions:</strong> Except as provided above, the user may not: copy, reproduce, represent, publicly display, broadcast, perform, transmit, distribute, publish, permanently or temporarily, all or part of the Content and/or Website in any manner and in any media now known or hereafter developed; create derivative works; modify, translate, adapt, arrange all or part of the Content; or disassemble, decompile or reverse engineer the Website.
                                </p>
                            </div>
                            <p>
                                Users agree to use these documents, information, and personal data for personal purposes only and shall not distribute or disclose them to any third party or re-use them, in whole or in part, without making reference to or obtaining prior consent from Dagrand Law Office.
                            </p>
                        </div>
                    </div>
                </div>
              </section>

              {/* SECTION 4 */}
              <section id="usage" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">04</span>
                  Use of the Website
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-green-200 dark:border-green-900/30 rounded-lg p-5 bg-green-50/50 dark:bg-green-900/10">
                        <h4 className="font-bold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2">
                            <Shield className="h-4 w-4" /> Permitted Use
                        </h4>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                            Users agree to use the services available via the Website and all information and documents accessible via the Website for personal purposes only and in compliance with laws, public order, morality, and third-party rights.
                        </p>
                    </div>
                    
                    <div className="border border-red-200 dark:border-red-900/30 rounded-lg p-5 bg-red-50/50 dark:bg-red-900/10">
                        <h4 className="font-bold text-red-800 dark:text-red-400 mb-3 flex items-center gap-2">
                            <Ban className="h-4 w-4" /> Prohibited Use
                        </h4>
                        <ul className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                            <li>Upload or transmit viruses or malware.</li>
                            <li>Harvest personal data without consent.</li>
                            <li>Impersonate any person or entity.</li>
                            <li>Use automated means (bots, scrapers).</li>
                            <li>Engage in conduct that disrupts the Website.</li>
                        </ul>
                    </div>
                </div>
                <p className="mt-4 text-xs text-gray-500 italic">
                    We may suspend or terminate your access to the Website at any time for breach of these Terms of Service.
                </p>
              </section>

              {/* SECTION 5 */}
              <section id="liability" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">05</span>
                  Limitation of Liability
                </h2>
                
                <div className="space-y-6 text-gray-600 dark:text-gray-300 text-sm leading-loose">
                    <div className="pl-4 border-l-2 border-brand-gold/30">
                        <strong className="block text-brand-navy dark:text-white mb-1">No Warranty on Uninterrupted Use</strong>
                        Dagrand Law Office will use its best efforts to ensure Website availability 24/7. However, we make no warranty that the Website will be uninterrupted and/or error-free. We may temporarily suspend access for maintenance without incurring liability.
                    </div>

                    <div className="pl-4 border-l-2 border-brand-gold/30">
                        <strong className="block text-brand-navy dark:text-white mb-1">Third Party Links and Content</strong>
                        The Website may contain links to websites managed by third parties. These are independent, and we have no control over their sources or content. Links are provided solely as a convenience, and users are fully responsible for visiting such Third-Party Websites.
                    </div>

                    <div className="pl-4 border-l-2 border-brand-gold/30">
                        <strong className="block text-brand-navy dark:text-white mb-1">No Legal Advice</strong>
                        The Content on the Website is for educational and informational purposes only. It does not constitute legal advice, create an attorney–client relationship, or substitute for consultation with a qualified lawyer.
                    </div>

                    <div className="bg-gray-100 dark:bg-white/5 p-5 rounded-lg text-xs">
                        <strong className="block text-brand-navy dark:text-white mb-2 uppercase tracking-wide">Liability Disclaimer</strong>
                        To the fullest extent permitted by Cambodian laws, Dagrand Law Office shall not be liable for any direct, indirect, incidental, special, consequential, punitive, or exemplary damages arising out of:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Your access to or use of the Website or any Content;</li>
                            <li>Viruses, malware, or other harmful code transmitted to your device;</li>
                            <li>Errors, omissions, inaccuracies, or delays in the Content;</li>
                            <li>Any unauthorized access to or alteration of your transmissions or data.</li>
                        </ul>
                    </div>
                </div>
              </section>

              {/* SECTION 6 */}
              <section id="amendments" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">06</span>
                  Amendments
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-loose text-sm">
                  Dagrand Law Office may amend these Terms of Service at any time. Therefore, users agree to review them regularly. Any such change shall take effect upon posting to this Website.
                </p>
              </section>

              {/* SECTION 7 */}
              <section id="law" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">07</span>
                  Law and Jurisdiction
                </h2>
                <div className="bg-brand-navy/5 dark:bg-white/5 p-6 rounded-lg border border-brand-navy/10 dark:border-white/10">
                    <Scale className="h-6 w-6 text-brand-navy dark:text-white mb-4" />
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-loose">
                      This Website and these Terms of Service are governed by and construed in accordance with the laws of the Kingdom of Cambodia. By using this Website, users agree that any matters and disputes arising under and in connection with this Website and these Terms of Service shall be submitted to arbitration administered by the National Commercial Arbitration Centre of the Kingdom of Cambodia (NCAC). The seat of Arbitration shall be in Phnom Penh, Cambodia. The language of arbitration shall be Khmer. The award of the arbitral tribunal shall be final and binding.
                    </p>
                </div>
              </section>

              {/* SECTION 8 - CONTACT */}
              <section id="contact" className="scroll-mt-32">
                <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gray dark:bg-white/10 flex items-center justify-center text-sm font-sans text-brand-gold">08</span>
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

      {/* Floating Mobile Menu */}
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

export default TermsOfService;
