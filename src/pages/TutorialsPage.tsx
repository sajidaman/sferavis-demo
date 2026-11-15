import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, Tutorial } from '../types';
import { TUTORIALS } from '../data/mockData';
import { CLASSIFICATION_TUTORIALS } from '../data/objectClassificationTutorials';
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  Play,
  Sparkles,
} from 'lucide-react';

interface TutorialsPageProps {
  onNavigate: (page: PageId) => void;
}

const VIDEO_FOLDER_URL = 'https://drive.google.com/drive/folders/1MQnr_byj0Co_zL36yziCOQ-iCiMb29R-?usp=drive_link';

type TutorialSelection =
  | { kind: 'learning'; id: string }
  | { kind: 'classification'; id: string };

export const TutorialsPage: React.FC<TutorialsPageProps> = ({ onNavigate }) => {
  const [selection, setSelection] = useState<TutorialSelection>({ kind: 'learning', id: TUTORIALS[0].id });
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const selectedLearningTutorial = selection.kind === 'learning'
    ? TUTORIALS.find((tutorial) => tutorial.id === selection.id) ?? TUTORIALS[0]
    : null;
  const selectedClassificationTutorial = selection.kind === 'classification'
    ? CLASSIFICATION_TUTORIALS.find((tutorial) => tutorial.id === selection.id) ?? CLASSIFICATION_TUTORIALS[0]
    : null;

  const selectLearningTutorial = (tutorial: Tutorial) => {
    setSelection({ kind: 'learning', id: tutorial.id });
    setActiveStepIndex(0);
  };

  const selectClassificationTutorial = (id: string) => {
    setSelection({ kind: 'classification', id });
    setActiveStepIndex(0);
  };

  const toggleCompleted = (key: string) => {
    setCompletedSteps((current) => ({ ...current, [key]: !current[key] }));
  };

  const totalClassificationSteps = CLASSIFICATION_TUTORIALS.reduce((total, tutorial) => total + tutorial.steps.length, 0);
  const completedClassificationSteps = Object.entries(completedSteps).filter(([key, complete]) => key.startsWith('classification:') && complete).length;

  return (
    <main className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] selection:bg-[#A30000] selection:text-white dark:text-white">
      <header className="mx-auto max-w-[1200px] px-5 pb-10 pt-20 sm:px-8 sm:pt-28 lg:px-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 border border-[#A30000]/20 bg-[#A30000]/5 px-3 py-1.5 font-lexend text-[10px] font-bold uppercase tracking-[0.2em] text-[#A30000] dark:bg-[#A30000]/10">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Learn by exploring
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#171b22] sm:text-6xl lg:text-7xl dark:text-white">
            Tutorials<span className="text-[#a30000]">.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-zinc-300 sm:text-base">
            Follow a guided lesson, explore the evidence one step at a time, and keep track of what you have completed.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
            <section aria-labelledby="learning-paths-heading">
              <div className="mb-3 flex items-center justify-between">
                <h2 id="learning-paths-heading" className="font-lexend text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">
                  Learning paths
                </h2>
                <span className="font-mono text-[10px] text-slate-400">{TUTORIALS.length} lessons</span>
              </div>
              <div className="space-y-2">
                {TUTORIALS.map((tutorial) => {
                  const selected = selection.kind === 'learning' && selection.id === tutorial.id;
                  return (
                    <button
                      key={tutorial.id}
                      type="button"
                      onClick={() => selectLearningTutorial(tutorial)}
                      aria-current={selected ? 'step' : undefined}
                      className={`w-full border p-4 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A30000] ${selected ? 'border-[#A30000] border-l-4 bg-white shadow-md dark:bg-[#152038]' : 'border-zinc-200 bg-white hover:border-zinc-400 dark:border-slate-800 dark:bg-[#0e1628] dark:hover:border-slate-600'}`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="font-lexend text-[10px] font-bold uppercase tracking-wider text-[#A30000]">{tutorial.category}</span>
                        <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] text-slate-500 dark:text-zinc-400"><Clock className="h-3 w-3" />{tutorial.durationMin}m</span>
                      </div>
                      <span className="block font-oswald text-sm font-bold uppercase leading-snug text-slate-950 dark:text-white">{tutorial.title}</span>
                      <span className="mt-2 block line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">{tutorial.summary}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="object-lessons-heading">
              <div className="mb-3 flex items-center justify-between">
                <h2 id="object-lessons-heading" className="font-lexend text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">
                  Object identification
                </h2>
                <span className="font-mono text-[10px] text-slate-400">{completedClassificationSteps}/{totalClassificationSteps} complete</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                {CLASSIFICATION_TUTORIALS.map((tutorial, index) => {
                  const selected = selection.kind === 'classification' && selection.id === tutorial.id;
                  return (
                    <button
                      key={tutorial.id}
                      type="button"
                      onClick={() => selectClassificationTutorial(tutorial.id)}
                      aria-current={selected ? 'step' : undefined}
                      className={`min-h-[76px] border p-3 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A30000] ${selected ? 'border-[#A30000] bg-[#A30000] text-white shadow-md' : 'border-zinc-200 bg-white hover:border-[#A30000] dark:border-slate-800 dark:bg-[#0e1628]'}`}
                    >
                      <span className={`mb-1 block font-mono text-[10px] ${selected ? 'text-white/70' : 'text-[#A30000]'}`}>0{index + 1}</span>
                      <span className={`font-oswald text-sm font-bold uppercase ${selected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{tutorial.title}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="border border-zinc-200 border-l-4 border-l-[#A30000] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0e1628]">
              <div className="flex items-center gap-2 font-lexend text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">
                <BookOpen className="h-4 w-4 text-[#A30000]" aria-hidden="true" /> Need the technical reference?
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">Explore function signatures, REST parameters, and FITS cube references in the documentation.</p>
              <button
                type="button"
                onClick={() => onNavigate('documentations')}
                className="mt-4 inline-flex items-center gap-1 font-lexend text-xs font-bold uppercase tracking-wider text-[#A30000] hover:text-[#8B0000]"
              >Browse documentation <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </aside>

          <section className="space-y-5 lg:col-span-8" aria-live="polite">
            <AnimatePresence mode="wait">
              {selectedClassificationTutorial ? (
                <motion.div
                  key={`classification-${selectedClassificationTutorial.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-5"
                >
                  <div className="border border-zinc-200 border-l-4 border-l-[#A30000] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0e1628] sm:p-8">
                    <div className="mb-3 flex flex-wrap items-center gap-2 font-lexend text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">
                      <span className="text-[#A30000]">Object identification</span><span>·</span><span>{selectedClassificationTutorial.eyebrow}</span><span>·</span><span>{selectedClassificationTutorial.steps.length} steps</span>
                    </div>
                    <h2 className="font-oswald text-3xl font-bold uppercase leading-tight text-slate-950 dark:text-white sm:text-4xl">{selectedClassificationTutorial.title}<span className="text-[#A30000]">.</span></h2>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-zinc-300 sm:text-base">{selectedClassificationTutorial.summary}</p>
                    <a
                      href={VIDEO_FOLDER_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex min-h-11 items-center gap-2 bg-[#A30000] px-5 py-3 font-lexend text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#8B0000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A30000]"
                    >
                      <Play className="h-4 w-4 fill-current" aria-hidden="true" /> Watch tutorial videos <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <p className="mt-2 text-[11px] text-slate-500 dark:text-zinc-500">Opens the Sferavis tutorial video folder in Google Drive.</p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-lexend text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">Your field guide</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">Open a step and mark it complete as you review the evidence.</p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-[#A30000]">{selectedClassificationTutorial.steps.filter((_, index) => completedSteps[`classification:${selectedClassificationTutorial.id}:${index}`]).length}/{selectedClassificationTutorial.steps.length}</span>
                  </div>

                  <div className="space-y-3">
                    {selectedClassificationTutorial.steps.map((step, index) => {
                      const stepKey = `classification:${selectedClassificationTutorial.id}:${index}`;
                      const isActive = activeStepIndex === index;
                      const isComplete = Boolean(completedSteps[stepKey]);
                      return (
                        <article key={step.title} className={`border transition-colors ${isActive ? 'border-zinc-300 bg-white shadow-sm dark:border-slate-700 dark:bg-[#152038]' : 'border-zinc-200 bg-white dark:border-slate-800 dark:bg-[#0e1628]'}`}>
                          <button
                            type="button"
                            onClick={() => setActiveStepIndex(isActive ? -1 : index)}
                            aria-expanded={isActive}
                            className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
                          >
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center font-oswald text-sm font-bold ${isComplete ? 'bg-emerald-600 text-white' : isActive ? 'bg-[#A30000] text-white' : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                              {isComplete ? <Check className="h-4 w-4" aria-hidden="true" /> : String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-oswald text-base font-bold uppercase tracking-wide text-slate-950 dark:text-white">{step.title}</span>
                              <span className="mt-1 block text-xs text-slate-500 dark:text-zinc-400">{isComplete ? 'Checkpoint complete' : `Checkpoint ${index + 1} of ${selectedClassificationTutorial.steps.length}`}</span>
                            </span>
                            <ChevronDown className={`h-4 w-4 shrink-0 text-[#A30000] transition-transform ${isActive ? 'rotate-180' : ''}`} aria-hidden="true" />
                          </button>
                          <AnimatePresence initial={false}>
                            {isActive && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="space-y-4 border-t border-zinc-200 px-5 pb-5 pt-4 dark:border-slate-800 sm:pl-[4.75rem]">
                                  <p className="text-sm leading-relaxed text-slate-700 dark:text-zinc-300">{step.body}</p>
                                  {step.details && (
                                    <dl className="grid gap-2 sm:grid-cols-2">
                                      {step.details.map((detail) => (
                                        <div key={`${detail.label}-${detail.value}`} className="flex min-h-12 items-center justify-between gap-3 border border-zinc-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-black/20">
                                          <dt className="text-xs leading-snug text-slate-600 dark:text-zinc-400">{detail.label}</dt>
                                          <dd className="shrink-0 text-right font-mono text-xs font-semibold text-slate-950 dark:text-white">{detail.value}</dd>
                                        </div>
                                      ))}
                                    </dl>
                                  )}
                                  {step.note && <div className="border-l-2 border-[#A30000] bg-[#A30000]/5 p-3 text-xs leading-relaxed text-slate-700 dark:bg-[#A30000]/10 dark:text-zinc-300"><span className="mr-1 font-lexend text-[10px] font-bold uppercase tracking-wider text-[#A30000]">Keep in mind</span>{step.note}</div>}
                                  <button
                                    type="button"
                                    onClick={() => toggleCompleted(stepKey)}
                                    className={`inline-flex min-h-10 items-center gap-2 border px-4 py-2 font-lexend text-[10px] font-bold uppercase tracking-wider transition-colors ${isComplete ? 'border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800' : 'border-zinc-300 text-slate-700 hover:border-[#A30000] hover:text-[#A30000] dark:border-slate-700 dark:text-zinc-200'}`}
                                  >
                                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />{isComplete ? 'Completed — undo' : 'Mark checkpoint complete'}
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </article>
                      );
                    })}
                  </div>

                  <div className="border border-zinc-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-[#0e1628]">
                    <h3 className="font-lexend text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">Interpret the evidence carefully</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">These ranges are comparison criteria transcribed from the supplied tutorial notes, not universal definitions. Consider data quality, uncertainties, redshift, and the original reference graphs before identifying an object.</p>
                  </div>

                  <div className="flex flex-wrap justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-slate-800">
                    <button type="button" onClick={() => onNavigate('documentations')} className="inline-flex items-center gap-1 font-lexend text-xs font-bold uppercase tracking-wider text-[#A30000] hover:text-[#8B0000]">Explore documentation <ChevronRight className="h-3.5 w-3.5" /></button>
                    <a href={VIDEO_FOLDER_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-lexend text-xs font-bold uppercase tracking-wider text-[#A30000] hover:text-[#8B0000]">Open all videos <ExternalLink className="h-3.5 w-3.5" /></a>
                  </div>
                </motion.div>
              ) : selectedLearningTutorial ? (
                <motion.div
                  key={`learning-${selectedLearningTutorial.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-5"
                >
                  <div className="border border-zinc-200 border-l-4 border-l-[#A30000] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0e1628] sm:p-8">
                    <div className="mb-3 flex flex-wrap items-center gap-2 font-lexend text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400"><span className="text-[#A30000]">{selectedLearningTutorial.category}</span><span>·</span><span>{selectedLearningTutorial.level}</span><span>·</span><span>{selectedLearningTutorial.durationMin} mins</span></div>
                    <h2 className="font-oswald text-2xl font-bold uppercase text-slate-950 dark:text-white sm:text-3xl">{selectedLearningTutorial.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-300">{selectedLearningTutorial.summary}</p>
                    <a href={selectedLearningTutorial.videoUrl ?? VIDEO_FOLDER_URL} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 bg-[#A30000] px-5 py-3 font-lexend text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#8B0000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A30000]"><Play className="h-4 w-4 fill-current" aria-hidden="true" /> Watch tutorial videos <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>
                    <div className="mt-5 flex flex-wrap gap-2">{selectedLearningTutorial.prerequisites.map((prerequisite) => <span key={prerequisite} className="border border-zinc-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-600 dark:border-slate-800 dark:bg-black/20 dark:text-zinc-400">{prerequisite}</span>)}</div>
                  </div>

                  {selectedLearningTutorial.learningObjectives && <section className="border border-zinc-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0e1628]"><h3 className="font-lexend text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">By the end of this lesson</h3><ul className="mt-3 grid gap-2 sm:grid-cols-2">{selectedLearningTutorial.learningObjectives.map((objective) => <li key={objective} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-zinc-300"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A30000]" aria-hidden="true" />{objective}</li>)}</ul></section>}

                  <div className="space-y-3">
                    <div className="flex items-end justify-between"><h3 className="font-lexend text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">Lesson steps</h3><span className="font-mono text-[10px] text-slate-400">{selectedLearningTutorial.steps.length} checkpoints</span></div>
                    {selectedLearningTutorial.steps.map((step, index) => {
                      const isActive = activeStepIndex === index;
                      return <article key={`${selectedLearningTutorial.id}-${step.stepNumber}`} className={`border ${isActive ? 'border-zinc-300 bg-white shadow-sm dark:border-slate-700 dark:bg-[#152038]' : 'border-zinc-200 bg-white dark:border-slate-800 dark:bg-[#0e1628]'}`}>
                        <button type="button" onClick={() => setActiveStepIndex(isActive ? -1 : index)} aria-expanded={isActive} className="flex w-full items-center gap-3 p-4 text-left">
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center font-oswald text-sm font-bold ${isActive ? 'bg-[#A30000] text-white' : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>{String(step.stepNumber).padStart(2, '0')}</span>
                          <span className="flex-1 font-oswald text-sm font-bold uppercase text-slate-950 dark:text-white">{step.title}</span>
                          <ChevronDown className={`h-4 w-4 text-[#A30000] transition-transform ${isActive ? 'rotate-180' : ''}`} aria-hidden="true" />
                        </button>
                        {isActive && <div className="space-y-3 border-t border-zinc-200 px-5 pb-5 pt-4 dark:border-slate-800 sm:pl-[4.25rem]"><p className="text-sm leading-relaxed text-slate-700 dark:text-zinc-300">{step.explanation}</p>{step.codeSnippet && <pre className="overflow-x-auto border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-200"><code>{step.codeSnippet}</code></pre>}{step.expectedOutput && <div className="border-l-2 border-[#A30000] bg-slate-50 p-3 dark:bg-black/20"><p className="font-lexend text-[10px] font-bold uppercase tracking-wider text-[#A30000]">{selectedLearningTutorial.coursework ? 'Field note / checkpoint' : 'Expected output'}</p><p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-zinc-300">{step.expectedOutput}</p></div>}</div>}
                      </article>;
                    })}
                  </div>

                  {selectedLearningTutorial.coursework && <section className="border border-zinc-200 border-l-4 border-l-[#A30000] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0e1628]"><h3 className="font-lexend text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">Coursework & self-assessment</h3><p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-300">{selectedLearningTutorial.coursework.deliverable}</p><ul className="mt-4 space-y-2">{selectedLearningTutorial.coursework.assessmentCriteria.map((criterion) => <li key={criterion} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-zinc-300"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A30000]" aria-hidden="true" />{criterion}</li>)}</ul></section>}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-slate-800"><button type="button" onClick={() => onNavigate('documentations')} className="inline-flex items-center gap-1 font-lexend text-xs font-bold uppercase tracking-wider text-[#A30000] hover:text-[#8B0000]">Browse documentation <ChevronRight className="h-3.5 w-3.5" /></button><a href={selectedLearningTutorial.videoUrl ?? VIDEO_FOLDER_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-lexend text-xs font-bold uppercase tracking-wider text-[#A30000] hover:text-[#8B0000]">Open video folder <ExternalLink className="h-3.5 w-3.5" /></a></div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </main>
  );
};
