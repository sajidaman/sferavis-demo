import React, { useState, useMemo } from 'react';
import { PageId, DocSection } from '../types';
import { DOC_SECTIONS } from '../data/mockData';
import {
  Search,
  Book,
  Code2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Terminal,
  Database,
  Layers,
} from 'lucide-react';

interface DocsPageProps {
  onNavigate: (page: PageId) => void;
}

export const DocsPage: React.FC<DocsPageProps> = ({ onNavigate }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(DOC_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Filter docs
  const filteredDocs = useMemo(() => {
    return DOC_SECTIONS.filter((doc) => {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.content.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const activeDoc = useMemo(() => {
    return DOC_SECTIONS.find((d) => d.id === selectedDocId) || DOC_SECTIONS[0];
  }, [selectedDocId]);

  const categories = ['Overview', 'Public Detection', 'AI-ML Pipeline'];

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  return (
    <div className="w-full text-slate-900 dark:text-slate-100 min-h-screen selection:bg-[#A30000] selection:text-white">
      
      {/* HEADER */}
      <section className="pt-12 pb-12 border-b border-zinc-200 dark:border-slate-800 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            <header className="mx-auto w-full max-w-3xl text-center">
              <h1
                aria-label="Documentation"
                className="text-4xl font-semibold tracking-[-0.055em] text-[#171b22] sm:text-6xl lg:text-7xl dark:text-white"
              >
                Documentation<span className="text-[#a30000]">.</span>
              </h1>
            </header>

            {/* Search Input */}
            <div className="w-full md:w-80 relative self-center">
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black/60 border border-zinc-300 dark:border-zinc-800 text-xs font-lexend text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#A30000] transition-colors shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN DOCUMENTATION WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR NAVIGATION (3.5 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            
            {categories.map((cat) => {
              const catDocs = filteredDocs.filter((d) => d.category === cat);
              if (catDocs.length === 0) return null;

              return (
                <div key={cat} className="space-y-1">
                  <h3 className="text-xs font-lexend font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest px-3 mb-2">
                    {cat}
                  </h3>

                  {catDocs.map((doc) => {
                    const isSelected = doc.id === activeDoc.id;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDocId(doc.id)}
                        className={`w-full text-left px-3.5 py-2.5 text-xs font-lexend transition-all cursor-pointer border-l-2 ${
                          isSelected
                            ? 'border-[#A30000] bg-white dark:bg-[#152038] text-slate-950 dark:text-white font-bold shadow-sm'
                            : 'border-transparent text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                      >
                        {doc.title}
                      </button>
                    );
                  })}
                </div>
              );
            })}

          </div>


          {/* MAIN ARTICLE BODY (8.5 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 border-l-4 border-l-[#A30000] p-6 sm:p-10 shadow-sm">
              
              <div className="flex items-center gap-2 text-xs font-lexend uppercase tracking-wider text-[#A30000] font-bold mb-2">
                <span>{activeDoc.category}</span>
                <span>/</span>
                <span>v2.4 Specification</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-oswald uppercase font-black text-slate-950 dark:text-white tracking-tight">
                {activeDoc.title}
              </h2>

              <div className="mt-6 text-sm sm:text-base text-slate-600 dark:text-zinc-300 font-merriweather leading-relaxed space-y-4">
                <p>{activeDoc.content}</p>
              </div>

              {/* Code Snippet Box */}
              {activeDoc.codeBlock && (
                <div className="mt-8">
                  <div className="flex items-center justify-between text-xs bg-slate-900 px-4 py-2.5 border border-slate-800 font-lexend uppercase tracking-wider text-slate-300">
                    <span className="font-bold text-white">Reference ({activeDoc.codeBlock.language})</span>
                    <button
                      onClick={() => handleCopyCode(activeDoc.codeBlock!.code, activeDoc.id)}
                      className="flex items-center gap-1.5 hover:text-white cursor-pointer text-[#A30000]"
                    >
                      {copiedCodeId === activeDoc.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 border-x border-b border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{activeDoc.codeBlock.code}</code>
                  </pre>
                </div>
              )}

              {/* Endpoint Parameters Table if available */}
              {activeDoc.endpoint && (
                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-[#A30000] text-white font-mono text-xs font-bold">
                      {activeDoc.endpoint.method}
                    </span>
                    <code className="font-mono text-xs text-slate-800 dark:text-zinc-200 font-bold">{activeDoc.endpoint.path}</code>
                  </div>

                  <div className="overflow-x-auto border border-zinc-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs font-lexend">
                      <thead className="bg-slate-100 dark:bg-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-slate-800">
                        <tr>
                          <th className="p-3">Parameter</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Required</th>
                          <th className="p-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-slate-800 text-slate-700 dark:text-zinc-300">
                        {activeDoc.endpoint.params.map((param) => (
                          <tr key={param.name}>
                            <td className="p-3 font-mono text-slate-950 dark:text-white font-bold">{param.name}</td>
                            <td className="p-3 font-mono text-slate-500 dark:text-zinc-400">{param.type}</td>
                            <td className="p-3">
                              {param.required ? (
                                <span className="text-[#A30000] font-bold">Yes</span>
                              ) : (
                                <span className="text-slate-400 dark:text-zinc-500">Optional</span>
                              )}
                            </td>
                            <td className="p-3">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>




          </div>

        </div>
      </div>

    </div>
  );
};
