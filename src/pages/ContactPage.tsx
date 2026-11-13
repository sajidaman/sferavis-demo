import React from 'react';
import { ArrowUpRight, Mail, Github, Linkedin, Instagram, Facebook, Send, MessageCircle, FlaskConical, Handshake } from 'lucide-react';

const CONTACT_EMAIL = 'contact.sferavis@gmail.com';

const channels = [
  { label: 'Email', detail: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, Icon: Mail },
  { label: 'LinkedIn', detail: 'Sferavis', href: 'https://www.linkedin.com/company/sferavis/', Icon: Linkedin },
  { label: 'Instagram', detail: '@sferav1s', href: 'https://www.instagram.com/sferav1s/', Icon: Instagram },
  { label: 'Facebook', detail: 'Sferavis', href: 'https://www.facebook.com/profile.php?id=61595873841241', Icon: Facebook },
  { label: 'X', detail: '@sferavis', href: 'https://x.com/sferavis', Icon: null },
  { label: 'GitHub', detail: 'Sferavis Demo Repository', href: 'https://github.com/sajidaman/sferavis-demo', Icon: Github },
];

const inquiryTypes = [
  { title: 'Research & science', description: 'Discuss scientific ideas, research interests, data, or potential projects.', Icon: FlaskConical, subject: 'Research enquiry' },
  { title: 'Collaboration', description: 'Explore partnerships, joint initiatives, or opportunities to contribute to Sferavis.', Icon: Handshake, subject: 'Collaboration enquiry' },
  { title: 'General enquiries', description: 'Questions, feedback, media requests, or anything else you would like to share.', Icon: MessageCircle, subject: 'General enquiry' },
];

export const ContactPage: React.FC = () => (
  <div className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] dark:text-white">
    <div className="pointer-events-none absolute left-1/2 top-28 h-80 w-[min(90vw,52rem)] -translate-x-1/2 rounded-full bg-[#a30000]/[0.07] blur-[120px]" aria-hidden="true" />
    <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-14">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a30000]">Start a conversation</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-[#171b22] sm:text-6xl dark:text-white">
          Contact <span className="text-[#a30000]">Sferavis.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#737d89] sm:text-base dark:text-zinc-400">
          Have a question, an idea, or an opportunity to work together? We welcome conversations across science, research, technology, and the many disciplines that connect them.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Hello%20Sferavis`}
          className="mx-auto mt-8 inline-flex items-center gap-2 bg-[#a30000] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.17em] text-white transition-colors hover:bg-[#850000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a30000] focus-visible:ring-offset-2"
        >
          <Send size={14} /> Email Sferavis <ArrowUpRight size={14} />
        </a>
      </header>

      <section aria-labelledby="contact-topics-title" className="mx-auto mt-20 max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a30000]">What brings you here?</p>
          <h2 id="contact-topics-title" className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#171b22] sm:text-3xl dark:text-white">Let’s find the right conversation.</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {inquiryTypes.map(({ title, description, Icon, subject }) => (
            <a key={title} href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`} className="group flex min-h-52 flex-col border border-black/[0.07] bg-white/75 p-6 transition-all hover:-translate-y-1 hover:border-[#a30000]/35 hover:shadow-xl dark:border-white/[0.08] dark:bg-[#0d131b]/80">
              <span className="flex h-11 w-11 items-center justify-center border border-[#a30000]/20 bg-[#a30000]/[0.05] text-[#a30000]"><Icon size={20} strokeWidth={1.7} /></span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#202630] group-hover:text-[#a30000] dark:text-white">{title}</h3>
              <p className="mt-2 flex-1 text-xs leading-6 text-[#737d89] dark:text-zinc-400">{description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#a30000]">Get in touch <ArrowUpRight size={13} /></span>
            </a>
          ))}
        </div>
      </section>

      <section aria-labelledby="contact-channels-title" className="mx-auto mt-20 max-w-5xl border-t border-black/[0.08] pt-14 dark:border-white/[0.09]">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a30000]">Stay connected</p>
          <h2 id="contact-channels-title" className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#171b22] sm:text-3xl dark:text-white">Find us across the web.</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map(({ label, detail, href, Icon }) => (
            <a key={label} href={href} target={label === 'Email' ? undefined : '_blank'} rel={label === 'Email' ? undefined : 'noopener noreferrer'} className="flex items-center gap-4 border border-black/[0.07] bg-white/60 px-4 py-4 transition-colors hover:border-[#a30000]/35 hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.025] dark:hover:bg-white/[0.05]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#a30000]/[0.07] text-[#a30000]">
                {label === 'X' ? <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.963 6.817H1.685l7.73-8.835L1.26 2.25h6.826l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> : Icon ? <Icon size={17} /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-[#303944] dark:text-zinc-200">{label}</span>
                <span className="mt-1 block truncate text-[11px] text-[#858e99] dark:text-zinc-500">{detail}</span>
              </span>
              <ArrowUpRight size={14} className="shrink-0 text-[#a30000]" />
            </a>
          ))}
        </div>
      </section>

      <p className="mt-14 text-center text-[10px] leading-6 tracking-wide text-[#929aa5] dark:text-zinc-600">
        Sferavis is a growing, multidisciplinary collective. We look forward to hearing from curious minds, researchers, and potential collaborators.
      </p>
    </div>
  </div>
);
