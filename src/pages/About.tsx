
import { Link } from 'react-router-dom';
import { Shield, Globe, CheckCircle2, Building2, Scale, Award } from 'lucide-react';
import { ABOUT_TEXT, ABOUT_TEXT_CN } from '../../constants';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import { SEO } from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t, getContent } = useLanguage();
  const aboutText = getContent(ABOUT_TEXT, ABOUT_TEXT_CN);

  return (
    <div className="bg-white dark:bg-brand-dark min-h-screen font-sans transition-colors duration-300">
      <SEO 
          title={t('about')}
          description="Learn about Dagrand Law Office, a boutique firm dedicated to delivering high-quality, strategic, and globally informed legal services in Cambodia."
      />
      <PageHeader 
          title={t('about')}
          subtitle={t('aboutSubtitle')}
      />
      
      {/* 1. Introduction - Big Statement */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
           <Section>
             <Scale className="h-12 w-12 text-brand-gold mx-auto mb-8" />
             <p className="text-2xl md:text-3xl font-serif text-brand-navy dark:text-white leading-relaxed font-medium">
               "{aboutText[0]}"
             </p>
             <div className="w-24 h-1 bg-brand-gold mx-auto mt-12"></div>
           </Section>
        </div>
      </section>

      {/* 2. Global Team Section - Image Left, Text Right */}
      <section className="py-20 bg-brand-gray dark:bg-[#0b1d33] relative transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
               <Section className="relative">
                  <div className="relative rounded-sm overflow-hidden shadow-2xl">
                     <img 
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                        alt="International Legal Team" 
                        className="w-full h-full object-cover aspect-[4/3]"
                     />
                     <div className="absolute inset-0 bg-brand-navy/10 mix-blend-multiply"></div>
                  </div>
                  {/* Floating Badge */}
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-brand-navy p-6 shadow-xl border-l-4 border-brand-gold hidden md:block">
                     <div className="flex items-center gap-4 mb-2">
                        <Globe className="h-6 w-6 text-brand-gold" />
                        <span className="font-bold text-brand-navy dark:text-white uppercase tracking-widest text-xs">{t('globalReach')}</span>
                     </div>
                     <p className="text-sm text-gray-500 dark:text-gray-300">{t('servingClients')}</p>
                  </div>
               </Section>
               
               <Section>
                 <h3 className="text-3xl font-serif font-bold text-brand-navy dark:text-white mb-6">{t('slogan')}</h3>
                 <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light mb-8 text-justify">
                   {aboutText[1]}
                 </p>
                 
                 {/* Language Pills */}
                 <div className="flex flex-wrap gap-3">
                    {['khmer', 'english', 'french', 'chinese'].map(langKey => (
                        <span key={langKey} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 rounded-full text-xs font-bold text-brand-navy dark:text-gray-200 uppercase tracking-widest shadow-sm">
                            {t(langKey as any)}
                        </span>
                    ))}
                 </div>
               </Section>
            </div>
         </div>
      </section>

      {/* 3. Values Section - Text Left, Cards Right */}
      <section className="py-24 bg-white dark:bg-brand-dark transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="grid md:grid-cols-2 gap-16 items-center">
                 <Section className="order-2 md:order-1">
                     <div className="space-y-6">
                        {[
                            { title: t('professionalism'), icon: Award, desc: t('profDesc') },
                            { title: t('integrityTitle'), icon: Shield, desc: t('integrityDesc') },
                            { title: t('efficiency'), icon: CheckCircle2, desc: t('efficiencyDesc') }
                        ].map((item, idx) => (
                           <div key={idx} className="flex gap-6 p-6 rounded-sm border border-gray-100 dark:border-white/10 hover:border-brand-gold/50 hover:shadow-lg transition-all duration-300 group bg-white dark:bg-white/5">
                               <div className="bg-brand-gray dark:bg-white/10 p-3 rounded-full h-fit group-hover:bg-brand-navy transition-colors">
                                   <item.icon className="h-6 w-6 text-brand-navy dark:text-white group-hover:text-brand-gold transition-colors" />
                               </div>
                               <div>
                                   <h4 className="font-serif font-bold text-lg text-brand-navy dark:text-white mb-2">{item.title}</h4>
                                   <p className="text-gray-500 dark:text-gray-400 text-sm font-light">{item.desc}</p>
                               </div>
                           </div>
                        ))}
                     </div>
                 </Section>

                 <Section className="order-1 md:order-2">
                     <h3 className="text-3xl font-serif font-bold text-brand-navy dark:text-white mb-6">{t('clientCentricTitle')}</h3>
                     <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light mb-8 text-justify">
                        {aboutText[2]}
                     </p>
                     <div className="p-6 bg-brand-gold/10 border border-brand-gold/20 rounded-sm">
                        <p className="text-brand-navy dark:text-brand-gold italic font-serif text-lg">
                           "{t('trustedPartnerQuote')}"
                        </p>
                     </div>
                 </Section>
             </div>
          </div>
      </section>

      {/* 4. Clients & Location - Dark Section */}
      <section className="py-24 bg-brand-navy relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
             <Section>
                 <Building2 className="h-16 w-16 text-brand-gold mx-auto mb-8 opacity-80" />
                 <h3 className="text-3xl font-serif font-bold text-white mb-8">{t('ourClientele')}</h3>
                 <p className="text-xl text-gray-300 leading-relaxed font-light mb-12">
                    {aboutText[3]}
                 </p>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[t('multinational'), t('intlInvestors'), t('realEstateDev'), t('localCorps')].map((client, i) => (
                        <div key={i} className="p-4 border border-white/10 rounded-sm hover:bg-white/5 transition-colors">
                            <p className="text-brand-gold text-sm font-bold uppercase tracking-wider">{client}</p>
                        </div>
                    ))}
                 </div>

                 <div className="mt-16">
                    <Link to="/contact" className="inline-block bg-brand-gold text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-brand-navy transition-all duration-300 shadow-lg">
                        {t('partnerWithUs')}
                    </Link>
                 </div>
             </Section>
          </div>
      </section>
    </div>
  );
};

export default About;
