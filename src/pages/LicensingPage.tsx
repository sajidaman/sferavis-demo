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

const ExternalLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-[#A30000] underline decoration-[#A30000]/30 underline-offset-4 transition hover:decoration-[#A30000]">
    {children}
  </a>
);

const LicenceCard: React.FC<{ title: string; licence: string; href: string; scope: string; children: React.ReactNode }> = ({ title, licence, href, scope, children }) => (
  <article className="rounded-xl border border-black/[0.09] bg-white/70 p-5 dark:border-white/[0.10] dark:bg-white/[0.03]">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-[#171b22] dark:text-white">{title}</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#8a929d]">{scope}</p>
      </div>
      <span className="rounded-full border border-[#A30000]/20 bg-[#A30000]/[0.06] px-3 py-1 text-xs font-semibold text-[#A30000]">{licence}</span>
    </div>
    <div className="mt-4 space-y-3 text-sm leading-7 text-[#687384] dark:text-zinc-400">{children}</div>
    <p className="mt-4"><ExternalLink href={href}>Read the complete official licence</ExternalLink></p>
  </article>
);

export const LicensingPage: React.FC = () => (
  <div className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] dark:text-white">
    <div className="pointer-events-none absolute left-1/2 top-24 h-80 w-[min(90vw,52rem)] -translate-x-1/2 rounded-full bg-[#a30000]/[0.06] blur-[120px]" aria-hidden="true" />
    <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-14">
      <header className="mb-14 max-w-3xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a30000]">Legal · Open science · Software</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-[#171b22] sm:text-6xl dark:text-white">
          Open Source <span className="text-[#a30000]">&amp; Licences.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#737d89] sm:text-base dark:text-zinc-400">
          This page explains the licences that apply to Sferavis software, research outputs, educational materials, third-party components, and identity.
        </p>
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#858e99] dark:text-zinc-500">
          <span>Effective date: 14 November 2026</span>
          <span>Last updated: 14 November 2026</span>
        </div>
      </header>

      <div className="border-y border-black/[0.08] py-6 dark:border-white/[0.09]">
        <p className="text-sm leading-7 text-[#687384] dark:text-zinc-400">
          Sferavis uses different licences for different kinds of work. A licence applies only to material for which Sferavis holds the relevant rights or has permission to grant those rights. Third-party material remains subject to its own licence and terms. The summaries below are for convenience; the linked official licence text controls.
        </p>
      </div>

      <div className="mt-2">
        <Section number="01" title="Sferavis software and website code">
          <LicenceCard title="Sferavis original software" licence="Apache License 2.0" href="https://www.apache.org/licenses/LICENSE-2.0" scope="Repository source code">
            <p>The original Sferavis software in this repository is made available under Apache License 2.0. Subject to its conditions, users may use, reproduce, modify, distribute, sublicense, and commercially exploit the licensed code.</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-[#A30000]">
              <li><strong className="text-[#303944] dark:text-zinc-200">Copyright and licence notice:</strong> include a copy of the licence with redistributed copies.</li>
              <li><strong className="text-[#303944] dark:text-zinc-200">Modified files:</strong> mark files that have been changed.</li>
              <li><strong className="text-[#303944] dark:text-zinc-200">Notices:</strong> retain applicable copyright, patent, trademark, and attribution notices; reproduce relevant NOTICE attributions where a NOTICE file is included.</li>
              <li><strong className="text-[#303944] dark:text-zinc-200">Patent grant:</strong> the licence includes a defined patent licence from contributors, subject to its terms.</li>
              <li><strong className="text-[#303944] dark:text-zinc-200">Branding:</strong> the licence does not grant general permission to use Sferavis trademarks, names, or logos.</li>
            </ul>
            <p>The complete terms, including warranty disclaimer and limitation of liability, are in the repository's <a className="font-semibold text-[#A30000] underline underline-offset-4" href="https://github.com/sajidaman/sferavis-demo/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">LICENSE file</a>.</p>
          </LicenceCard>
        </Section>

        <Section number="02" title="Third-party software">
          <p>The Sferavis Atlas includes the InfraSphere application, an independent WebGL sky viewer distributed under the MIT License. Its source and complete licence are included in <code>public/atlas/</code>; see the <ExternalLink href="https://github.com/Radit-Raian/InfraSphere">upstream repository</ExternalLink> and <ExternalLink href="https://github.com/Radit-Raian/InfraSphere/blob/main/LICENSE">MIT License</ExternalLink>. SPHEREx data, SIMBAD catalogue results, VizieR photometry, and other astronomical products remain subject to their providers' terms and attribution requirements.</p>
          <p className="mt-4">Third-party packages and assets remain subject to their respective licences. See <a className="font-semibold text-[#A30000] underline underline-offset-4" href="https://github.com/sajidaman/sferavis-demo/blob/main/THIRD_PARTY_NOTICES.md" target="_blank" rel="noopener noreferrer">THIRD_PARTY_NOTICES.md</a> for component-specific notices.</p>
        </Section>

        <Section number="03" title="Research publications">
          <LicenceCard title="Sferavis research publications" licence="CC BY 4.0" href="https://creativecommons.org/licenses/by/4.0/" scope="Papers and research articles">
            <p>Unless a publication states otherwise, Sferavis research publications are intended to be released under Creative Commons Attribution 4.0 International.</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-[#A30000]">
              <li>You may share and adapt the licensed work, including for commercial purposes.</li>
              <li>You must give appropriate credit, provide the licence link, and indicate whether changes were made.</li>
              <li>You may not impose additional legal or technological restrictions that prevent others from exercising the licensed rights.</li>
              <li>Third-party figures, datasets, quotations, and other excluded material may have separate terms.</li>
            </ul>
            <p>Publication-specific publisher agreements or notices take precedence where applicable. Check each paper for its actual licence before reuse.</p>
          </LicenceCard>
        </Section>

        <Section number="04" title="Educational resources">
          <LicenceCard title="Sferavis educational materials" licence="CC BY-NC-SA 4.0" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" scope="Learning resources and handouts">
            <p>Educational resources identified as Sferavis materials are made available under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International.</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-[#A30000]">
              <li>You may copy and adapt the material for non-commercial purposes.</li>
              <li>You must credit Sferavis, link to the licence, and indicate changes.</li>
              <li>If you distribute an adaptation, you must license it under the same licence or a compatible one.</li>
              <li>You may not apply additional restrictions that prevent others from exercising the licensed rights.</li>
            </ul>
          </LicenceCard>
        </Section>

        <Section number="05" title="Sferavis Machine-Learning Catalogue">
          <LicenceCard title="Sferavis ML Catalogue" licence="CC BY 4.0" href="https://creativecommons.org/licenses/by/4.0/" scope="Sferavis-created catalogue contributions">
            <p>Sferavis makes the original catalogue material and protectable database contributions it has the right to license available under CC BY 4.0. This may include Sferavis-authored documentation, original selection or arrangement, and rights in the database structure where those rights exist.</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-[#A30000]">
              <li>Redistribution, adaptation, and commercial reuse are permitted under CC BY 4.0, subject to attribution and the other licence terms.</li>
              <li>Credit Sferavis and identify the specific Infraredium catalogue release.</li>
              <li>Provide the licence link and indicate whether the catalogue material was modified.</li>
              <li>Do not imply that Sferavis endorses a modified catalogue or downstream result.</li>
            </ul>
            <div className="rounded-lg border border-[#A30000]/15 bg-[#A30000]/[0.04] p-4">
              <p className="font-semibold text-[#303944] dark:text-zinc-200">Recommended acknowledgement</p>
              <p className="mt-2">“This research used the Sferavis Machine-Learning Catalogue, developed by Sferavis, Release [version] ([year]), based on NASA SPHEREx mission data. [DOI or catalogue URL]. Licensed under CC BY 4.0.”</p>
            </div>
            <p>When a release DOI is available, cite that version-specific DOI. CC BY attribution applies to reuse of licensed catalogue material; it does not create ownership over NASA source data, raw observations, or scientific facts that are not protected by copyright or database rights.</p>
          </LicenceCard>
        </Section>

        <Section number="06" title="NASA SPHEREx source data and derived analysis">
          <p>Infraredium uses observations and data products from NASA's SPHEREx mission. The original NASA/SPHEREx source data remain subject to NASA's applicable data-use guidance, source notices, and any third-party rights. Sferavis does not claim ownership of the original observations by processing or analysing them.</p>
          <p>Sferavis separately identifies its own machine-learning processing, derived classifications, measurements, confidence estimates, catalogue documentation, and other original contributions. The CC BY 4.0 notice applies only to rights Sferavis actually holds in those contributions; it does not replace the terms applicable to the underlying source data.</p>
          <p>Users should preserve source provenance and cite the relevant SPHEREx data release or product as well as the Infraredium catalogue release when both are used. Consult the <ExternalLink href="https://irsa.ipac.caltech.edu/Missions/spherex.html">NASA/IPAC SPHEREx archive</ExternalLink> for source-data information.</p>
        </Section>

        <Section number="07" title="Sferavis name, logo, and identity">
          <p>The Sferavis name, logo, visual identity, and branding are reserved to Sferavis unless expressly stated otherwise. Open-source software and Creative Commons licences do not grant permission to use these marks in a way that suggests sponsorship, affiliation, endorsement, or official status.</p>
          <p>You may make factual, nominative references to Sferavis when identifying the source of the software or research material, but use of the branding itself for products, services, or promotion requires prior written permission. Trademark rights, if any, are separate from copyright licences.</p>
        </Section>

        <Section number="08" title="Attribution and citation">
          <p>Where a licence requires attribution, provide the creator or rights-holder name, the title or source where reasonably practicable, a link to the applicable licence, and an indication of changes. Follow any reasonable attribution information supplied with the material.</p>
          <p>For academic use, Sferavis recommends citing the specific publication or catalogue release, including its DOI where available. A recommended scholarly citation is separate from the legal attribution conditions of a licence.</p>
        </Section>

        <Section number="09" title="Questions and permissions">
          <p>For questions about licensing, commercial permissions beyond the stated licences, third-party notices, or use of Sferavis branding, contact <a className="font-semibold text-[#A30000] underline underline-offset-4" href="mailto:contact.sferavis@gmail.com?subject=Licensing%20enquiry">contact.sferavis@gmail.com</a>.</p>
          <p>This page is an informational summary, not legal advice. The full text of each linked licence governs. If a publication, dataset, package, or asset carries its own notice, review that notice before reuse.</p>
        </Section>
      </div>
    </div>
  </div>
);
