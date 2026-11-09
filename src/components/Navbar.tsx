import React, { useState } from 'react';
import { PageId } from '../types';
import { Logo } from './Logo';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onLaunchSferavis: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isDark,
  onToggleTheme,
  onLaunchSferavis,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact 5 pages requested (Atlas excluded)
  const navItems: Array<{ id: PageId; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'spherex', label: 'SPHEREx' },
    { id: 'tutorials', label: 'Tutorials' },
    { id: 'documentations', label: 'Documentations' },
    { id: 'team', label: 'The Team' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/95 dark:bg-[#08080a]/95 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Big prominent text Logo without icon */}
        <button
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center cursor-pointer text-left shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] rounded py-1"
          aria-label="SFERAvis Home"
        >
          <Logo size="md" />
        </button>

        {/* Zone 2: 5 clean single-line nav links using Lexend */}
        <nav className="hidden md:flex items-center gap-7 font-lexend uppercase text-xs tracking-widest">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative py-2 cursor-pointer whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? 'text-black dark:text-white font-bold'
                    : 'text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white font-medium'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#A30000] rounded-none" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action ('Launch Sferavis') + theme toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent dark:border-zinc-800"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onLaunchSferavis}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-lexend uppercase font-bold tracking-wider text-white bg-[#A30000] hover:bg-[#8B0000] active:bg-[#700000] transition-all duration-200 shadow-md cursor-pointer whitespace-nowrap"
          >
            <span>Launch Sferavis</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#0d0d12]/95 backdrop-blur-2xl px-5 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2.5 px-3 text-xs font-lexend uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'border-l-4 border-[#A30000] bg-zinc-100 text-black dark:bg-zinc-900 dark:text-white font-bold pl-3'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => {
                onLaunchSferavis();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-lexend uppercase tracking-wider font-bold text-white bg-[#A30000] hover:bg-[#8B0000] cursor-pointer"
            >
              <span>Launch Sferavis</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
