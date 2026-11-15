import React from 'react';
import { PageId } from '../types';
import { Logo } from './Logo';
import { ExternalLink, Github, Linkedin, Instagram, Facebook, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="sferavis-site sferavis-footer relative z-10 w-full bg-white dark:bg-[#070b14] border-t border-zinc-200 dark:border-slate-800 text-zinc-600 dark:text-zinc-400 text-xs transition-colors duration-200 font-lexend selection:bg-[#A30000] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main Footer Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 mb-10">
          <div>
            <h4 className="text-xs font-oswald uppercase font-bold text-zinc-950 dark:text-white tracking-wider mb-4 transition-colors">
              Organization
            </h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => onNavigate('home')} className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left">About Sferavis</button></li>
              <li><button onClick={() => onNavigate('team')} className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left">Team &amp; Leadership</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left">Join Sferavis</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-oswald uppercase font-bold text-zinc-950 dark:text-white tracking-wider mb-4 transition-colors">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => onNavigate('spherex')} className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left">The SPHEREx Mission</button></li>
              <li><button onClick={() => onNavigate('archive')} className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left">Archive</button></li>
              <li><button onClick={() => onNavigate('publications')} className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left">Publications</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-oswald uppercase font-bold text-zinc-950 dark:text-white tracking-wider mb-4 transition-colors">
              Science &amp; Research
            </h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => onNavigate('documentations')} className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left">Scientific Documentation</button></li>
              <li><button onClick={() => onNavigate('documentations')} className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left">Research &amp; Methodology</button></li>
              <li><button onClick={() => onNavigate('tutorials')} className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left">Learning Resources</button></li>
              <li><button onClick={() => onNavigate('archive')} className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left">Data &amp; Tools</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-oswald uppercase font-bold text-zinc-950 dark:text-white tracking-wider mb-4 transition-colors">
              Connect
            </h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => onNavigate('contact')} className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left">Contact Us</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left">Collaborate With Us</button></li>
              <li><a href="https://www.instagram.com/sferav1s/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Instagram <ExternalLink className="inline w-3 h-3" /></a></li>
              <li><a href="https://github.com/sajidaman/sferavis-demo" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-950 dark:hover:text-white transition-colors">GitHub <ExternalLink className="inline w-3 h-3" /></a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Wordmark, Social Links & Legal Bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-slate-800 flex flex-col items-center gap-7">
          <div className="grid w-full grid-cols-4 sm:grid-cols-7 items-start gap-x-2 gap-y-4" aria-label="Sferavis social media">
            <a href="https://www.spaceappschallenge.org/2026/find-a-team/sferavis/" target="_blank" rel="noopener noreferrer" title="NASA Space Apps Team Profile" aria-label="NASA Space Apps Team Profile" className="group inline-flex w-full flex-col items-center gap-2 text-zinc-700 dark:text-zinc-200 transition-colors hover:text-[#A30000] focus-visible:text-[#A30000]">
              <span className="flex h-12 w-12 items-center justify-center">
                <span role="img" aria-label="NASA Space Apps icon" className="h-6 w-6 bg-current transition-colors" style={{ mask: `url("${import.meta.env.BASE_URL}assets/space-apps-asteroid-icon.svg") center / contain no-repeat`, WebkitMask: `url("${import.meta.env.BASE_URL}assets/space-apps-asteroid-icon.svg") center / contain no-repeat` }} />
              </span>
              <span className="text-[10px] font-medium tracking-wide opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Space Apps Profile</span>
            </a>
            {[
              { label: 'GitHub', handle: 'sajidaman/sferavis-demo', href: 'https://github.com/sajidaman/sferavis-demo', Icon: Github },
              { label: 'LinkedIn', handle: 'Sferavis', href: 'https://www.linkedin.com/company/sferavis?utm_source=ig&utm_medium=social&utm_content=link_in_bio', Icon: Linkedin },
              { label: 'X', handle: '@sferavis', href: 'https://x.com/sferavis', Icon: null },
              { label: 'Instagram', handle: '@sferav1s', href: 'https://www.instagram.com/sferav1s/', Icon: Instagram },
              { label: 'Facebook', handle: 'Sferavis', href: 'https://www.facebook.com/profile.php?id=61595873841241&utm_source=ig&utm_medium=social&utm_content=link_in_bio', Icon: Facebook },
              { label: 'Email', handle: 'contact.sferavis@gmail.com', href: 'mailto:contact.sferavis@gmail.com', Icon: Mail },
            ].map(({ label, handle, href, Icon }) => (
              <a key={label} href={href} target={label === 'Email' ? undefined : '_blank'} rel={label === 'Email' ? undefined : 'noopener noreferrer'} title={handle} aria-label={label + ' ' + handle} className="group inline-flex w-full flex-col items-center gap-2 text-zinc-700 dark:text-zinc-200 transition-colors hover:text-[#A30000] focus-visible:text-[#A30000]">
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
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.BASE_URL}sferavis-icon.svg`}
              alt="Sferavis icon"
              className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 object-contain"
            />
            <Logo size="md" />
            <span className="flex flex-col text-xs text-zinc-500 leading-relaxed">
              <span>© 2026 Sferavis. All rights reserved.</span>
              <span>Built for NASA Space Apps Challenge 2026</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-zinc-500 font-lexend">
            <a
              href="#privacy"
              onClick={(event) => {
                event.preventDefault();
                onNavigate('privacy');
              }}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="#terms"
              onClick={(event) => {
                event.preventDefault();
                onNavigate('terms');
              }}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Terms of Use
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="#licensing"
              onClick={(event) => {
                event.preventDefault();
                onNavigate('licensing');
              }}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Open Source &amp; Licences
            </a>
          </div>
        </div>

      </div>
      </div>
    </footer>
  );
};
