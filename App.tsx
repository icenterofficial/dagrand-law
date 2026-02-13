
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './src/components/Layout';
import { PageTransition } from './src/components/PageTransition';
import { Toaster } from './src/components/Toast';
import Home from './src/pages/Home';
import About from './src/pages/About';
import Team from './src/pages/Team';
import PracticeList from './src/pages/PracticeList';
import PracticeDetail from './src/pages/PracticeDetail';
import Updates from './src/pages/Updates';
import UpdateDetail from './src/pages/UpdateDetail';
import Contact from './src/pages/Contact';
import NotFound from './src/pages/NotFound';
import Admin from './src/pages/Admin';
import PrivacyPolicy from './src/pages/PrivacyPolicy';
import TermsOfService from './src/pages/TermsOfService';

// Component to handle public page transitions
const PublicContent = () => {
  const location = useLocation();
  
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/team" element={<PageTransition><Team /></PageTransition>} />
          <Route path="/practice-areas" element={<PageTransition><PracticeList /></PageTransition>} />
          <Route path="/practice-areas/:id" element={<PageTransition><PracticeDetail /></PageTransition>} />
          <Route path="/updates" element={<PageTransition><Updates /></PageTransition>} />
          <Route path="/updates/:id" element={<PageTransition><UpdateDetail /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="/terms-of-service" element={<PageTransition><TermsOfService /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <HashRouter>
        <Toaster />
        <Routes>
          {/* Admin Route is standalone */}
          <Route path="/admin" element={<Admin />} />
          
          {/* All Public Routes capture here */}
          <Route path="/*" element={<PublicContent />} />
        </Routes>
      </HashRouter>
    </HelmetProvider>
  );
}
