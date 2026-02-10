
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, ArrowRight, Search, X, 
  Users, Building2, Landmark, Globe, TrendingUp, 
  Lightbulb, Gavel, Zap, Home, Hammer, HeartPulse 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRACTICE_AREAS } from '../constants';
import { PageHeader } from '../components/PageHeader';
import { SEO } from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const MotionDiv = motion.div as any;

// Mapping IDs to Lucide Icons
const iconMap: Record<string, any> = {
  'employment': Users,
  'corporate': Building2,
  'tax': Landmark,
  'trade': Globe,
  'capital-market': TrendingUp,
  'ip': Lightbulb,
  'dispute': Gavel,
  'energy': Zap,
  'real-estate': Home,
  'construction': Hammer,
  'healthcare': HeartPulse
};

const PracticeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t, getContent } = useLanguage();

  // Filter Logic with language support
  const filteredAreas = PRACTICE_AREAS.filter(area => {
    const title = getContent(area.title, area.title_cn);
    const desc = getContent(area.shortDescription, area.shortDescription_cn);
    
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           desc.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="bg-white dark:bg-brand-dark min-h-screen transition-colors duration-300">
      <SEO 
        title={t('practice')}
        description="Comprehensive legal expertise across a wide spectrum of industries including Corporate, Tax, Dispute Resolution, Real Estate, and more in Cambodia."
      />
      <PageHeader 
        title={t('practice')} 
        subtitle={t('practiceSubtitle')} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Search Bar Section */}
        <div className="max-w-2xl mx-auto mb-16 relative z-20">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-gold transition-colors" />
                </div>
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search practice areas..."
                    className="block w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-sm text-brand-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy focus:bg-white dark:focus:bg-white/10 transition-all shadow-sm group-hover:shadow-md"
                />
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-navy dark:hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
            <div className="mt-2 text-right">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Showing {filteredAreas.length} results
                </span>
            </div>
        </div>

        {/* Results Grid */}
        <AnimatePresence mode='wait'>
            {filteredAreas.length > 0 ? (
                <MotionDiv 
                    key="grid"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                {filteredAreas.map((area) => {
                    const title = getContent(area.title, area.title_cn);
                    const desc = getContent(area.shortDescription, area.shortDescription_cn);
                    const IconComponent = iconMap[area.id] || Scale; // Get dynamic icon

                    return (
                    <MotionDiv 
                        key={area.id}
                        variants={fadeInUp}
                        layout // Enables smooth layout animations when filtering
                        className="h-full"
                    >
                        <Link 
                            to={`/practice-areas/${area.id}`}
                            className="group relative border border-gray-200 dark:border-white/10 p-8 transition-all duration-500 flex flex-col h-full bg-white dark:bg-white/5 hover:border-brand-gold/50 hover:shadow-2xl hover:-translate-y-2 rounded-sm overflow-hidden"
                        >
                            {/* Background Image Layer (Reveals on Hover) */}
                            {area.image && (
                                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
                                    <img 
                                        src={area.image} 
                                        alt={title} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                    />
                                    {/* Overlay Gradient to ensure text readability */}
                                    <div className="absolute inset-0 bg-brand-navy/90 mix-blend-multiply transition-colors"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>
                            )}

                            {/* Top Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-brand-navy dark:bg-brand-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20"></div>
                            
                            <div className="mb-auto relative z-10">
                                <div className="mb-6 inline-flex p-3 rounded-full bg-brand-gray dark:bg-white/10 group-hover:bg-white/10 dark:group-hover:bg-brand-navy transition-colors duration-300 backdrop-blur-sm">
                                    <IconComponent className="h-8 w-8 text-brand-navy dark:text-white group-hover:text-white dark:group-hover:text-brand-gold transition-colors duration-300" />
                                </div>
                                <h3 className="font-serif font-bold text-xl mb-4 leading-tight text-brand-navy dark:text-white group-hover:text-white transition-colors duration-300">
                                    {title}
                                </h3>
                                <p className="text-sm mb-6 leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-3 group-hover:text-gray-200 transition-colors">
                                    {desc}
                                </p>
                            </div>
                            <div className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-white/10 group-hover:border-white/20 text-brand-navy dark:text-white group-hover:text-brand-gold transition-colors duration-300 relative z-10">
                                {t('viewDetails')} 
                                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-2" />
                            </div>
                        </Link>
                    </MotionDiv>
                )})}
                </MotionDiv>
            ) : (
                <MotionDiv 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <div className="bg-gray-100 dark:bg-white/5 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-brand-navy dark:text-white mb-2">No results found</h3>
                    <p className="text-gray-500 dark:text-gray-400">We couldn't find any practice areas matching "{searchTerm}".</p>
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="mt-6 text-brand-gold font-bold uppercase tracking-widest text-xs hover:text-brand-navy dark:hover:text-white transition-colors underline"
                    >
                        Clear Search
                    </button>
                </MotionDiv>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PracticeList;
