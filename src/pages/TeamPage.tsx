import React, { useState } from 'react';
import { PageId, TeamMember } from '../types';
import { TEAM_MEMBERS, PUBLICATIONS } from '../data/mockData';
import {
  Users,
  GraduationCap,
  BookOpen,
  Send,
  CheckCircle,
  ExternalLink,
  Building,
  Mail,
  Shield,
  FileText,
} from 'lucide-react';

interface TeamPageProps {
  onNavigate: (page: PageId) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onNavigate }) => {
  const [selectedPillar, setSelectedPillar] = useState<string>('All');
  const [expandedPubId, setExpandedPubId] = useState<string | null>(null);

  // Inquiry form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    researchArea: 'Interstellar Ices',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const pillars = ['All', 'Cosmic Inflation', 'Galaxy Formation', 'Interstellar Ices', 'Instrumentation & Data'];

  const filteredPublications = PUBLICATIONS.filter(
    (p) => selectedPillar === 'All' || p.pillar === selectedPillar
  );

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError('Please complete all required fields.');
      return;
    }
    setFormError(null);
    setFormSubmitted(true);
  };

  return (
    <div className="w-full text-slate-900 dark:text-slate-100 min-h-screen selection:bg-[#A30000] selection:text-white">
      
      {/* HEADER SECTION */}
      <section className="pt-12 pb-16 border-b border-zinc-200 dark:border-slate-800 bg-white/70 dark:bg-[#090f1d]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="inline-flex items-center gap-3 text-xs font-lexend uppercase tracking-widest text-slate-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-slate-800 pb-2 mb-4">
            <span className="w-2 h-2 bg-[#A30000]"></span>
            <span className="text-[#A30000] font-bold">CONSORTIUM LEADERSHIP</span>
            <span className="text-zinc-400 dark:text-zinc-600">/</span>
            <span className="text-slate-700 dark:text-zinc-300">CALTECH · JPL · KASI · HARVARD CfA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-oswald uppercase font-black tracking-tight text-slate-950 dark:text-white max-w-3xl leading-[1.05]">
            The SPHEREx & SFERAvis Team.
          </h1>

          <p className="mt-4 text-base sm:text-xl font-merriweather text-slate-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
            Astrophysicists, instrument scientists, and high-performance software architects united across international research institutions to map the all-sky infrared universe.
          </p>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-20">
        
        {/* TEAM LEADERSHIP GRID */}
        <section>
          <div className="mb-10">
            <span className="text-xs font-lexend uppercase tracking-widest font-bold text-[#A30000]">
              Scientific Leadership
            </span>
            <h2 className="text-2xl sm:text-4xl font-oswald uppercase font-black text-slate-950 dark:text-white mt-1">
              Principal Investigators & Architects
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 border-l-4 border-l-[#A30000] p-7 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-slate-700 transition-colors shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs font-lexend">
                    <span className="text-[#A30000] uppercase font-bold tracking-wider">{member.role}</span>
                    <span className="text-slate-500 dark:text-zinc-500 font-mono">{member.publicationsCount} Papers</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-oswald uppercase text-slate-950 dark:text-white tracking-wide">{member.name}</h3>
                  <div className="text-xs text-slate-500 dark:text-zinc-400 font-lexend mt-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{member.institution}</span>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 font-merriweather leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-slate-800 font-lexend">
                  <span className="text-[11px] text-slate-500 dark:text-zinc-500 uppercase tracking-widest block mb-1">
                    Research Focus
                  </span>
                  <span className="text-xs text-slate-800 dark:text-zinc-200 font-bold">{member.focusArea}</span>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* CONSORTIUM INSTITUTIONS STRIP */}
        <section className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 p-8 text-center border-l-4 border-l-[#A30000] shadow-md">
          <span className="text-xs font-lexend font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest block mb-6">
            Partner Institutions & Space Agencies
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center">
            <div className="p-5 bg-slate-50 dark:bg-black/60 border border-zinc-200 dark:border-slate-800">
              <div className="text-lg font-bold font-oswald uppercase text-slate-950 dark:text-white">Caltech</div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 font-lexend mt-0.5">Lead Institution & IPAC</div>
            </div>
            <div className="p-5 bg-slate-50 dark:bg-black/60 border border-zinc-200 dark:border-slate-800">
              <div className="text-lg font-bold font-oswald uppercase text-slate-950 dark:text-white">NASA JPL</div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 font-lexend mt-0.5">Project Management & Optics</div>
            </div>
            <div className="p-5 bg-slate-50 dark:bg-black/60 border border-zinc-200 dark:border-slate-800">
              <div className="text-lg font-bold font-oswald uppercase text-slate-950 dark:text-white">KASI</div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 font-lexend mt-0.5">Korea Astronomy & Space Science</div>
            </div>
            <div className="p-5 bg-slate-50 dark:bg-black/60 border border-zinc-200 dark:border-slate-800">
              <div className="text-lg font-bold font-oswald uppercase text-slate-950 dark:text-white">Harvard CfA</div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 font-lexend mt-0.5">Center for Astrophysics</div>
            </div>
          </div>
        </section>


        {/* PEER-REVIEWED PUBLICATIONS */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-lexend uppercase tracking-widest font-bold text-[#A30000]">
                Scientific Output
              </span>
              <h2 className="text-2xl sm:text-4xl font-oswald uppercase font-black text-slate-950 dark:text-white mt-1">
                Mission Publications & Reports
              </h2>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {pillars.map((pil) => (
                <button
                  key={pil}
                  onClick={() => setSelectedPillar(pil)}
                  className={`px-3.5 py-1.5 text-xs font-lexend uppercase tracking-wider transition-colors cursor-pointer border ${
                    selectedPillar === pil
                      ? 'bg-[#A30000] border-[#A30000] text-white font-bold'
                      : 'bg-white dark:bg-[#0e1628] text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white border-zinc-300 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  {pil}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredPublications.map((pub) => {
              const isExpanded = expandedPubId === pub.id;
              return (
                <div
                  key={pub.id}
                  className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 border-l-4 border-l-[#A30000] p-6 hover:border-zinc-400 dark:hover:border-slate-700 transition-all shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2 font-lexend">
                    <span className="text-xs text-[#A30000] font-bold uppercase tracking-wider">{pub.pillar}</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                      {pub.journal} ({pub.year}) · DOI: {pub.doi}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-oswald uppercase text-slate-950 dark:text-white tracking-wide">{pub.title}</h3>
                  <div className="text-xs text-slate-600 dark:text-zinc-400 font-lexend mt-1">{pub.authors}</div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 font-merriweather leading-relaxed bg-slate-50 dark:bg-black/60 p-4 border border-zinc-200 dark:border-slate-800">
                      <p>{pub.abstract}</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-slate-800 text-xs font-lexend">
                    <button
                      onClick={() => setExpandedPubId(isExpanded ? null : pub.id)}
                      className="text-[#A30000] hover:text-[#8B0000] uppercase tracking-wider font-bold cursor-pointer"
                    >
                      {isExpanded ? 'Hide Abstract' : 'Read Abstract →'}
                    </button>
                    <span className="text-slate-400 dark:text-zinc-500 font-mono">ADS Bibcode verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* SCIENTIFIC COLLABORATION INQUIRY FORM */}
        <section className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 p-8 sm:p-12 border-l-4 border-l-[#A30000] shadow-md">
          <div className="max-w-3xl">
            <span className="text-xs font-lexend uppercase tracking-widest font-bold text-[#A30000]">
              Get in Touch
            </span>
            <h2 className="text-2xl sm:text-4xl font-oswald uppercase font-black text-slate-950 dark:text-white mt-1">
              Scientific Collaboration & Data Inquiries
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-zinc-300 font-merriweather leading-relaxed">
              Reach the SFERAvis platform development team and SPHEREx science working groups for data release questions, software contributions, or survey scheduling.
            </p>

            {formSubmitted ? (
              <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-sm font-lexend text-emerald-900 dark:text-white font-medium">
                  Thank you! Your collaboration inquiry has been routed to the SPHEREx working group coordinator.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="mt-8 space-y-4">
                {formError && (
                  <div className="text-xs font-lexend text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-3 border border-red-200 dark:border-red-900">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-lexend uppercase tracking-wider text-slate-600 dark:text-zinc-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-black/60 border border-zinc-300 dark:border-zinc-800 text-xs font-lexend text-slate-900 dark:text-white focus:outline-none focus:border-[#A30000]"
                      placeholder="Dr. Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-lexend uppercase tracking-wider text-slate-600 dark:text-zinc-400 mb-1">
                      Institutional Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-black/60 border border-zinc-300 dark:border-zinc-800 text-xs font-lexend text-slate-900 dark:text-white focus:outline-none focus:border-[#A30000]"
                      placeholder="jane.doe@university.edu"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-lexend uppercase tracking-wider text-slate-600 dark:text-zinc-400 mb-1">
                      Institution / Observatory
                    </label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-black/60 border border-zinc-300 dark:border-zinc-800 text-xs font-lexend text-slate-900 dark:text-white focus:outline-none focus:border-[#A30000]"
                      placeholder="Max Planck Institute for Astronomy"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-lexend uppercase tracking-wider text-slate-600 dark:text-zinc-400 mb-1">
                      Primary Science Area
                    </label>
                    <select
                      value={formData.researchArea}
                      onChange={(e) => setFormData({ ...formData, researchArea: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-black/60 border border-zinc-300 dark:border-zinc-800 text-xs font-lexend text-slate-900 dark:text-white focus:outline-none focus:border-[#A30000]"
                    >
                      <option value="Interstellar Ices">Interstellar Ices & Protoplanetary Disks</option>
                      <option value="Cosmic Inflation">Cosmic Inflation & Large-Scale Structure</option>
                      <option value="Extragalactic Background Light">Extragalactic Background Light (EBL)</option>
                      <option value="Galaxy Evolution">Galaxy Evolution & Photometric Redshifts</option>
                      <option value="Pipeline Engineering">Pipeline Engineering & FITS Cube Tools</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-lexend uppercase tracking-wider text-slate-600 dark:text-zinc-400 mb-1">
                    Message / Collaboration Proposal *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-black/60 border border-zinc-300 dark:border-zinc-800 text-xs font-lexend text-slate-900 dark:text-white focus:outline-none focus:border-[#A30000]"
                    placeholder="Briefly describe your proposed research or inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 bg-[#A30000] hover:bg-[#8B0000] text-xs font-lexend uppercase tracking-wider font-bold text-white flex items-center gap-2 cursor-pointer transition-colors shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </section>

      </div>

    </div>
  );
};
