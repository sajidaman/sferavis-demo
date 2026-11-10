import React from 'react';
import { PageId } from '../types';
import { Logo } from './Logo';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onLaunchSferavis?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onLaunchSferavis }) => {
  return (
    <footer className="sferavis-site relative z-10 w-full bg-[#08080a] border-t border-zinc-800 text-zinc-400 text-xs transition-colors duration-200 font-lexend selection:bg-[#A30000] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Top Disclaimer / Mission Heritage strip */}
        <div className="pb-8 mb-8 border-b border-zinc-800 text-xs leading-relaxed space-y-2 text-zinc-400 font-merriweather border-l-4 border-l-[#A30000] pl-4">
          <p>
            1. SPHEREx (Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices Explorer) is a NASA Astrophysics Medium-Class Explorer (MIDEX) mission led by the California Institute of Technology (Caltech) and the Jet Propulsion Laboratory (JPL).
          </p>
          <p>
            2. SFERAvis provides hyperspectral cube synthesis, all-sky data reduction, and coordinate-aligned spectral extraction across the 102 near-infrared channels (0.75 – 5.0 µm) with resolution R = 41 to 135.
          </p>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          <div>
            <h4 className="text-xs font-oswald uppercase font-bold text-white tracking-wider mb-4">
              Explore SFERAvis
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Overview & Vision
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('spherex')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  The SPHEREx Mission
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchSferavis}
                  className="text-[#A30000] hover:text-white font-bold uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Launch Sferavis</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tutorials')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  102-Band SED Analysis
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-oswald uppercase font-bold text-white tracking-wider mb-4">
              Science & Learning
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('tutorials')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Quickstart: FITS Ingestion
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tutorials')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Water & CO₂ Ice Detection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tutorials')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Billion-Galaxy Redshift Sieve
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('documentations')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Laboratory Ice Standards
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-oswald uppercase font-bold text-white tracking-wider mb-4">
              Developer & API
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('documentations')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  sferavis Python SDK
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('documentations')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  REST Spectral Endpoints
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('documentations')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  FITS Cube HDU Standards
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('documentations')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Interactive Query Console
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-oswald uppercase font-bold text-white tracking-wider mb-4">
              Consortium & Partners
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('team')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Mission Leadership
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('team')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Caltech / JPL / KASI / CfA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('team')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Peer-Reviewed Publications
                </button>
              </li>
              <li>
                <a
                  href="https://spherex.caltech.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <span>NASA SPHEREx Caltech</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Wordmark & Legal Bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <span className="text-xs text-zinc-500">
              Copyright © 2026 SFERAvis Astrophysics Consortium. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500 font-lexend">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Terms of Use</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Open Source (BSD-3)</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Data Release Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
