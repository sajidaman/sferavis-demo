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
          <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-4" aria-label="Sferavis social media">
            <a href="https://www.spaceappschallenge.org/2026/find-a-team/sferavis/" target="_blank" rel="noopener noreferrer" title="NASA Space Apps Team Profile" aria-label="NASA Space Apps Team Profile" className="group inline-flex min-w-[54px] flex-col items-center gap-2 text-zinc-700 dark:text-zinc-200 transition-colors hover:text-[#A30000] focus-visible:text-[#A30000]">
              <span className="flex h-12 w-12 items-center justify-center">
                <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Space_Apps_Motif_Logo_-_1-Color_Black.svg" alt="NASA Space Apps logo" className="h-10 w-10 object-contain transition-all group-hover:brightness-0 group-hover:opacity-80" style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(89%) saturate(2300%) hue-rotate(203deg) brightness(96%) contrast(96%)' }} />
              </span>
              <span className="text-[10px] font-medium tracking-wide opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Space Apps Profile</span>
            </a>
            {[
              { label: 'LinkedIn', handle: 'Sferavis', href: 'https://www.linkedin.com/company/sferavis?utm_source=ig&utm_medium=social&utm_content=link_in_bio', Icon: Linkedin },
              { label: 'X', handle: '@sferavis', href: 'https://x.com/sferavis', Icon: null },
              { label: 'Instagram', handle: '@sferav1s', href: 'https://www.instagram.com/sferav1s/', Icon: Instagram },
              { label: 'Facebook', handle: 'Sferavis', href: 'https://www.facebook.com/profile.php?id=61595873841241&utm_source=ig&utm_medium=social&utm_content=link_in_bio', Icon: Facebook },
              { label: 'Email', handle: 'contact.sferavis@gmail.com', href: 'mailto:contact.sferavis@gmail.com', Icon: Mail },
            ].map(({ label, handle, href, Icon }) => (
              <a key={label} href={href} target={label === 'Email' ? undefined : '_blank'} rel={label === 'Email' ? undefined : 'noopener noreferrer'} title={handle} aria-label={label + ' ' + handle} className="group inline-flex min-w-[54px] flex-col items-center gap-2 text-zinc-700 dark:text-zinc-200 transition-colors hover:text-[#A30000] focus-visible:text-[#A30000]">
                <span className="flex h-12 w-12 items-center justify-center">
                  {label === 'X' ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current transition-colors group-hover:text-[#A30000]">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.963 6.817H1.685l7.73-8.835L1.26 2.25h6.826l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ) : Icon ? <Icon className="h-6 w-6 transition-colors group-hover:text-[#A30000]" strokeWidth={2} /> : null}
                </span>
                <span className="text-[10px] font-medium tracking-wide opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{handle}</span>
              </a>
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
      </div>
    </footer>
  );
};
