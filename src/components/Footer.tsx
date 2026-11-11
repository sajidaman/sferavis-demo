import React from 'react';
import { PageId } from '../types';
import { Logo } from './Logo';
import { ExternalLink, ArrowUpRight, Github, Linkedin, Twitter, Instagram, Facebook, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onLaunchSferavis?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onLaunchSferavis }) => {
  return (
    <footer className="sferavis-site sferavis-footer relative z-10 w-full bg-white dark:bg-[#070b14] border-t border-zinc-200 dark:border-slate-800 text-zinc-600 dark:text-zinc-400 text-xs transition-colors duration-200 font-lexend selection:bg-[#A30000] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Top Disclaimer / Mission Heritage strip */}
        <div className="pb-8 mb-8 border-b border-zinc-200 dark:border-slate-800 text-xs leading-relaxed space-y-2 text-zinc-700 dark:text-zinc-400 font-merriweather border-l-4 border-l-[#A30000] pl-4">
          <p>
            1. SPHEREx (Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices Explorer) is a NASA Astrophysics Medium-Class Explorer (MIDEX) mission led by the California Institute of Technology (Caltech) and the Jet Propulsion Laboratory (JPL).
          </p>
          <p>
            2. Sferavis provides hyperspectral cube synthesis, all-sky data reduction, and coordinate-aligned spectral extraction across the 102 near-infrared channels (0.75 – 5.0 µm) with resolution R = 41 to 135.
          </p>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          <div>
            <h4 className="text-xs font-oswald uppercase font-bold text-zinc-950 dark:text-white tracking-wider mb-4 transition-colors">
              Explore Sferavis
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Overview & Vision
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('spherex')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  The SPHEREx Mission
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchSferavis}
                  className="text-[#A30000] hover:text-[#8B0000] dark:hover:text-white font-bold uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Launch Sferavis</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tutorials')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  102-Band SED Analysis
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-oswald uppercase font-bold text-zinc-950 dark:text-white tracking-wider mb-4 transition-colors">
              Science & Learning
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('tutorials')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Quickstart: FITS Ingestion
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tutorials')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Water & CO₂ Ice Detection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tutorials')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Billion-Galaxy Redshift Sieve
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('documentations')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Laboratory Ice Standards
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-oswald uppercase font-bold text-zinc-950 dark:text-white tracking-wider mb-4 transition-colors">
              Developer & API
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('documentations')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  sferavis Python SDK
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('documentations')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  REST Spectral Endpoints
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('documentations')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  FITS Cube HDU Standards
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('documentations')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Interactive Query Console
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-oswald uppercase font-bold text-zinc-950 dark:text-white tracking-wider mb-4 transition-colors">
              Consortium & Partners
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('team')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Mission Leadership
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('team')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Caltech / JPL / KASI / CfA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('publications')}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Publications & Research
                </button>
              </li>
              <li>
                <a
                  href="https://spherex.caltech.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  <span>NASA SPHEREx Caltech</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Wordmark, Social Links & Legal Bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-slate-800 flex flex-col items-center gap-7">
          <div className="flex flex-wrap items-center justify-center gap-3" aria-label="Sferavis social media">
            <a href="https://www.spaceappschallenge.org/2026/find-a-team/sferavis/" target="_blank" rel="noopener noreferrer" title="NASA Space Apps Team Profile" aria-label="NASA Space Apps Team Profile" className="mr-2 inline-flex items-center gap-1.5 border-r border-zinc-300 pr-4 text-[10px] font-semibold uppercase tracking-wider text-[#A30000] transition-colors hover:text-[#8B0000] dark:border-slate-700">
              NASA Space Apps Team Profile <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            {[
              { label: 'GitHub', Icon: Github },
              { label: 'LinkedIn', Icon: Linkedin },
              { label: 'X', Icon: Twitter },
              { label: 'Instagram', Icon: Instagram },
              { label: 'Facebook', Icon: Facebook },
              { label: 'Email', Icon: Mail },
            ].map(({ label, Icon }) => (
              <span key={label} title={label} aria-label={label} className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 transition-colors hover:border-[#A30000] hover:text-[#A30000] dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-200 dark:hover:border-[#A30000] dark:hover:text-white">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">{label}</span>
              </span>
            ))}
          </div>
          <div className="flex w-full flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <span className="text-xs text-zinc-500">
              Copyright © 2026 Sferavis Astrophysics Consortium. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500 font-lexend">
            <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">Terms of Use</span>
            <span>·</span>
            <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">Open Source (BSD-3)</span>
            <span>·</span>
            <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">Data Release Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
