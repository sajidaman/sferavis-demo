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

export const PrivacyPage: React.FC = () => (
  <div className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] dark:text-white">
    <div className="pointer-events-none absolute left-1/2 top-24 h-80 w-[min(90vw,52rem)] -translate-x-1/2 rounded-full bg-[#a30000]/[0.06] blur-[120px]" aria-hidden="true" />
    <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-14">
      <header className="mb-14 max-w-3xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a30000]">Privacy &amp; data</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-[#171b22] sm:text-6xl dark:text-white">
          Privacy <span className="text-[#a30000]">Policy.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#737d89] sm:text-base dark:text-zinc-400">
          This policy explains what information may be processed when you visit Sferavis, use Redium, or contact our team, and the choices available to you.
        </p>
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#858e99] dark:text-zinc-500">
          <span>Effective date: 14 November 2026</span>
          <span>Last updated: 14 November 2026</span>
        </div>
      </header>

      <div className="border-y border-black/[0.08] py-6 dark:border-white/[0.09]">
        <p className="text-sm leading-7 text-[#687384] dark:text-zinc-400">
          Sferavis is an independent, multidisciplinary science initiative. It is not an official NASA website and does not operate the NASA SPHEREx mission. This policy describes the Sferavis website as currently implemented; features and data practices may change as the website develops.
        </p>
      </div>

      <div className="mt-2">
        <Section number="01" title="Who is responsible for your information?">
          <p>
            References to “Sferavis”, “we”, “us” or “our” mean the team operating the Sferavis website. For privacy questions or requests, contact us at <a className="font-semibold text-[#A30000] underline underline-offset-4" href="mailto:contact.sferavis@gmail.com?subject=Privacy%20request">contact.sferavis@gmail.com</a>.
          </p>
          <p>
            This website currently does not provide visitor accounts, a newsletter registration form, an on-site contact-submission form, or payment checkout. The Contact Us page opens your email application; information is sent to us only when you choose to send an email.
          </p>
        </Section>

        <Section number="02" title="Information we process">
          <p><strong className="text-[#303944] dark:text-zinc-200">Information you send by email.</strong> When you contact us, we receive the information in your message, such as your name, email address, message text, and any attachments or other details you choose to include.</p>
          <p><strong className="text-[#303944] dark:text-zinc-200">Messages sent to Redium.</strong> When you use the Redium chat, the messages in the current conversation are sent to our server-side chat endpoint so it can generate a reply. The website sends up to the latest 12 conversation messages, and each message is limited to 2,000 characters by the endpoint. You do not need to provide your name or email address to use the chat.</p>
          <p><strong className="text-[#303944] dark:text-zinc-200">Technical and connection information.</strong> Our hosting and infrastructure providers may process ordinary request information needed to deliver and secure the website, such as IP address, requested URL or resource, browser and device information, timestamps, and error or diagnostic data. These details may appear in provider operational or security logs.</p>
          <p><strong className="text-[#303944] dark:text-zinc-200">Local preferences.</strong> The website stores your light or dark theme choice and accessibility preferences in your browser’s local storage. These settings stay in that browser unless you clear them; they are not an account profile and are not sent to Sferavis as part of normal page viewing.</p>
          <p>Please do not submit passwords, financial details, government identifiers, health information, confidential research, or other sensitive information through Redium. Treat chatbot prompts as information shared with an external AI service.</p>
        </Section>

        <Section number="03" title="How we use information">
          <p>We use information for limited purposes connected with operating Sferavis: to display the website and its science resources; to respond to messages and enquiries; to provide Redium’s AI-generated replies; to remember local display and accessibility preferences; and to maintain website reliability, diagnose errors, protect the service, and address misuse or security incidents.</p>
          <p>We do not currently use the website to sell personal information or to serve targeted advertising. The application code does not currently integrate a separate advertising tracker or third-party web analytics product.</p>
        </Section>

        <Section number="04" title="Redium and Google Gemini">
          <p>Redium is an AI assistant. When you send a message, the current conversation context is transmitted to the Sferavis chat endpoint and forwarded to Google’s Gemini API to generate a response. The website code does not create a Sferavis account for you or save a chat transcript to a Sferavis conversation database. The conversation is held in the open page’s application memory and is cleared when that page session is reset; Google and infrastructure providers may process or retain request data under their own terms and policies.</p>
          <p>Google’s handling of prompts and responses depends on whether the Gemini API is being used as an unpaid or paid service. Google states that content submitted through unpaid services may be used to provide, improve, and develop Google products and machine-learning technologies, and may be reviewed by human reviewers. For paid services, Google states that prompts and responses are not used to improve its products, although limited logging may occur for abuse prevention, safety, security, and legal compliance. The billing classification of the API project used by a particular deployment can change independently of this website.</p>
          <p>For that reason, do not enter sensitive, confidential, or identifying personal information into Redium. Google’s terms are available in its <ExternalLink href="https://ai.google.dev/gemini-api/terms">Gemini API Additional Terms of Service</ExternalLink> and <ExternalLink href="https://policies.google.com/privacy">Privacy Policy</ExternalLink>.</p>
        </Section>

        <Section number="05" title="Cookies and browser storage">
          <p>The current Sferavis application uses browser local storage for theme and accessibility settings. This is different from a cookie: the settings are stored locally in your browser and are used to keep your chosen presentation preferences between visits.</p>
          <p>The Sferavis application code does not currently set advertising or analytics cookies. However, third-party services that provide hosting, fonts, AI processing, or astronomical map imagery may process technical information when your browser connects to them. Their own privacy and cookie notices govern their services. You can clear local storage and manage cookies through your browser settings; clearing local storage will reset saved Sferavis preferences.</p>
        </Section>

        <Section number="06" title="Service providers and external services">
          <p>Some parts of the website rely on third-party providers. Depending on the feature you use, your browser or the Sferavis server may communicate with:</p>
          <ul className="list-disc space-y-2 pl-5 marker:text-[#A30000]">
            <li><strong className="text-[#303944] dark:text-zinc-200">Vercel</strong> — website hosting and serverless request handling. See the <ExternalLink href="https://vercel.com/legal/privacy-notice">Vercel Privacy Notice</ExternalLink>.</li>
            <li><strong className="text-[#303944] dark:text-zinc-200">Google Gemini API</strong> — AI processing for Redium. See Google’s <ExternalLink href="https://ai.google.dev/gemini-api/terms">Gemini API terms</ExternalLink>.</li>
            <li><strong className="text-[#303944] dark:text-zinc-200">Google (Gmail)</strong> — processing and storage of messages delivered to our Sferavis contact mailbox. See Google’s <ExternalLink href="https://policies.google.com/privacy">Privacy Policy</ExternalLink>.</li>
            <li><strong className="text-[#303944] dark:text-zinc-200">Google Fonts</strong> — delivery of the typefaces used on the website. See the <ExternalLink href="https://fonts.google.com/faq">Google Fonts FAQ</ExternalLink>.</li>
          </ul>
          <p>When you follow an external link, such as a social-media, research, or partner link, you leave the Sferavis website. The destination service handles your information under its own policies. We do not control the privacy practices of external providers.</p>
        </Section>

        <Section number="07" title="International processing">
          <p>Some providers used by the website operate infrastructure in more than one country. As a result, technical request information, email content, or Redium prompts may be processed outside the country where you are located, subject to the relevant provider’s infrastructure, contractual terms, and applicable law. We do not control the location or retention settings of those providers’ systems.</p>
        </Section>

        <Section number="08" title="Retention">
          <p>We keep email correspondence only for as long as reasonably needed to respond to the enquiry, maintain appropriate organisational records, resolve disputes, and meet legal obligations.</p>
          <p>The Sferavis website does not currently maintain a stored Redium chat-history database. Chat content may nevertheless be processed or retained by Google and hosting providers under their own terms, including the different handling that may apply to unpaid and paid Gemini API services. Local preferences remain in your browser until you clear them or remove the site’s stored data.</p>
        </Section>

        <Section number="09" title="Security">
          <p>We use reasonable measures intended to protect the information handled through the website. No website, network transmission, or storage system can be guaranteed to be completely secure. Please avoid sending sensitive information through public website features or ordinary email.</p>
        </Section>

        <Section number="10" title="Your choices and privacy rights">
          <p>Depending on the laws that apply to you, you may have the right to ask for access to personal information, request correction or deletion, receive a portable copy where available, object to or restrict certain processing, or withdraw consent where processing is based on consent. You may also clear the preferences stored in your browser at any time.</p>
          <p>For visitors in Bangladesh, applicable rights may also arise under the <ExternalLink href="https://bdlaws.minlaw.gov.bd/act-1692.html">Personal Data Protection Act, 2026</ExternalLink>. The rights available to you depend on the law that applies to your circumstances.</p>
          <p>To make a privacy request, email <a className="font-semibold text-[#A30000] underline underline-offset-4" href="mailto:contact.sferavis@gmail.com?subject=Privacy%20request">contact.sferavis@gmail.com</a> with the subject “Privacy request”. Please describe the request and the relevant interaction. We may ask for proportionate information to verify that a request relates to you. We will handle requests in accordance with applicable law and explain where a request cannot be fulfilled.</p>
        </Section>

        <Section number="11" title="Children and young people">
          <p>The website is intended for a general science-interested audience and is not designed to collect personal information from children. Please do not send personal information about a person under 18 through Redium or email unless a parent or legal guardian has reviewed and authorised the disclosure where required by law. If you believe a child has provided personal information to Sferavis, contact us so we can assess the request.</p>
        </Section>

        <Section number="12" title="Changes to this policy">
          <p>We may update this policy when the website, its services, or applicable requirements change. The “Last updated” date at the top of this page indicates when the current version was published. Material changes will be reflected on this page.</p>
        </Section>

        <Section number="13" title="Contact Sferavis">
          <p>For questions, concerns, or requests relating to this policy or your personal information, contact:</p>
          <p className="border-l-2 border-[#A30000] pl-4 text-[#303944] dark:text-zinc-200">
            <strong>Sferavis — Privacy enquiries</strong><br />
            Email: <a className="font-semibold text-[#A30000] underline underline-offset-4" href="mailto:contact.sferavis@gmail.com?subject=Privacy%20enquiry">contact.sferavis@gmail.com</a>
          </p>
        </Section>
      </div>
    </div>
  </div>
);
