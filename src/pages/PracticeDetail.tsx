import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronLeft, List, X, Grid, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRACTICE_AREAS } from '../constants';
import { PageHeader } from '../components/PageHeader';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useLanguage } from '../contexts/LanguageContext';

const MotionDiv = motion.div as any;

const PracticeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const currentIndex = PRACTICE_AREAS.findIndex((p) => p.id === id);
  const activeArea = PRACTICE_AREAS[currentIndex];
  
  // Navigation Logic
  const prevArea = currentIndex > 0 ? PRACTICE_AREAS[currentIndex - 1] : null;
  const nextArea = currentIndex < PRACTICE_AREAS.length - 1 ? PRACTICE_AREAS[currentIndex + 1] : null;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, getContent } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [id]);

  // If area not found, redirect to practice list or show error
  if (!activeArea) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray dark:bg-brand-dark">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-4">Practice Area Not Found</h2>
          <Link 
            to="/practice-areas" 
            className="text-brand-gold hover:text-brand-navy font-bold uppercase tracking-widest text-sm underline"
          >
            Return to List
          </Link>
        </div>
      </div>
    );
  }

  // Text formatting helper for inline bold text
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="text-brand-navy dark:text-brand-gold font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
  };

  // Smart renderer for paragraphs (handles headers)
  const renderParagraph = (text: string, index: number) => {
      // Check if paragraph starts with bold text like "**Title:** Content" (Works for Chinese too: **标题:** 内容)
      const match = text.match(/^\*\*(.*?)\*\*[:\s]*(.*)/s);

      if (match) {
          const title = match[1];
          const content = match[2];

          return (
             <MotionDiv 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="mb-8 group relative"
             >
                <div className="bg-gray-50 dark:bg-white/5 p-6 md:p-8 rounded-r-lg border-l-[6px] border-brand-gold hover:shadow-lg transition-all duration-300 hover:bg-white dark:hover:bg-white/10 border-t border-r border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-2 bg-brand-navy/5 dark:bg-white/10 rounded-full shrink-0 group-hover:bg-brand-gold/10 transition-colors">
                            <Scale className="w-6 h-6 text-brand-gold" />
                        </div>
                        <h4 className="text-lg md:text-xl font-serif font-bold text-brand-navy dark:text-white mt-1 group-hover:text-brand-gold transition-colors">
                            {title}
                        </h4>
                    </div>
                    <p className="text-justify text-gray-700 dark:text-gray-300 font-light leading-loose pl-0 md:pl-[3.25rem]">
                        {formatText(content)}
                    </p>
                </div>
             </MotionDiv>
          );
      }

      // Standard Paragraph
      return (
          <p key={index} className="text-justify text-gray-700 dark:text-gray-300 font-light leading-loose mb-8">
              {formatText(text)}
          </p>
      );
  };

  const title = getContent(activeArea.title, activeArea.title_cn);
  const shortDescription = getContent(activeArea.shortDescription, activeArea.shortDescription_cn);
  const fullContent = getContent(activeArea.fullContent, activeArea.fullContent_cn);

  return (
    <div className="bg-white dark:bg-brand-dark min-h-screen transition-colors duration-300">
      <SEO 
        title={title}
        description={shortDescription}
      />
      <PageHeader 
        title={title}
        subtitle={t('comprehensiveExpertise')}
        backgroundImage={activeArea.image}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-20 relative">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            
            {/* MAIN CONTENT COLUMN (Left - Spans 8 cols) */}
            <div className="lg:col-span-8">
                {/* Desktop Sticky Breadcrumbs & Navigation */}
                <div className="hidden lg:flex sticky top-[56px] z-30 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 mb-6 -mt-8 pt-8 pb-4 items-center justify-between shadow-sm lg:shadow-none">
                  <Breadcrumbs 
                    items={[
                      { label: t('practice'), path: "/practice-areas" },
                      { label: title }
                    ]} 
                  />

                  {/* Right Side Navigation Controls */}
                  <div className="flex items-center gap-1 pl-4">
                       <Link 
                          to="/practice-areas" 
                          className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-brand-navy dark:text-white transition-colors"
                          title="Overview"
                       >
                           <Grid className="w-5 h-5" />
                       </Link>
                       <div className="h-5 w-[1px] bg-gray-200 dark:bg-white/10 mx-2"></div>
                       {prevArea ? (
                          <Link 
                              to={`/practice-areas/${prevArea.id}`}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-brand-navy dark:text-white transition-colors"
                              title="Previous Area"
                          >
                              <ChevronLeft className="w-5 h-5" />
                          </Link>
                       ) : (
                           <span className="p-2 text-gray-300 dark:text-gray-700 cursor-not-allowed"><ChevronLeft className="w-5 h-5" /></span>
                       )}
                       {nextArea ? (
                          <Link 
                              to={`/practice-areas/${nextArea.id}`}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-brand-navy dark:text-white transition-colors"
                              title="Next Area"
                          >
                              <ChevronRight className="w-5 h-5" />
                          </Link>
                       ) : (
                           <span className="p-2 text-gray-300 dark:text-gray-700 cursor-not-allowed"><ChevronRight className="w-5 h-5" /></span>
                       )}
                  </div>
                </div>

                {/* Mobile Breadcrumbs (Simple) */}
                <div className="lg:hidden mb-6">
                    <Link to="/practice-areas" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-brand-navy dark:hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" /> {t('backToOverview')}
                    </Link>
                </div>

                {/* Content Body */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    {fullContent.map((paragraph: string, index: number) => renderParagraph(paragraph, index))}
                </div>
            </div>

            {/* SIDEBAR (Right - Spans 4 cols) */}
            <div className="lg:col-span-4 mt-12 lg:mt-0 space-y-8">
                {/* Topics Widget */}
                <div className="bg-brand-gray dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-sm sticky top-24">
                    <h3 className="font-serif font-bold text-lg text-brand-navy dark:text-white mb-4 flex items-center gap-2">
                        <List className="h-5 w-5 text-brand-gold" />
                        {t('topics')}
                    </h3>
                    <ul className="space-y-2">
                        {PRACTICE_AREAS.map((area) => (
                            <li key={area.id}>
                                <Link 
                                    to={`/practice-areas/${area.id}`}
                                    className={`block px-3 py-2 rounded text-sm transition-colors ${
                                        area.id === activeArea.id 
                                        ? 'bg-brand-navy text-white font-bold shadow-md' 
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 hover:text-brand-navy dark:hover:text-white'
                                    }`}
                                >
                                    {getContent(area.title, area.title_cn)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact CTA */}
                <div className="bg-brand-navy text-white p-8 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold opacity-10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                    <h3 className="font-serif font-bold text-xl mb-3 relative z-10">{t('needAssistance')}</h3>
                    <p className="text-sm text-gray-300 mb-6 font-light relative z-10">
                        {t('readyToProvide')}
                    </p>
                    <Link to="/contact" className="block w-full text-center bg-brand-gold text-white font-bold text-xs uppercase tracking-widest py-3 hover:bg-white hover:text-brand-navy transition-colors relative z-10 rounded-sm">
                        {t('getInTouch')}
                    </Link>
                </div>
            </div>
        </div>
      </div>

      {/* Floating Mobile Menu for Practice Areas */}
      <AnimatePresence>
        {mobileMenuOpen && (
            <>
                <MotionDiv 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                />
                <MotionDiv 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 bg-white dark:bg-brand-dark z-50 rounded-t-2xl p-6 lg:hidden max-h-[70vh] overflow-y-auto"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-serif font-bold text-xl text-brand-navy dark:text-white">{t('topics')}</h3>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full">
                            <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                        </button>
                    </div>
                    <ul className="space-y-3">
                        {PRACTICE_AREAS.map((area) => (
                            <li key={area.id}>
                                <Link 
                                    to={`/practice-areas/${area.id}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                                        area.id === activeArea.id 
                                        ? 'bg-brand-navy text-white font-bold shadow-md' 
                                        : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${area.id === activeArea.id ? 'bg-brand-gold' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                                    {getContent(area.title, area.title_cn)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </MotionDiv>
            </>
        )}
      </AnimatePresence>

      {/* Mobile Fab for Menu */}
      <button 
        onClick={() => setMobileMenuOpen(true)}
        className="fixed bottom-6 left-6 lg:hidden bg-brand-navy text-white p-4 rounded-full shadow-2xl z-30 flex items-center justify-center border border-white/20"
      >
          <List className="h-6 w-6" />
      </button>

    </div>
  );
};

export default PracticeDetail;