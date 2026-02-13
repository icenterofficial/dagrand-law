
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2, Clock, Check, Facebook, Linkedin, Link as LinkIcon, X, User, AlertTriangle } from 'lucide-react';
import { Section } from '../components/Section';
import { SEO } from '../components/SEO';
import { useLegalUpdates } from '../hooks/useLegalUpdates';
import { Skeleton } from '../components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

const MotionDiv = motion.div as any;

// Custom Social Icons
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const WeChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.3 12.5c2.9 0 5.2-2.1 5.2-4.7 0-2.6-2.3-4.7-5.2-4.7-2.9 0-5.2 2.1-5.2 4.7 0 2.6 2.3 4.7 5.2 4.7.6 0 1.2-.1 1.7-.3.5.3 1.9 1 2.1 1-.1-.3-.3-1.1-.3-1.3.9-.8 1.5-1.8 1.5-2.9m-10 1.6c-4 0-7.3-3-7.3-6.6 0-3.7 3.3-6.6 7.3-6.6 4 0 7.3 3 7.3 6.6 0 3.7-3.3 6.6-7.3 6.6-.9 0-1.7-.1-2.5-.4-.1 0-.3.1-.3.2l-2.4 1.4c-.2.1-.4 0-.4-.2 0 0 0-.1.1-.2.2-.6.5-1.7.5-2 0-.2-.1-.3-.2-.5-1.3-1.3-2.1-3-2.1-4.9z"/>
  </svg>
);

const UpdateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { updates, loading } = useLegalUpdates();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  
  const update = updates.find((u) => u.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsShareOpen(false);
  }, [id]);

  if (loading) {
     return (
        <div className="bg-white min-h-screen">
            <div className="h-[60vh] bg-gray-200 animate-pulse"></div>
            <div className="max-w-7xl mx-auto px-4 py-16">
                 <Skeleton variant="text" className="w-1/2 h-10 mb-8" />
                 <Skeleton variant="text" className="w-full h-4 mb-2" />
                 <Skeleton variant="text" className="w-full h-4 mb-2" />
                 <Skeleton variant="text" className="w-3/4 h-4 mb-2" />
            </div>
        </div>
     );
  }

  if (!update) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray dark:bg-brand-dark">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-brand-navy dark:text-white mb-4">Article Not Found</h2>
          <Link 
            to="/updates" 
            className="text-brand-gold hover:text-brand-navy font-bold uppercase tracking-widest text-sm underline"
          >
            Return to Updates
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = window.location.href;
  const shareText = `Check out this article from Dagrand Law Office: ${update.title}`;

  // Share Actions
  const shareActions = [
    {
        name: 'Facebook',
        icon: <Facebook className="w-4 h-4" />,
        color: 'hover:bg-[#1877F2]/10 hover:text-[#1877F2]',
        action: () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
            setIsShareOpen(false);
        }
    },
    {
        name: 'Telegram',
        icon: <TelegramIcon />,
        color: 'hover:bg-[#229ED9]/10 hover:text-[#229ED9]',
        action: () => {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(update.title)}`, '_blank');
            setIsShareOpen(false);
        }
    },
    {
        name: 'WhatsApp',
        icon: <WhatsAppIcon />,
        color: 'hover:bg-[#25D366]/10 hover:text-[#25D366]',
        action: () => {
            window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank');
            setIsShareOpen(false);
        }
    },
    {
        name: 'LinkedIn',
        icon: <Linkedin className="w-4 h-4" />,
        color: 'hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]',
        action: () => {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
            setIsShareOpen(false);
        }
    },
    {
        name: 'WeChat',
        icon: <WeChatIcon />,
        color: 'hover:bg-[#09B83E]/10 hover:text-[#09B83E]',
        action: () => {
            // Web workaround for WeChat
            navigator.clipboard.writeText(currentUrl);
            toast.success("Link Copied!", { description: "Paste the link in WeChat to share." });
            setIsShareOpen(false);
        }
    },
    {
        name: 'Copy Link',
        icon: copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />,
        color: 'hover:bg-gray-100 hover:text-gray-900',
        action: () => {
            navigator.clipboard.writeText(currentUrl);
            setCopied(true);
            toast.success("Link copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
            // Don't close immediately so user sees the checkmark
            setTimeout(() => setIsShareOpen(false), 500); 
        }
    }
  ];

  // Get other updates for the sidebar, excluding current one
  const relatedUpdates = updates.filter(u => u.id !== id).slice(0, 3);

  // Article Structured Data for Google Rich Snippets
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": update.title,
    "image": [update.image],
    "datePublished": update.date,
    "author": {
      "@type": "Organization",
      "name": "Dagrand Law Office",
      "url": "https://dagrand.net"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Dagrand Law Office",
      "logo": {
        "@type": "ImageObject",
        "url": "https://raw.githubusercontent.com/icenterofficial/dagrand/refs/heads/main/public/assets/images/logo.png"
      }
    },
    "description": update.summary
  };

  return (
    <div className="bg-white dark:bg-brand-dark min-h-screen transition-colors duration-300">
       <SEO 
         title={update.title}
         description={update.summary}
         image={update.image}
         type="article"
         schema={articleSchema}
       />

       {/* Header Image */}
       <div className="relative h-[60vh] min-h-[400px]">
           <img 
             src={update.image} 
             alt={update.title} 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-brand-navy/60 mix-blend-multiply"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent"></div>
           
           <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
               <div className="max-w-7xl mx-auto">
                   {/* Breadcrumbs on Top Image */}
                   <div className="mb-6 relative z-10 hidden md:block">
                     <span className="text-white/60 text-sm font-medium">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <span className="mx-2 text-white/40">/</span>
                        <Link to="/updates" className="hover:text-white transition-colors">Legal Updates</Link>
                        <span className="mx-2 text-white/40">/</span>
                        <span className="text-brand-gold">{update.title}</span>
                     </span>
                   </div>

                   <Link to="/updates" className="md:hidden inline-flex items-center gap-2 text-white/80 hover:text-brand-gold mb-6 text-sm font-bold uppercase tracking-widest transition-colors">
                       <ArrowLeft className="h-4 w-4" /> Back to Updates
                   </Link>
                   
                   <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight max-w-4xl drop-shadow-lg">
                       {update.title}
                   </h1>
                   <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium">
                       <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-brand-gold" />
                           {update.date}
                       </div>
                       {update.author && (
                          <div className="flex items-center gap-2">
                             <User className="h-4 w-4 text-brand-gold" />
                             <span className="font-bold">{update.author.name}</span>
                          </div>
                       )}
                       <div className="flex items-center gap-2">
                           <Clock className="h-4 w-4 text-brand-gold" />
                           5 min read
                       </div>
                   </div>
               </div>
           </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               
               {/* Main Content */}
               <div className="lg:col-span-8">
                   <Section>
                       <div className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-headings:text-brand-navy dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:font-light prose-p:leading-loose prose-a:text-brand-gold hover:prose-a:text-brand-navy max-w-none first-letter:text-5xl first-letter:font-serif first-letter:text-brand-gold first-letter:mr-3 first-letter:float-left">
                           <p className="lead font-medium text-xl text-brand-navy dark:text-white italic mb-8 border-l-4 border-brand-gold pl-4 text-justify leading-loose">
                               {update.summary}
                           </p>
                           {update.content.map((paragraph, idx) => (
                               <p key={idx} className="mb-8 text-justify leading-loose text-gray-700 dark:text-gray-300 font-light">{paragraph}</p>
                           ))}
                       </div>
                        
                        {/* Author Card (Bottom of Post) */}
                        {update.author && (
                            <div className="mt-16 p-8 bg-brand-gray dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-sm flex items-center gap-6">
                                <img src={update.author.avatar} alt={update.author.name} className="w-20 h-20 rounded-full border-2 border-brand-gold object-cover shadow-md" />
                                <div>
                                    <div className="text-brand-gold font-bold uppercase tracking-widest text-xs mb-1">Written By</div>
                                    <h3 className="font-serif font-bold text-xl text-brand-navy dark:text-white">{update.author.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{update.author.role}</p>
                                </div>
                            </div>
                        )}

                       {/* Share / Tags Area */}
                       <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10 flex justify-between items-center relative">
                           <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Share this article</div>
                           
                           {/* Interactive Share Button */}
                           <div className="relative">
                               <button 
                                   onClick={() => setIsShareOpen(!isShareOpen)}
                                   className={`p-2.5 rounded-full transition-all duration-300 ${isShareOpen ? 'bg-brand-gold text-white rotate-180' : 'bg-gray-100 dark:bg-white/10 hover:bg-brand-navy hover:text-white text-gray-600 dark:text-gray-300'}`}
                               >
                                   {isShareOpen ? <X className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                               </button>

                               {/* Popup Menu */}
                               <AnimatePresence>
                                   {isShareOpen && (
                                       <MotionDiv
                                           initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                           animate={{ opacity: 1, scale: 1, y: 0 }}
                                           exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                           transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                           className="absolute bottom-full right-0 mb-3 bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10 shadow-2xl rounded-xl p-2 min-w-[180px] z-30"
                                       >
                                           <div className="flex flex-col gap-1">
                                               {shareActions.map((item, idx) => (
                                                   <button 
                                                       key={idx}
                                                       onClick={item.action}
                                                       className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors ${item.color} group`}
                                                   >
                                                       <span className="text-gray-400 dark:text-gray-500 group-hover:text-inherit transition-colors">{item.icon}</span>
                                                       {item.name}
                                                   </button>
                                               ))}
                                           </div>
                                           {/* Arrow Pointer */}
                                           <div className="absolute -bottom-1.5 right-3 w-3 h-3 bg-white dark:bg-brand-navy border-b border-r border-gray-200 dark:border-white/10 rotate-45"></div>
                                       </MotionDiv>
                                   )}
                               </AnimatePresence>
                           </div>
                       </div>

                       {/* Disclaimer Section */}
                       <div className="mt-12 p-6 bg-gray-50 dark:bg-white/5 border-l-4 border-gray-300 dark:border-gray-600 rounded-r-sm">
                           <div className="flex items-start gap-3">
                               <AlertTriangle className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                               <div>
                                   <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('disclaimerTitle')}</h4>
                                   {/* Updated to check for legalDisclaimerContent to fix caching issue */}
                                   <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-justify font-light">
                                       {t('legalDisclaimerContent' as any)}
                                   </p>
                               </div>
                           </div>
                       </div>
                   </Section>
               </div>

               {/* Sidebar */}
               <div className="lg:col-span-4">
                   <div className="sticky top-28 space-y-12">
                       {/* Recent Updates Widget */}
                       <div className="bg-brand-gray dark:bg-white/5 p-8 rounded-sm">
                           <h3 className="font-serif font-bold text-xl text-brand-navy dark:text-white mb-6 pb-2 border-b-2 border-brand-gold inline-block">
                               Recent Updates
                           </h3>
                           <div className="space-y-6">
                               {relatedUpdates.map((rel) => (
                                   <Link key={rel.id} to={`/updates/${rel.id}`} className="block group">
                                       <span className="text-xs font-bold text-gray-400 block mb-1">{rel.date}</span>
                                       <h4 className="font-serif font-bold text-brand-navy dark:text-white group-hover:text-brand-gold transition-colors line-clamp-2 leading-snug">
                                           {rel.title}
                                       </h4>
                                   </Link>
                               ))}
                           </div>
                           <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                               <Link to="/updates" className="text-xs font-bold uppercase tracking-widest text-brand-navy dark:text-white hover:text-brand-gold transition-colors">
                                   View All Posts
                               </Link>
                           </div>
                       </div>

                       {/* Subscribe Widget */}
                       <div className="bg-brand-navy text-white p-8 rounded-sm relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold opacity-10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                           <h3 className="font-serif font-bold text-xl mb-4 relative z-10">Stay Informed</h3>
                           <p className="text-sm text-gray-300 mb-6 font-light relative z-10">
                               Subscribe to our newsletter to receive the latest legal insights and firm news.
                           </p>
                           <form className="relative z-10 space-y-3" onSubmit={(e) => e.preventDefault()}>
                               <input 
                                   type="email" 
                                   placeholder="Your email address" 
                                   className="w-full px-4 py-3 text-brand-navy text-sm bg-white/95 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                               />
                               <button className="w-full bg-brand-gold text-white font-bold text-xs uppercase tracking-widest py-3 hover:bg-white hover:text-brand-navy transition-colors">
                                   Subscribe
                               </button>
                           </form>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default UpdateDetail;
