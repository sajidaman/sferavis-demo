import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, Tutorial } from '../types';
import { TUTORIALS } from '../data/mockData';
import {
  BookOpen,
  Play,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Terminal,
  Code2,
  Clock,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface TutorialsPageProps {
  onNavigate: (page: PageId) => void;
}

export const TutorialsPage: React.FC<TutorialsPageProps> = ({ onNavigate }) => {
  const [selectedTutorialId, setSelectedTutorialId] = useState<string>(TUTORIALS[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [codeContent, setCodeContent] = useState<string>(TUTORIALS[0].interactiveCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const currentTutorial = TUTORIALS.find((t) => t.id === selectedTutorialId) || TUTORIALS[0];

  const handleSelectTutorial = (t: Tutorial) => {
    setSelectedTutorialId(t.id);
    setActiveStepIndex(0);
    setCodeContent(t.interactiveCode);
    setExecutionOutput(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setExecutionOutput(null);

    setTimeout(() => {
      setIsRunning(false);
      if (selectedTutorialId === 'quickstart-fits-cubes') {
        setExecutionOutput(`[SFERAvis Engine v2.4.0] Initializing Astropy WCS provider...
Mounting SPHEREx L2 cube: 102 channels (0.75 - 5.00 µm)
Extracting spatial aperture around OMC-1 (RA: 05h35m14.5s, Dec: -05d22m30s)
Extracted 102 spectral points.
Peak flux: 42.50 mJy at 3.80 µm
Detected H2O Ice absorption at 3.05 µm: tau = 0.824
Execution finished in 184ms.`);
      } else if (selectedTutorialId === 'detecting-water-ice') {
        setExecutionOutput(`[Astrochemistry Decomposition Pipeline]
Target: Elias-29 Protostellar Envelope
Polynomial continuum subtraction converged (chi^2 = 1.04)
Analyzing interstellar ice columns:
H2O_amorphous: 4.87e+18 cm^-2 (tau_peak = 0.94)
CO2_pure     : 1.12e+17 cm^-2 (tau_peak = 0.48)
CO_solid     : 8.40e+16 cm^-2 (tau_peak = 0.32)
CH3OH_ice    : 3.10e+16 cm^-2 (tau_peak = 0.14)
Execution completed successfully.`);
      } else {
        setExecutionOutput(`[Cosmology GPU Photometric Sieve]
Loading template library: 250,000 galaxy SED models
Fitting 102 bands for target: SDSS J1148+1930 (Cosmic Horseshoe)
Best-fit Redshift z = 2.3814
68% Confidence Interval: [2.3789, 2.3839]
Stellar Mass log(M*/M_sun): 11.24
Delta-chi2: 142.8 (High confidence z-break match)`);
      }
    }, 650);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeContent);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleResetCode = () => {
    setCodeContent(currentTutorial.interactiveCode);
    setExecutionOutput(null);
  };

  return (
    <div className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] dark:bg-transparent dark:text-white selection:bg-[#A30000] selection:text-white">
      
      {/* HEADER */}
      <div className="relative mx-auto max-w-[1200px] px-5 pb-0 pt-20 sm:px-8 sm:pt-28 lg:px-14">
        <header className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#171b22] sm:text-6xl lg:text-7xl dark:text-white">
            Tutorials<span className="text-[#a30000]">.</span>
          </h1>
        </header>
      </div>

      {/* WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: TUTORIAL CURRICULUM SELECTION (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-lexend font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest mb-2">
              Curriculum Modules
            </h3>

            <div className="space-y-3">
              {TUTORIALS.map((tutorial) => {
                const isSelected = tutorial.id === currentTutorial.id;
                return (
                  <button
                    key={tutorial.id}
                    onClick={() => handleSelectTutorial(tutorial)}
                    className={`w-full text-left p-5 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-white dark:bg-[#152038] border-[#A30000] border-l-4 shadow-md'
                        : 'bg-white dark:bg-[#0e1628] border-zinc-200 dark:border-slate-800 hover:border-zinc-400 dark:hover:border-slate-700 text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[#A30000] font-lexend uppercase font-bold tracking-wider">{tutorial.category}</span>
                      <div className="flex items-center gap-1 text-slate-500 dark:text-zinc-400">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono text-xs">{tutorial.durationMin}m</span>
                      </div>
                    </div>

                    <h4 className="text-base font-bold font-oswald uppercase text-slate-950 dark:text-white mb-2 leading-snug">
                      {tutorial.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-zinc-400 font-merriweather line-clamp-2 leading-relaxed">
                      {tutorial.summary}
                    </p>

                    <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-500 font-lexend uppercase">
                      <span>Level: {tutorial.level}</span>
                      <span>{tutorial.steps.length} Steps</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Documentation Cross-link */}
            <div className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 border-l-4 border-l-[#A30000] p-5 mt-6 shadow-sm">
              <span className="text-xs font-lexend uppercase tracking-wider font-bold text-slate-950 dark:text-white block mb-1">Need the full Python SDK reference?</span>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-merriweather mb-4">
                Explore function signatures, REST parameters, and IAU FITS cube header standards.
              </p>
              <button
                onClick={() => onNavigate('documentations')}
                className="text-xs font-lexend uppercase tracking-wider font-bold text-[#A30000] hover:text-[#8B0000] flex items-center gap-1 cursor-pointer"
              >
                <span>Browse Documentation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>


          {/* RIGHT: TUTORIAL STEP-BY-STEP & INTERACTIVE CODE RUNNER (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tutorial Header Card */}
            <div className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 border-l-4 border-l-[#A30000] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 font-lexend uppercase tracking-wider mb-2">
                <span className="text-[#A30000] font-bold">{currentTutorial.category}</span>
                <span>·</span>
                <span className="text-slate-900 dark:text-white font-semibold">{currentTutorial.level}</span>
                <span>·</span>
                <span>{currentTutorial.durationMin} mins</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-oswald uppercase font-bold text-slate-950 dark:text-white">
                {currentTutorial.title}
              </h2>

              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-zinc-300 font-merriweather leading-relaxed">
                {currentTutorial.summary}
              </p>

              {/* Prerequisites */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-lexend uppercase tracking-wider">Prerequisites:</span>
                {currentTutorial.prerequisites.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 text-xs font-mono bg-slate-100 dark:bg-black/60 border border-zinc-200 dark:border-slate-800 text-slate-800 dark:text-zinc-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Steps Accordion */}
            <div className="space-y-3">
              <h3 className="text-xs font-lexend font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
                Tutorial Progression
              </h3>
              {currentTutorial.steps.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                return (
                  <div
                    key={step.stepNumber}
                    className={`border transition-all ${
                      isActive 
                        ? 'bg-white dark:bg-[#152038] border-zinc-300 dark:border-slate-700 shadow-sm' 
                        : 'bg-white dark:bg-[#0e1628] border-zinc-200 dark:border-slate-800 shadow-sm'
                    }`}
                  >
                    <button
                      onClick={() => setActiveStepIndex(idx)}
                      className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 flex items-center justify-center text-xs font-oswald font-bold ${
                            isActive
                              ? 'bg-[#A30000] text-white'
                              : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-400'
                          }`}
                        >
                          {step.stepNumber}
                        </span>
                        <span className="text-sm font-oswald uppercase font-bold text-slate-950 dark:text-white tracking-wide">
                          {step.title}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 dark:text-zinc-400 transition-transform ${
                          isActive ? 'rotate-90 text-[#A30000]' : ''
                        }`}
                      />
                    </button>

                    {isActive && (
                      <div className="px-5 pb-5 pt-1 border-t border-zinc-200 dark:border-slate-800/80 space-y-3">
                        <p className="text-sm text-slate-600 dark:text-zinc-300 font-merriweather leading-relaxed">
                          {step.explanation}
                        </p>
                        {step.codeSnippet && (
                          <div className="bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-slate-200 overflow-x-auto">
                            <code>{step.codeSnippet}</code>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Interactive Code Playground */}
            <div className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 overflow-hidden shadow-2xl">
              <div className="px-5 py-3 bg-slate-100 dark:bg-[#090f1d] border-b border-zinc-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#A30000]"></span>
                  <span className="text-xs font-lexend uppercase tracking-wider text-slate-900 dark:text-white font-bold">
                    Interactive Python Terminal
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {copiedNotification && (
                    <span className="text-xs font-mono text-zinc-200 bg-zinc-800 px-2 py-0.5 border border-zinc-700">
                      Copied!
                    </span>
                  )}
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 text-slate-500 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Copy Code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetCode}
                    className="p-1.5 text-slate-500 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Reset to Default"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="px-4 py-1.5 bg-[#A30000] hover:bg-[#8B0000] text-white text-xs font-lexend uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isRunning ? 'Running...' : 'Execute'}</span>
                  </button>
                </div>
              </div>

              {/* Code Editor Area */}
              <div className="p-4 bg-slate-950 font-mono text-xs text-slate-100">
                <textarea
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  rows={9}
                  className="w-full bg-transparent border-none outline-none resize-none font-mono text-xs leading-relaxed text-slate-100 selection:bg-[#A30000]"
                  spellCheck={false}
                />
              </div>

              {/* Terminal Output */}
              {executionOutput && (
                <div className="border-t border-slate-800 bg-[#060a14] p-4 font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-2 font-lexend uppercase tracking-wider text-[11px]">
                    <Terminal className="w-3.5 h-3.5 text-[#A30000]" />
                    <span>Standard Output</span>
                  </div>
                  <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {executionOutput}
                  </pre>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
