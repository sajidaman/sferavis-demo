import React from 'react';

const Section: React.FC<{ number: string; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
  <section className="border-t border-black/[0.08] py-8 dark:border-white/[0.09]">
    <div className="grid gap-3 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-6">
      <p className="pt-1 font-mono text-xs tracking-widest text-[#A30000]">{number}</p>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[#171b22] dark:text-white">{title}</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#687384] dark:text-zinc-400">{children}</div>
      </div>
    </div>
  </section>
);

export const TermsPage: React.FC = () => (
  <div className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] dark:text-white">
    <div className="pointer-events-none absolute left-1/2 top-24 h-80 w-[min(90vw,52rem)] -translate-x-1/2 rounded-full bg-[#a30000]/[0.06] blur-[120px]" aria-hidden="true" />
    <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-14">
      <header className="mb-14 max-w-3xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a30000]">Legal &amp; conditions</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-[#171b22] sm:text-6xl dark:text-white">
          Terms of <span className="text-[#a30000]">Use.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#737d89] sm:text-base dark:text-zinc-400">
          These terms explain the conditions for accessing and using the Sferavis website, its educational resources, interactive tools, and AI assistant.
        </p>
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#858e99] dark:text-zinc-500">
          <span>Effective date: 14 November 2026</span>
          <span>Last updated: 14 November 2026</span>
        </div>
      </header>

      <div className="border-y border-black/[0.08] py-6 dark:border-white/[0.09]">
        <p className="text-sm leading-7 text-[#687384] dark:text-zinc-400">
          Sferavis is an independent, multidisciplinary science initiative. It is not an official NASA website, is not operated by NASA, and does not represent NASA or the SPHEREx mission team. By accessing or using this website, you agree to these Terms of Use. If you do not agree, please do not use the website.
        </p>
      </div>

      <div className="mt-2">
        <Section number="01" title="About Sferavis and these terms">
          <p>“Sferavis”, “we”, “us” and “our” refer to the team operating this website. “Website” means the Sferavis website and the features made available through it, including informational pages, scientific and educational resources, interactive astronomical visualisations, and Redium.</p>
          <p>These terms apply to visitors and users of the Website. Some features or third-party services may have additional terms, which will apply to your use of those services.</p>
        </Section>

        <Section number="02" title="Permitted use">
          <p>You may access the Website for lawful, personal, educational, scientific, and non-commercial purposes. You agree to use it responsibly and in a way that does not interfere with other visitors or the operation, security, or integrity of the Website.</p>
          <p>You must not attempt to gain unauthorised access to systems or data; probe, scan, or test vulnerabilities without permission; disrupt, overload, or interfere with the Website; introduce malware or harmful code; scrape or harvest information in a way that violates law or imposes unreasonable load; impersonate another person or misrepresent your affiliation; or use the Website to violate anyone’s rights or applicable law.</p>
        </Section>

        <Section number="03" title="Scientific and educational information">
          <p>The Website is provided for general scientific, educational, and informational purposes. Content may include explanations, illustrative examples, visualisations, derived measurements, simulated or demonstration data, and links to external scientific datasets. Not every displayed result is independently verified or suitable for research-grade use.</p>
          <p>You are responsible for evaluating the accuracy, completeness, provenance, uncertainty, and suitability of information before relying on it. Do not treat Website content as a substitute for primary data, peer review, professional advice, or independent scientific validation. Where possible, consult the cited source, original dataset, documentation, and relevant instrument or survey caveats.</p>
          <p>Scientific content and interactive tools may contain errors, approximations, incomplete coverage, or temporary service limitations. We may correct, update, remove, or replace content without notice.</p>
        </Section>

        <Section number="04" title="AI assistant and automated outputs">
          <p>Redium may generate responses using artificial intelligence. AI-generated content can be inaccurate, incomplete, outdated, misleading, or fabricated, including scientific references, calculations, and explanations. Outputs are not statements of fact or professional advice and should be independently checked before use.</p>
          <p>You remain responsible for decisions and actions based on AI-generated content. Do not rely on Redium for emergency, medical, legal, financial, or other high-stakes decisions. Do not submit passwords, payment details, confidential information, or sensitive personal information to the assistant.</p>
          <p>Your use of Redium may also be subject to the terms and privacy policies of the AI service provider. Please review the <a href="#privacy" onClick={(event) => { event.preventDefault(); window.location.hash = 'privacy'; window.dispatchEvent(new HashChangeEvent('hashchange')); }} className="font-medium text-[#A30000] underline decoration-[#A30000]/30 underline-offset-4">Sferavis Privacy Policy</a> for information about data processing.</p>
        </Section>

        <Section number="05" title="Intellectual property and attribution">
          <p>Unless a page or accompanying notice states otherwise, the Website’s original text, visual identity, logos, interface design, and original materials are owned by or used with permission by Sferavis and are protected by applicable intellectual-property laws. These terms do not transfer ownership to you.</p>
          <p>You may quote or refer to publicly available Sferavis materials for lawful educational, research, commentary, or non-commercial purposes, provided you do not misrepresent the source, remove applicable notices, or imply endorsement by Sferavis. Reproduction, redistribution, or commercial use of substantial portions of original Website content or branding requires prior permission unless permitted by law.</p>
          <p>Some datasets, imagery, software, and other materials are owned by third parties and remain subject to their own licences, terms, and attribution requirements. In particular, NASA, SPHEREx, IRSA, CDS, and other referenced resources retain their respective ownership and usage conditions. Acknowledging a source does not itself grant rights beyond the source’s licence.</p>
        </Section>

        <Section number="06" title="User submissions and communications">
          <p>If you send us feedback, suggestions, questions, or other material, you confirm that you have the right to share it and that it does not unlawfully disclose another person’s information or infringe their rights.</p>
          <p>You retain ownership of material you create. By sending material to Sferavis, you grant us permission to receive, review, store, and use it as reasonably necessary to respond to you, operate the Website, consider your suggestion, and maintain our records. We will not treat a private message as permission to publish it publicly. Any separate public-contribution feature will provide its own submission terms when introduced.</p>
        </Section>

        <Section number="07" title="Third-party services and links">
          <p>The Website may rely on or link to third-party websites, datasets, hosting, AI services, map viewers, libraries, and other resources. These services are operated independently and may change or become unavailable. We do not control and are not responsible for their content, security, availability, terms, or privacy practices.</p>
          <p>Your use of a third-party service is governed by that provider’s terms and policies. A link or integration does not imply endorsement, partnership, or official affiliation unless expressly stated.</p>
        </Section>

        <Section number="08" title="Availability and changes">
          <p>We aim to keep the Website accessible, but we do not guarantee uninterrupted, secure, or error-free operation. Features may be modified, suspended, restricted, or discontinued at any time, including for maintenance, security, technical, or operational reasons.</p>
          <p>We may revise these Terms of Use as the Website develops or as legal requirements change. The “Last updated” date above identifies the current version. Continued use of the Website after updated terms are posted means you accept the revised terms to the extent permitted by applicable law.</p>
        </Section>

        <Section number="09" title="Disclaimers">
          <p>To the maximum extent permitted by applicable law, the Website and its content are provided “as is” and “as available”, without warranties or conditions of any kind, whether express, implied, or statutory. We do not warrant that content will be accurate, complete, current, suitable for a particular purpose, or free from errors, harmful components, or interruptions.</p>
          <p>Nothing in these terms excludes a warranty, right, or protection that cannot lawfully be excluded under the law applicable to you.</p>
        </Section>

        <Section number="10" title="Limitation of liability">
          <p>To the maximum extent permitted by applicable law, Sferavis and the people operating it will not be liable for indirect, incidental, special, consequential, exemplary, or punitive loss, or for loss of data, profits, goodwill, or opportunity arising from or related to your use of, or inability to use, the Website.</p>
          <p>Nothing in these terms limits or excludes liability where doing so would be unlawful, including liability that cannot be excluded under applicable law. Where liability cannot be excluded but may be limited, it is limited to the extent permitted by law.</p>
        </Section>

        <Section number="11" title="Suspension and termination">
          <p>We may restrict or suspend access to the Website or any feature if we reasonably believe that a user has breached these terms, created a security or operational risk, infringed rights, or used the Website unlawfully. Where reasonably practicable, we will take proportionate action in light of the circumstances.</p>
        </Section>

        <Section number="12" title="Governing law and disputes">
          <p>These terms are intended to be interpreted under the laws of Bangladesh, without preventing any mandatory consumer or other protections that apply in your country of residence. Any dispute will be subject to the jurisdiction of the competent courts of Bangladesh, except where applicable law gives you the right to bring proceedings elsewhere.</p>
        </Section>

        <Section number="13" title="Contact">
          <p>If you have questions about these terms or need to report misuse or an intellectual-property concern, contact the Sferavis team:</p>
          <p className="border-l-2 border-[#A30000] pl-4 text-[#303944] dark:text-zinc-200">
            <strong>Sferavis</strong><br />
            Email: <a className="font-semibold text-[#A30000] underline underline-offset-4" href="mailto:contact.sferavis@gmail.com?subject=Terms%20of%20Use%20enquiry">contact.sferavis@gmail.com</a>
          </p>
        </Section>
      </div>
    </div>
  </div>
);
