import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, X, Calendar, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import { SEO } from '../components/SEO';
import { useLegalUpdates } from '../hooks/useLegalUpdates';
import { Skeleton } from '../components/Skeleton';
import { PRACTICE_AREAS } from '../../constants';
import { useLanguage } from '../contexts/LanguageContext';

const Updates = () => {
  const { updates, loading } = useLegalUpdates();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { t, getContent } = useLanguage();

  const MotionDiv = motion.div as any;

  // Extract unique years from data for filter
  const years = Array.from(new Set(updates.map(u => u.date.split(',')[1].trim()))).sort().reverse();

  // Filter Logic
  const filteredUpdates = updates.filter(update => {
    const matchesSearch = 
        update.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        update.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = selectedYear ? update.date.includes(selectedYear) : true;
    
    const matchesCategory = selectedCategory === "" ? true : (update.category === selectedCategory);

    return matchesSearch && matchesYear && matchesCategory;
  });

  return (
    <div className="bg-white dark:bg-brand-dark min-h-screen transition-colors duration-300">
        <SEO 
            title={t('updates')}
            description="Stay informed with the latest insights, regulatory changes, and legal developments in Cambodia from Dagrand Law Office."
        />
        <PageHeader 
            title={t('updates')} 
            subtitle={t('updatesSubtitle')} 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            
            {/* Search and Filter Section */}
            <div className="mb-16">
                <div className="bg-brand-gray dark:bg-white/5 p-6 rounded-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                         {/* Search Input */}
                        <div className="relative flex-grow group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-brand-navy dark:group-focus-within:text-white" />
                            </div>
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('searchUpdates')}
                                className="block w-full pl-10 pr-10 py-3 bg-white dark:bg-black/20 border border-transparent rounded-sm text-brand-navy dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all text-sm shadow-sm"
                            />
                             {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-navy dark:hover:text-white transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        
                         {/* Category Select */}
                         <div className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-4 w-4 text-gray-400" />
                            </div>
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="block w-full pl-10 pr-8 py-3 bg-white dark:bg-black/20 border border-transparent rounded-sm text-brand-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all text-sm shadow-sm appearance-none cursor-pointer"
                            >
                                <option value="">{t('allCategories')}</option>
                                {PRACTICE_AREAS.map(area => (
                                    <option key={area.id} value={area.title}>{getContent(area.title, area.title_cn)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Year Filter Buttons */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 border-t border-gray-200 dark:border-white/10 pt-4">
                         <button 
                            onClick={() => setSelectedYear(null)}
                            className={`whitespace-nowrap px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${!selectedYear ? 'bg-brand-navy text-white shadow-md' : 'bg-white dark:bg-white/10 text-gray-500 dark:text-gray-300 hover:bg-white hover:text-brand-navy dark:hover:bg-white/20'}`}
                         >
                            All
                         </button>
                         {years.map(year => (
                             <button 
                                key={year}
                                onClick={() => setSelectedYear(year === selectedYear ? null : year)}
                                className={`whitespace-nowrap px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${selectedYear === year ? 'bg-brand-navy text-white shadow-md' : 'bg-white dark:bg-white/10 text-gray-500 dark:text-gray-300 hover:bg-white hover:text-brand-navy dark:hover:bg-white/20'}`}
                             >
                                {year}
                             </button>
                         ))}
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="border border-gray-100 dark:border-white/10 shadow-lg p-0">
                            <Skeleton className="h-56 w-full" />
                            <div className="p-8">
                                <Skeleton variant="text" className="w-3/4 mb-4" />
                                <Skeleton variant="text" className="w-full mb-2" />
                                <Skeleton variant="text" className="w-full mb-2" />
                                <Skeleton variant="text" className="w-1/2" />
                            </div>
                        </div>
                    ))}
                 </div>
            ) : (
                /* Results Grid */
                <AnimatePresence mode='wait'>
                    {filteredUpdates.length > 0 ? (
                        <MotionDiv 
                            key="grid"
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                        >
                            {filteredUpdates.map((update) => (
                                <Section key={update.id} className="h-full">
                                    <Link to={`/updates/${update.id}`} className="group bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-brand-gold/30 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                                        <div className="h-56 overflow-hidden relative">
                                            <img src={update.image} alt={update.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/10 transition-colors duration-300"></div>
                                            {/* Date Badge */}
                                            <div className="absolute top-4 left-4 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-brand-navy dark:text-white uppercase tracking-widest shadow-sm">
                                                {update.date}
                                            </div>
                                        </div>
                                        <div className="p-8 flex flex-col flex-grow">
                                            {/* Category Tag */}
                                            <div className="mb-3">
                                                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-brand-gray dark:bg-white/10 px-2 py-1 rounded-sm">
                                                    {update.category || 'General'}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-serif font-bold text-brand-navy dark:text-white mb-4 group-hover:text-brand-gold transition-colors leading-tight">
                                                {getContent(update.title, update.title_cn)}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 flex-grow leading-relaxed line-clamp-3">
                                                {getContent(update.summary, update.summary_cn)}
                                            </p>
                                            
                                            <div className="pt-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-between mt-auto">
                                                {update.author ? (
                                                    <div className="flex items-center gap-2">
                                                        <img src={update.author.avatar} alt={update.author.name} className="w-8 h-8 rounded-full border border-gray-200" />
                                                        <div>
                                                            <div className="text-[10px] font-bold text-brand-navy dark:text-white uppercase">{update.author.name}</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold text-brand-navy dark:text-white uppercase tracking-widest flex items-center gap-2">{t('readArticle')}</span>
                                                )}
                                                <ArrowRight className="h-4 w-4 text-brand-navy dark:text-white group-hover:text-brand-gold transition-colors" />
                                            </div>
                                        </div>
                                    </Link>
                                </Section>
                            ))}
                        </MotionDiv>
                    ) : (
                        <MotionDiv 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="bg-gray-100 dark:bg-white/5 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                <Calendar className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-brand-navy dark:text-white mb-2">{t('noUpdatesFound')}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{t('adjustFilters')}</p>
                            <button 
                                onClick={() => { setSearchTerm(''); setSelectedYear(null); setSelectedCategory(''); }}
                                className="mt-6 text-brand-gold font-bold uppercase tracking-widest text-xs hover:text-brand-navy dark:hover:text-white transition-colors underline"
                            >
                                {t('clearFilters')}
                            </button>
                        </MotionDiv>
                    )}
                </AnimatePresence>
            )}
        </div>
    </div>
  );
};

export default Updates;