import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { SpherexPage } from './pages/SpherexPage';
import { TutorialsPage } from './pages/TutorialsPage';
import { DocsPage } from './pages/DocsPage';
import { TeamPage } from './pages/TeamPage';
import { ContactPage } from './pages/ContactPage';
import { PublicationsPage } from './pages/PublicationsPage';
import { ArchivePage } from './pages/ArchivePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { LicensingPage } from './pages/LicensingPage';
import { LaunchSferavisModal } from './components/LaunchSferavisModal';
import { AccessibilityControls } from './components/AccessibilityControls';
import { RediumChat } from './components/RediumChat';

import { AstroBackground } from './components/AstroBackground';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('sferavis-theme') === 'dark');
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);

  // Remember each visitor's theme preference on this device/browser.
  useEffect(() => {
    localStorage.setItem('sferavis-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Sync dark class on <html> document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle URL hash changes if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      if (['home', 'spherex', 'tutorials', 'documentations', 'team', 'contact', 'publications', 'archive', 'privacy', 'terms', 'licensing'].includes(hash)) {
        setCurrentPage(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden">
      {/* Dynamic Astro Background with celestial grid, constellations, and starfield */}
      <AstroBackground isDark={isDark} />
      
      <a className="sferavis-skip-link" href="#main-content">Skip to main content</a>

      {/* Apple-style Frosted Glass Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onLaunchSferavis={() => setIsLaunchModalOpen(true)}
      />

      {/* Main Page View with Animated Cross-Dissolve Transitions */}
      <main id="main-content" tabIndex={-1} aria-label="Main content" className="sferavis-site flex-1 w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] as const }}
            className="w-full"
          >
            {currentPage === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                onLaunchSferavis={() => setIsLaunchModalOpen(true)}
              />
            )}
            {currentPage === 'spherex' && (
              <SpherexPage onNavigate={handleNavigate} />
            )}
            {currentPage === 'tutorials' && (
              <TutorialsPage onNavigate={handleNavigate} />
            )}
            {currentPage === 'documentations' && <DocsPage onNavigate={handleNavigate} />}
            {currentPage === 'team' && <TeamPage onNavigate={handleNavigate} />}
            {currentPage === 'contact' && <ContactPage />}
            {currentPage === 'publications' && <PublicationsPage onNavigate={handleNavigate} />}
            {currentPage === 'archive' && <ArchivePage onNavigate={handleNavigate} />}
            {currentPage === 'privacy' && <PrivacyPage />}
            {currentPage === 'terms' && <TermsPage />}
            {currentPage === 'licensing' && <LicensingPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Apple-style Quiet Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Launch Sferavis Modal */}
      <LaunchSferavisModal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        isDark={isDark}
      />

      <RediumChat />
      <AccessibilityControls isDark={isDark} onSetDark={setIsDark} />
    </div>
  );
}
