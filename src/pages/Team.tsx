
import { Phone, Mail, Globe, Award, BookOpen, User } from 'lucide-react';
import { TEAM_INTRO, TEAM_INTRO_CN, TEAM_MEMBERS } from '../../constants';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import { SEO } from '../components/SEO';
import { ImageWithSkeleton } from '../components/ImageWithSkeleton';
import { useLanguage } from '../contexts/LanguageContext';

const Team = () => {
  const { t, getContent } = useLanguage();
  const teamIntro = getContent(TEAM_INTRO, TEAM_INTRO_CN);

  return (
    <div className="bg-white dark:bg-brand-dark min-h-screen font-sans transition-colors duration-300">
      <SEO 
        title={t('team')}
        description="Meet the expert legal team at Dagrand Law Office. Our highly skilled lawyers offer deep local expertise with a global perspective."
      />
      <PageHeader 
          title={t('team')} 
          subtitle={t('teamSubtitle')} 
      />

      {/* Intro Section - Redesigned */}
      <section className="py-20 bg-white dark:bg-brand-dark relative overflow-hidden transition-colors duration-300">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gray dark:bg-white/5 -z-10 skew-x-12 opacity-50 origin-top"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
               {/* Left: Main Statement */}
               <div className="lg:col-span-5">
                  <Section>
                      <div className="relative">
                          <div className="absolute -top-10 -left-10 text-9xl text-brand-gold/10 font-serif font-bold select-none">"</div>
                          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy dark:text-white leading-tight relative z-10">
                             {t('teamSynergy')}
                          </h2>
                      </div>
                      <div className="mt-8 w-20 h-1 bg-brand-gold"></div>
                      <p className="mt-8 text-lg text-brand-navy dark:text-gray-200 font-medium italic">
                         {teamIntro[0]}
                      </p>
                  </Section>
               </div>

               {/* Right: Detailed text */}
               <div className="lg:col-span-7 space-y-8 text-gray-600 dark:text-gray-300 font-light text-lg leading-relaxed">
                   <Section>
                       <p>{teamIntro[1]}</p>
                   </Section>
                   <Section>
                       <div className="p-8 bg-brand-navy text-gray-300 rounded-sm relative overflow-hidden shadow-lg">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold opacity-10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                           <p className="relative z-10">{teamIntro[2]}</p>
                       </div>
                   </Section>
               </div>
            </div>
         </div>
      </section>

      {/* Team Members List */}
      <section className="py-20 bg-brand-gray dark:bg-[#0b1d33] relative transition-colors duration-300">
         {/* Decorative background */}
         <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white dark:from-brand-dark to-transparent"></div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-24">
            {TEAM_MEMBERS.map((member, index) => {
               const name = getContent(member.name, member.name_cn);
               const role = getContent(member.role, member.role_cn);
               const languages = getContent(member.languages, member.languages_cn);
               const bio = getContent(member.bio, member.bio_cn);
               const education = getContent(member.education, member.education_cn);

               return (
               <Section key={index}>
                  <div className={`flex flex-col lg:flex-row gap-0 lg:gap-16 items-stretch ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                      
                      {/* Image Column */}
                      <div className="lg:w-5/12 relative group z-10">
                          {/* Decorative Frame */}
                          <div className={`absolute inset-0 border-2 border-brand-gold/30 rounded-sm hidden lg:block transition-transform duration-500 group-hover:scale-95 z-0 ${index % 2 === 1 ? 'translate-x-4 -translate-y-4' : '-translate-x-4 translate-y-4'}`}></div>
                          
                          <div className="relative h-[500px] lg:h-full lg:min-h-[600px] rounded-t-sm lg:rounded-sm rounded-b-none lg:rounded-b-sm overflow-hidden shadow-2xl z-10">
                              <ImageWithSkeleton 
                                  src={member.image} 
                                  alt={name} 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 object-top"
                                  containerClassName="w-full h-full"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent opacity-60 hidden lg:block"></div>
                              
                              {/* Mobile Name Overlay (Moved to TOP) */}
                              <div className="absolute top-0 left-0 right-0 lg:hidden">
                                  {/* Stronger gradient for legibility */}
                                  <div className="bg-gradient-to-b from-brand-navy via-brand-navy/90 to-transparent pt-10 pb-24 px-6">
                                      <div className="relative z-10 border-l-4 border-brand-gold pl-4">
                                          <h3 className="text-3xl font-serif font-bold text-white mb-2 tracking-wide drop-shadow-md leading-tight">
                                              {name}
                                          </h3>
                                          <p className="text-brand-gold font-bold uppercase tracking-widest text-xs bg-brand-navy/30 inline-block px-2 py-1 rounded backdrop-blur-md border border-brand-gold/10">
                                              {role}
                                          </p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Content Column */}
                      <div className="lg:w-7/12 flex flex-col justify-center lg:py-12">
                          <div className="bg-white dark:bg-brand-dark p-8 pt-10 lg:p-12 rounded-b-sm lg:rounded-sm rounded-t-none lg:rounded-t-sm shadow-sm border border-gray-100 dark:border-white/10 border-t-0 lg:border-t relative z-0">
                              {/* Desktop Header */}
                              <div className="hidden lg:block mb-8 border-b border-gray-100 dark:border-white/10 pb-6">
                                  <div className="flex items-center justify-between">
                                     <div>
                                        <h3 className="text-4xl font-serif font-bold text-brand-navy dark:text-white mb-2">{name}</h3>
                                        <p className="text-brand-gold font-bold uppercase tracking-[0.2em] text-sm">{role}</p>
                                     </div>
                                     <User className="h-10 w-10 text-brand-gray dark:text-white/10" />
                                  </div>
                              </div>

                              {/* Languages */}
                              <div className="flex flex-wrap items-center gap-3 mb-6">
                                  <div className="flex items-center gap-2 bg-brand-gray dark:bg-white/10 px-3 py-1 rounded-full border border-gray-200 dark:border-white/5">
                                      <Globe className="h-4 w-4 text-brand-navy dark:text-gray-300" />
                                      <span className="text-xs font-bold text-brand-navy dark:text-gray-300 uppercase tracking-wider">{t('languagesSpoken')}</span>
                                  </div>
                                  <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{languages}</span>
                              </div>

                              {/* Bio */}
                              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed font-light mb-8 text-lg text-justify">
                                  {bio.map((para: string, i: number) => (
                                      <p key={i}>{para}</p>
                                  ))}
                              </div>

                              {/* Education & Contact */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100 dark:border-white/10">
                                  <div>
                                      <div className="flex items-center gap-2 mb-3 text-brand-navy dark:text-white">
                                          <div className="bg-brand-navy/10 dark:bg-white/10 p-1.5 rounded-full">
                                            <BookOpen className="h-4 w-4 text-brand-navy dark:text-white" />
                                          </div>
                                          <span className="font-bold uppercase tracking-wider text-xs">{t('education')}</span>
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{education}</p>
                                  </div>
                                  
                                  <div className="space-y-3">
                                      <div className="flex items-center gap-2 mb-3 text-brand-navy dark:text-white">
                                          <div className="bg-brand-navy/10 dark:bg-white/10 p-1.5 rounded-full">
                                            <Award className="h-4 w-4 text-brand-navy dark:text-white" />
                                          </div>
                                          <span className="font-bold uppercase tracking-wider text-xs">{t('contact')}</span>
                                      </div>
                                      <a href={`tel:${member.contact.phone}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-navy dark:hover:text-white transition-colors group/link">
                                          <Phone className="h-4 w-4 text-gray-400 group-hover/link:text-brand-gold transition-colors" />
                                          {member.contact.phone}
                                      </a>
                                      <a href={`mailto:${member.contact.email}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-navy dark:hover:text-white transition-colors group/link">
                                          <Mail className="h-4 w-4 text-gray-400 group-hover/link:text-brand-gold transition-colors" />
                                          {member.contact.email}
                                      </a>
                                  </div>
                              </div>
                          </div>
                      </div>

                  </div>
               </Section>
            );
            })}
         </div>
      </section>
    </div>
  );
};

export default Team;
