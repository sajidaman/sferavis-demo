import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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

const card = 'border border-zinc-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0e1628]';
const eyebrow = 'font-lexend text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400';

export const TutorialsPage: React.FC<TutorialsPageProps> = ({ onNavigate }) => {
  const [selection, setSelection] = useState<TutorialSelection>({ kind: 'learning', id: TUTORIALS[0].id });
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const learningTutorial = selection.kind === 'learning'
    ? TUTORIALS.find((tutorial) => tutorial.id === selection.id) ?? TUTORIALS[0]
    : null;
  const classificationTutorial = selection.kind === 'classification'
    ? CLASSIFICATION_TUTORIALS.find((tutorial) => tutorial.id === selection.id) ?? CLASSIFICATION_TUTORIALS[0]
    : null;

  const selectLearning = (tutorial: Tutorial) => {
    setSelection({ kind: 'learning', id: tutorial.id });
    setActiveStepIndex(0);
  };

  const selectClassification = (id: string) => {
    setSelection({ kind: 'classification', id });
    setActiveStepIndex(0);
  };

  const toggleCompleted = (key: string) => {
    setCompletedSteps((current) => ({ ...current, [key]: !current[key] }));
  };

  const classificationStepCount = CLASSIFICATION_TUTORIALS.reduce((count, item) => count + item.steps.length, 0);
  const completedClassificationCount = Object.entries(completedSteps)
    .filter(([key, complete]) => key.startsWith('classification:') && complete).length;
  const currentClassificationComplete = classificationTutorial?.steps
    .filter((_, index) => completedSteps[`classification:${classificationTutorial.id}:${index}`]).length ?? 0;

  return (
    <main className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] selection:bg-[#A30000] selection:text-white dark:text-white">
      <header className="relative mx-auto max-w-[1200px] px-5 pb-10 pt-20 sm:px-8 sm:pt-28 lg:px-14">
        <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-48 w-[min(85vw,44rem)] -translate-x-1/2 rounded-full bg-[#A30000]/[0.07] blur-[90px] dark:bg-[#A30000]/[0.12]" aria-hidden="true" />
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 border border-[#A30000]/20 bg-white/80 px-3 py-1.5 font-lexend text-[10px] font-bold uppercase tracking-[0.2em] text-[#A30000] shadow-sm dark:bg-[#0e1628]/80">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Learn by exploring
          </span>
          <h1 className="font-oswald text-5xl font-black uppercase leading-[0.95] tracking-tight text-slate-950 dark:text-white sm:text-7xl">
            Tutorials<span className="text-[#A30000]">.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-zinc-300 sm:text-base">
            Follow a guided lesson, examine the evidence one step at a time, and build your own field notes.
          </p>
          <div className="mx-auto mt-7 flex max-w-md items-center justify-center gap-3 text-[10px] font-lexend font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">
            <span className="h-px flex-1 bg-zinc-200 dark:bg-slate-800" />
            <span>SFERAvis learning field guide</span>
            <span className="h-px flex-1 bg-zinc-200 dark:bg-slate-800" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
            <section aria-labelledby="learning-paths-heading">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className={eyebrow}>Start learning</p>
                  <h2 id="learning-paths-heading" className="mt-1 font-oswald text-lg font-bold uppercase text-slate-950 dark:text-white">Learning paths</h2>
                </div>
                <span className="mb-1 border border-zinc-200 px-2 py-1 font-mono text-[10px] text-slate-500 dark:border-slate-800 dark:text-zinc-400">{TUTORIALS.length} lessons</span>
              </div>
              <div className="space-y-2">
                {TUTORIALS.map((tutorial, index) => {
                  const selected = selection.kind === 'learning' && selection.id === tutorial.id;
                  return (
                    <button
                      key={tutorial.id}
                      type="button"
                      onClick={() => selectLearning(tutorial)}
                      aria-current={selected ? 'step' : undefined}
                      className={`group w-full border p-4 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A30000] ${selected ? 'border-[#A30000] border-l-4 bg-white shadow-md dark:bg-[#152038]' : 'border-zinc-200 bg-white hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm dark:border-slate-800 dark:bg-[#0e1628] dark:hover:border-slate-600'}`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 font-lexend text-[10px] font-bold uppercase tracking-wider text-[#A30000]"><span className="font-mono text-slate-400 dark:text-zinc-500">0{index + 1}</span>{tutorial.category}</span>
                        <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] text-slate-500 dark:text-zinc-400"><Clock className="h-3 w-3" aria-hidden="true" />{tutorial.durationMin}m</span>
                      </div>
                      <span className="block font-oswald text-sm font-bold uppercase leading-snug text-slate-950 dark:text-white">{tutorial.title}</span>
                      <span className="mt-2 block line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">{tutorial.summary}</span>
                      <span className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2.5 font-lexend text-[9px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-zinc-500"><span>{tutorial.level}</span><span>{tutorial.steps.length} checkpoints</span></span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="object-lessons-heading">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className={eyebrow}>Explore the evidence</p>
                  <h2 id="object-lessons-heading" className="mt-1 font-oswald text-lg font-bold uppercase text-slate-950 dark:text-white">Object identification</h2>
                </div>
                <span className="mb-1 font-mono text-[10px] text-[#A30000]">{completedClassificationCount}/{classificationStepCount}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                {CLASSIFICATION_TUTORIALS.map((tutorial, index) => {
                  const selected = selection.kind === 'classification' && selection.id === tutorial.id;
                  return (
                    <button
                      key={tutorial.id}
                      type="button"
                      onClick={() => selectClassification(tutorial.id)}
                      aria-current={selected ? 'step' : undefined}
                      className={`group min-h-[82px] border p-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A30000] ${selected ? 'border-[#A30000] bg-[#A30000] text-white shadow-md' : 'border-zinc-200 bg-white hover:-translate-y-0.5 hover:border-[#A30000] hover:shadow-sm dark:border-slate-800 dark:bg-[#0e1628]'}`}
                    >
                      <span className={`mb-1 block font-mono text-[10px] ${selected ? 'text-white/70' : 'text-[#A30000]'}`}>0{index + 1} <span className="opacity-60">/ 06</span></span>
                      <span className={`font-oswald text-sm font-bold uppercase ${selected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{tutorial.title}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className={`${card} border-l-4 border-l-[#A30000] p-5`}>
              <div className="flex items-center gap-2 font-lexend text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white"><BookOpen className="h-4 w-4 text-[#A30000]" aria-hidden="true" /> Need the technical reference?</div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">Explore function signatures, REST parameters, and FITS cube references in the documentation.</p>
              <button type="button" onClick={() => onNavigate('documentations')} className="mt-4 inline-flex items-center gap-1 font-lexend text-xs font-bold uppercase tracking-wider text-[#A30000] transition-colors hover:text-[#8B0000]">Browse documentation <ChevronRight className="h-3.5 w-3.5" /></button>
            </div>
          </aside>

          <section className="min-w-0 space-y-5 lg:col-span-8" aria-live="polite">
            <AnimatePresence mode="wait">
              {classificationTutorial ? (
                <motion.div key={`classification-${classificationTutorial.id}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="space-y-5">
                  <div className={`${card} relative overflow-hidden border-l-4 border-l-[#A30000] p-6 sm:p-8`}>
                    <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full border border-[#A30000]/10" aria-hidden="true" />
                    <div className="pointer-events-none absolute -right-2 -top-6 h-32 w-32 rounded-full border border-[#A30000]/10" aria-hidden="true" />
                    <div className="relative">
                      <div className="mb-3 flex flex-wrap items-center gap-2 font-lexend text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400"><span className="text-[#A30000]">Object identification</span><span>·</span><span>{classificationTutorial.eyebrow}</span><span>·</span><span>{classificationTutorial.steps.length} checkpoints</span></div>
                      <h2 className="font-oswald text-3xl font-black uppercase leading-tight text-slate-950 dark:text-white sm:text-5xl">{classificationTutorial.title}<span className="text-[#A30000]">.</span></h2>
                      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-zinc-300 sm:text-base">{classificationTutorial.summary}</p>
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <a href={VIDEO_FOLDER_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 bg-[#A30000] px-5 py-3 font-lexend text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#8B0000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A30000]"><Play className="h-4 w-4 fill-current" aria-hidden="true" /> Watch tutorial videos <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400"><CheckCircle2 className="h-4 w-4 text-[#A30000]" aria-hidden="true" /> {currentClassificationComplete} of {classificationTutorial.steps.length} checkpoints complete</span>
                      </div>
                    </div>
                  </div>

                  <div className={`${card} p-4 sm:p-5`}>
                    <div className="flex items-center justify-between gap-4">
                      <div><p className={eyebrow}>Your field guide</p><p className="mt-1 text-xs text-slate-600 dark:text-zinc-400">Open each checkpoint and record what the evidence tells you.</p></div>
                      <span className="shrink-0 font-mono text-xs font-semibold text-[#A30000]">{String(currentClassificationComplete).padStart(2, '0')} / {String(classificationTutorial.steps.length).padStart(2, '0')}</span>
                    </div>
                    <div className="mt-4 h-1.5 overflow-hidden bg-slate-100 dark:bg-slate-800" role="progressbar" aria-label="Tutorial progress" aria-valuemin={0} aria-valuemax={classificationTutorial.steps.length} aria-valuenow={currentClassificationComplete}>
                      <motion.div className="h-full bg-[#A30000]" initial={false} animate={{ width: `${(currentClassificationComplete / classificationTutorial.steps.length) * 100}%` }} transition={{ duration: 0.3 }} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {classificationTutorial.steps.map((step, index) => {
                      const stepKey = `classification:${classificationTutorial.id}:${index}`;
                      const isActive = activeStepIndex === index;
                      const isComplete = Boolean(completedSteps[stepKey]);
                      return (
                        <article key={step.title} className={`overflow-hidden border transition-all duration-200 ${isActive ? 'border-zinc-300 bg-white shadow-md dark:border-slate-700 dark:bg-[#152038]' : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-slate-800 dark:bg-[#0e1628] dark:hover:border-slate-700'}`}>
                          <button type="button" onClick={() => setActiveStepIndex(isActive ? -1 : index)} aria-expanded={isActive} className="flex w-full items-center gap-4 p-4 text-left sm:p-5">
                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center font-oswald text-sm font-bold ${isComplete ? 'bg-emerald-700 text-white' : isActive ? 'bg-[#A30000] text-white' : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>{isComplete ? <Check className="h-4 w-4" aria-hidden="true" /> : String(index + 1).padStart(2, '0')}</span>
                            <span className="min-w-0 flex-1"><span className="block font-oswald text-base font-bold uppercase tracking-wide text-slate-950 dark:text-white">{step.title}</span><span className="mt-1 block text-xs text-slate-500 dark:text-zinc-400">{isComplete ? 'Checkpoint complete' : `Checkpoint ${index + 1} of ${classificationTutorial.steps.length}`}</span></span>
                            <ChevronDown className={`h-4 w-4 shrink-0 text-[#A30000] transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} aria-hidden="true" />
                          </button>
                          <AnimatePresence initial={false}>
                            {isActive && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden"><div className="space-y-4 border-t border-zinc-200 px-5 pb-5 pt-4 dark:border-slate-800 sm:pl-[4.75rem]">
                              <p className="text-sm leading-relaxed text-slate-700 dark:text-zinc-300">{step.body}</p>
                              {step.details && <dl className="grid gap-2 sm:grid-cols-2">{step.details.map((detail) => <div key={`${detail.label}-${detail.value}`} className="flex min-h-12 items-center justify-between gap-3 border border-zinc-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-black/20"><dt className="text-xs leading-snug text-slate-600 dark:text-zinc-400">{detail.label}</dt><dd className="shrink-0 text-right font-mono text-xs font-semibold text-slate-950 dark:text-white">{detail.value}</dd></div>)}</dl>}
                              {step.note && <div className="border-l-2 border-[#A30000] bg-[#A30000]/5 p-3 text-xs leading-relaxed text-slate-700 dark:bg-[#A30000]/10 dark:text-zinc-300"><span className="mr-1 font-lexend text-[10px] font-bold uppercase tracking-wider text-[#A30000]">Keep in mind</span>{step.note}</div>}
                              <button type="button" onClick={() => toggleCompleted(stepKey)} className={`inline-flex min-h-10 items-center gap-2 border px-4 py-2 font-lexend text-[10px] font-bold uppercase tracking-wider transition-colors ${isComplete ? 'border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800' : 'border-zinc-300 text-slate-700 hover:border-[#A30000] hover:text-[#A30000] dark:border-slate-700 dark:text-zinc-200'}`}><CheckCircle2 className="h-4 w-4" aria-hidden="true" />{isComplete ? 'Completed — undo' : 'Mark checkpoint complete'}</button>
                            </div></motion.div>}
                          </AnimatePresence>
                        </article>
                      );
                    })}
                  </div>

                  <div className="border border-zinc-200 border-l-4 border-l-[#A30000] bg-slate-50 p-5 dark:border-slate-800 dark:bg-[#0e1628]">
                    <h3 className="font-lexend text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">Interpret the evidence carefully</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">These ranges are comparison criteria transcribed from the supplied tutorial notes, not universal definitions. Consider data quality, uncertainties, redshift, and original reference graphs before identifying an object.</p>
                  </div>
                </motion.div>
              ) : learningTutorial ? (
                <motion.div key={`learning-${learningTutorial.id}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="space-y-5">
                  <div className={`${card} border-l-4 border-l-[#A30000] p-6 sm:p-8`}>
                    <div className="mb-3 flex flex-wrap items-center gap-2 font-lexend text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400"><span className="text-[#A30000]">{learningTutorial.category}</span><span>·</span><span>{learningTutorial.level}</span><span>·</span><span>{learningTutorial.durationMin} mins</span></div>
                    <h2 className="font-oswald text-2xl font-bold uppercase text-slate-950 dark:text-white sm:text-3xl">{learningTutorial.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-300">{learningTutorial.summary}</p>
                    <a href={learningTutorial.videoUrl ?? VIDEO_FOLDER_URL} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 bg-[#A30000] px-5 py-3 font-lexend text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#8B0000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A30000]"><Play className="h-4 w-4 fill-current" aria-hidden="true" /> Watch tutorial videos <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>
                    <div className="mt-5 flex flex-wrap gap-2">{learningTutorial.prerequisites.map((prerequisite) => <span key={prerequisite} className="border border-zinc-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-600 dark:border-slate-800 dark:bg-black/20 dark:text-zinc-400">{prerequisite}</span>)}</div>
                  </div>

                  {learningTutorial.learningObjectives && <section className={`${card} p-5`}><h3 className="font-lexend text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">By the end of this lesson</h3><ul className="mt-3 grid gap-2 sm:grid-cols-2">{learningTutorial.learningObjectives.map((objective) => <li key={objective} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-zinc-300"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A30000]" aria-hidden="true" />{objective}</li>)}</ul></section>}

                  <div className="space-y-3"><div className="flex items-end justify-between"><div><p className={eyebrow}>Your lesson</p><h3 className="mt-1 font-oswald text-lg font-bold uppercase text-slate-950 dark:text-white">Step-by-step progression</h3></div><span className="font-mono text-[10px] text-slate-400">{learningTutorial.steps.length} checkpoints</span></div>
                    {learningTutorial.steps.map((step, index) => {
                      const isActive = activeStepIndex === index;
                      return <article key={`${learningTutorial.id}-${step.stepNumber}`} className={`overflow-hidden border transition-colors ${isActive ? 'border-zinc-300 bg-white shadow-md dark:border-slate-700 dark:bg-[#152038]' : 'border-zinc-200 bg-white dark:border-slate-800 dark:bg-[#0e1628]'}`}>
                        <button type="button" onClick={() => setActiveStepIndex(isActive ? -1 : index)} aria-expanded={isActive} className="flex w-full items-center gap-3 p-4 text-left"><span className={`flex h-8 w-8 shrink-0 items-center justify-center font-oswald text-sm font-bold ${isActive ? 'bg-[#A30000] text-white' : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>{String(step.stepNumber).padStart(2, '0')}</span><span className="flex-1 font-oswald text-sm font-bold uppercase text-slate-950 dark:text-white">{step.title}</span><ChevronDown className={`h-4 w-4 text-[#A30000] transition-transform ${isActive ? 'rotate-180' : ''}`} aria-hidden="true" /></button>
                        <AnimatePresence initial={false}>{isActive && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="space-y-3 border-t border-zinc-200 px-5 pb-5 pt-4 dark:border-slate-800 sm:pl-[4.25rem]"><p className="text-sm leading-relaxed text-slate-700 dark:text-zinc-300">{step.explanation}</p>{step.codeSnippet && <pre className="overflow-x-auto border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-200"><code>{step.codeSnippet}</code></pre>}{step.expectedOutput && <div className="border-l-2 border-[#A30000] bg-slate-50 p-3 dark:bg-black/20"><p className="font-lexend text-[10px] font-bold uppercase tracking-wider text-[#A30000]">{learningTutorial.coursework ? 'Field note / checkpoint' : 'Expected output'}</p><p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-zinc-300">{step.expectedOutput}</p></div>}</div></motion.div>}</AnimatePresence>
                      </article>;
                    })}
                  </div>

                  {learningTutorial.coursework && <section className={`${card} border-l-4 border-l-[#A30000] p-6`}><h3 className="font-lexend text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">Coursework & self-assessment</h3><p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-300">{learningTutorial.coursework.deliverable}</p><ul className="mt-4 space-y-2">{learningTutorial.coursework.assessmentCriteria.map((criterion) => <li key={criterion} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-zinc-300"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A30000]" aria-hidden="true" />{criterion}</li>)}</ul></section>}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </main>
  );
};
