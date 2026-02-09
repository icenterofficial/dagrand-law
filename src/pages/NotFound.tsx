import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, FileText } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen bg-brand-gray flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
    {/* Abstract background */}
    <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-navy/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

    <div className="relative z-10 max-w-lg w-full">
        <h1 className="text-9xl font-serif font-bold text-brand-navy/10 select-none">404</h1>
        <h2 className="text-3xl font-serif font-bold text-brand-navy -mt-16 mb-4 relative z-20">Page Not Found</h2>
        <p className="text-gray-600 mb-8 font-light">
            We're sorry, the page you requested could not be found. Please go back to the homepage or try navigating to one of our main sections below.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <Link to="/practice-areas" className="flex items-center gap-4 bg-white p-4 rounded-sm border border-gray-100 hover:border-brand-gold hover:shadow-md transition-all group text-left">
                <div className="bg-brand-gray p-2 rounded-full group-hover:bg-brand-navy transition-colors">
                    <Scale className="h-5 w-5 text-brand-navy group-hover:text-brand-gold" />
                </div>
                <div>
                    <span className="block font-serif font-bold text-brand-navy">Practice Areas</span>
                    <span className="text-xs text-gray-500">Explore our expertise</span>
                </div>
            </Link>
             <Link to="/updates" className="flex items-center gap-4 bg-white p-4 rounded-sm border border-gray-100 hover:border-brand-gold hover:shadow-md transition-all group text-left">
                <div className="bg-brand-gray p-2 rounded-full group-hover:bg-brand-navy transition-colors">
                    <FileText className="h-5 w-5 text-brand-navy group-hover:text-brand-gold" />
                </div>
                <div>
                    <span className="block font-serif font-bold text-brand-navy">Legal Updates</span>
                    <span className="text-xs text-gray-500">Latest news & insights</span>
                </div>
            </Link>
        </div>

        <Link to="/" className="inline-flex items-center gap-2 bg-brand-gold text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-sm hover:bg-brand-navy transition-all duration-300 shadow-lg hover:-translate-y-1">
            <ArrowLeft className="h-4 w-4" /> Return Home
        </Link>
    </div>
  </div>
);

export default NotFound;