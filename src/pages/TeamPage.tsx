import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Camera, Github, Globe, Linkedin, Mail, X } from 'lucide-react';
import { PageId } from '../types';

interface TeamPageProps { onNavigate: (page: PageId) => void; }
type Social = { label: string; url: string; platform: 'linkedin'|'github'|'email'|'website' };
type Member = { id: string; name: string; role: string; institution: string; location: string; image: string; biography: string; expertise: string[]; socialLinks: Social[] };

// Replace these clearly marked placeholders with the six real members.
// Add portraits under /public/team/ and set image to e.g. /team/member-name.jpg.
const TEAM_MEMBERS: Member[] = [
 {id:'01',name:'Sajid Aman',role:'Co-lead & Frontend',institution:'Notre Dame College',location:'Dhaka, Bangladesh',image:'https://drive.google.com/thumbnail?id=1pUnSZiif5lS4ElkkcXzM5Nmln8-aQBSC&sz=w1200',biography:'Biography to be added.',expertise:['Frontend development','Project coordination'],socialLinks:[{label:'Portfolio',url:'',platform:'website'},{label:'GitHub',url:'',platform:'github'},{label:'LinkedIn',url:'https://www.linkedin.com/in/sajidaman01/',platform:'linkedin'},{label:'Email',url:'mailto:sajidaman01@outlook.com',platform:'email'}]},
 {id:'02',name:'Radit Raian',role:'Co-lead & Backend',institution:'',location:'',image:'',biography:'Biography to be added.',expertise:['Backend development'],socialLinks:[]},
 {id:'03',name:'Elisabeth Tagobert',role:'UI/UX',institution:'',location:'',image:'',biography:'Biography to be added.',expertise:['UI/UX design'],socialLinks:[]},
 {id:'04',name:'Emils',role:'AI & ML',institution:'',location:'',image:'',biography:'Biography to be added.',expertise:['Artificial intelligence','Machine learning'],socialLinks:[]},
 {id:'05',name:'Ioanna Tsolaki',role:'AI & ML',institution:'',location:'',image:'',biography:'Biography to be added.',expertise:['Artificial intelligence','Machine learning'],socialLinks:[]},
 {id:'06',name:'Sofia',role:'Research & Content',institution:'',location:'',image:'',biography:'Biography to be added.',expertise:['Research','Content development'],socialLinks:[]},
];
const SocialIcon = ({platform}:{platform:Social['platform']}) => platform==='linkedin'?<Linkedin size={17}/>:platform==='github'?<Github size={17}/>:platform==='email'?<Mail size={17}/>:<Globe size={17}/>;

export const TeamPage: React.FC<TeamPageProps> = () => {
 const [selected,setSelected] = useState<Member|null>(null);
 useEffect(()=>{ if(!selected)return; const old=document.body.style.overflow; document.body.style.overflow='hidden'; const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setSelected(null)}; window.addEventListener('keydown',key); return ()=>{document.body.style.overflow=old;window.removeEventListener('keydown',key)}; },[selected]);
 return <div className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] dark:bg-transparent dark:text-white">
  <div className="relative mx-auto max-w-[1440px] px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-14">
   <header className="mx-auto mb-14 w-full max-w-none text-center sm:mb-20">
    <h1 className="w-full whitespace-nowrap text-[clamp(1.15rem,5.1vw,4rem)] font-semibold tracking-[-0.055em] text-[#171b22] dark:text-white">The Minds Behind <span className="text-[#a30000]">Sferavis.</span></h1>
   </header>
   <section aria-label="Sferavis team members" className="mx-auto grid max-w-4xl grid-cols-1 justify-items-center gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-14">
    {TEAM_MEMBERS.map((m,i)=><motion.button key={m.id} type="button" onClick={()=>setSelected(m)} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.45,delay:i*.07}} whileHover={{y:-5}} whileTap={{scale:.99}} className="group w-full max-w-[320px] cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a30000] focus-visible:ring-offset-4 dark:focus-visible:ring-offset-[#080a0e]" aria-label={`View profile of ${m.name}, ${m.role}`}>
     <div className="relative aspect-[3/4] overflow-hidden rounded-[1.35rem] border border-black/[0.06] bg-[#e9edf2] shadow-[0_12px_36px_rgba(20,30,45,0.07)] dark:border-white/[0.08] dark:bg-[#151a22] dark:shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
      {m.image?<img src={m.image} alt={`Portrait of ${m.name}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"/>:<div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#e5eaf0,#cbd4df)] dark:bg-[linear-gradient(145deg,#202a36,#10151d)]"><div className="absolute -right-12 -top-12 h-64 w-64 rounded-full border border-black/[0.06] dark:border-white/[0.07]"/><div className="absolute -bottom-28 -left-16 h-80 w-80 rounded-full border border-black/[0.06] dark:border-white/[0.07]"/><div className="relative flex flex-col items-center gap-3 text-[#788493] dark:text-zinc-500"><div className="flex h-16 w-16 items-center justify-center rounded-full border border-current/20 bg-white/35 dark:bg-white/[0.04]"><Camera size={22} strokeWidth={1.35}/></div><span className="text-[9px] font-semibold uppercase tracking-[0.2em]">Portrait to be added</span></div></div>}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"/><div className="absolute bottom-5 right-5 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/30 bg-white/90 text-[#171b22] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-[#111821] dark:text-white"><ArrowUpRight size={18}/></div>
     </div>
     <div className="px-1 pt-5"><h2 className="font-[Oswald] text-lg font-medium tracking-[-0.025em] text-[#15191f] transition-colors group-hover:text-[#a30000] sm:text-xl dark:text-white dark:group-hover:text-[#a30000]">{m.name}</h2><p className="mt-1.5 text-xs leading-5 text-[#737d89] sm:text-sm dark:text-zinc-400">{m.role}</p></div>
    </motion.button>)}
   </section>
   <section aria-labelledby="global-collaboration-title" className="mx-auto mt-24 max-w-5xl sm:mt-32">
    <div className="mb-8 flex flex-col gap-3 text-center sm:mb-10">
     <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a30000]">Across borders, together</p>
     <h2 id="global-collaboration-title" className="text-3xl font-semibold tracking-[-0.045em] text-[#171b22] sm:text-5xl dark:text-white">A Global Collective.</h2>
    </div>
    <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-[#f4f6f8] p-4 shadow-[0_16px_50px_rgba(20,30,45,0.05)] sm:p-7 dark:border-white/[0.08] dark:bg-[#0d131b] dark:shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
     <div className="relative aspect-[2000/1001] w-full overflow-hidden rounded-xl">
      <img src="/world-map.svg" alt="World map with highlighted team countries" className="absolute inset-0 h-full w-full object-contain" loading="lazy"/>
      <svg viewBox="0 0 2000 1001" preserveAspectRatio="xMidYMid meet" aria-label="Team member locations" className="absolute inset-0 h-full w-full overflow-visible">
       <g fill="#a30000" stroke="white" strokeWidth="4">
        <circle cx="1498" cy="442" r="9"/>
        <circle cx="1506" cy="450" r="9"/>
        <circle cx="1129" cy="356" r="9"/>
        <circle cx="1137" cy="364" r="9"/>
        <circle cx="1138" cy="260" r="9"/>
        <circle cx="1142" cy="250" r="9"/>
       </g>
      </svg>
     </div>
     <div className="mt-3 grid grid-cols-2 gap-3 border-t border-black/[0.07] pt-5 sm:grid-cols-4 dark:border-white/[0.08]">
      {[{country:'Bangladesh',count:'02',city:'South Asia'},{country:'Greece',count:'02',city:'Southern Europe'},{country:'Latvia',count:'01',city:'Northern Europe'},{country:'Estonia',count:'01',city:'Northern Europe'}].map(item=><div key={item.country} className="rounded-xl bg-white/70 px-3 py-3 dark:bg-white/[0.035]"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a929d] dark:text-zinc-500">{item.city}</p><p className="mt-1 text-sm font-medium text-[#303944] dark:text-zinc-200">{item.country}</p><p className="mt-1 font-mono text-xl text-[#a30000]">{item.count}</p></div>)}
     </div>
    </div>
    <p className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-[#929aa5] dark:text-zinc-600">6 members · 4 countries · 1 collective<br/>Map data: Natural Earth · Menelabs VectorAtlas (CC BY 4.0)</p>
   </section>
  </div>
  <AnimatePresence>{selected&&<motion.div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#07090d]/70 p-0 backdrop-blur-md sm:items-center sm:p-6" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}>
   <motion.article role="dialog" aria-modal="true" aria-labelledby="team-profile-name" initial={{opacity:0,y:28,scale:.985}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:18,scale:.99}} transition={{duration:.28,ease:[.2,.75,.25,1]}} className="relative grid max-h-[92vh] w-full max-w-4xl grid-cols-1 overflow-y-auto rounded-t-[1.6rem] border border-white/10 bg-[#f8f9fb] shadow-2xl sm:max-h-[min(760px,90vh)] sm:grid-cols-[.82fr_1.18fr] sm:rounded-[1.6rem] dark:bg-[#10151d]">
    <button type="button" onClick={()=>setSelected(null)} aria-label="Close profile" className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/85 text-[#303944] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a30000] dark:border-white/10 dark:bg-black/40 dark:text-white"><X size={19}/></button>
    <div className="relative min-h-[280px] bg-[#e4e9ef] sm:min-h-[560px] dark:bg-[#1a2430]">{selected.image?<img src={selected.image} alt={`Portrait of ${selected.name}`} className="absolute inset-0 h-full w-full object-cover"/>:<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[linear-gradient(145deg,#e5eaf0,#cbd4df)] text-[#788493] dark:bg-[linear-gradient(145deg,#202a36,#10151d)] dark:text-zinc-500"><Camera size={34} strokeWidth={1.2}/><span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Add member portrait</span></div>}<div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/35 to-transparent"/><span className="absolute bottom-6 left-6 font-mono text-xs tracking-[0.2em] text-white/70">SFERAVIS / PROFILE</span></div>
    <div className="flex flex-col p-7 sm:p-10"><div className="mb-8 pr-10"><h2 id="team-profile-name" className="font-[Oswald] text-3xl font-medium tracking-[-0.025em] text-[#8B0000] sm:text-4xl">{selected.name}</h2><p className="mt-2 text-sm leading-6 text-[#737d89] dark:text-zinc-400">{selected.role}</p>{selected.institution && <p className="mt-1 text-xs leading-5 text-[#737d89] dark:text-zinc-400">{selected.institution}</p>}{selected.location && <p className="text-xs leading-5 text-[#929aa5] dark:text-zinc-500">{selected.location}</p>}</div>
     <div className="space-y-6"><div><h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a929d] dark:text-zinc-500">About</h3><p className="mt-3 text-sm leading-7 text-[#4f5965] dark:text-zinc-300">{selected.biography}</p></div><div><h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a929d] dark:text-zinc-500">Focus & expertise</h3><div className="mt-3 flex flex-wrap gap-2">{selected.expertise.map(x=><span key={x} className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-[#596370] dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">{x}</span>)}</div></div><div className="mt-8 flex flex-wrap gap-3 border-t border-black/[0.08] pt-6 dark:border-white/[0.09]">{selected.socialLinks.filter(link=>link.url && ((link.label.trim().toLowerCase()==='portfolio' && link.platform==='website') || (link.label.trim().toLowerCase()==='github' && link.platform==='github') || (link.label.trim().toLowerCase()==='linkedin' && link.platform==='linkedin') || (['mail','email'].includes(link.label.trim().toLowerCase()) && link.platform==='email'))).map(link=><a key={link.platform} href={link.url} target={link.platform==='email'?undefined:'_blank'} rel={link.platform==='email'?undefined:'noreferrer'} aria-label={link.label} title={link.label} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#4f5965] transition hover:border-[#a30000]/40 hover:bg-[#a30000]/[0.06] hover:text-[#a30000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a30000] dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:text-white"><SocialIcon platform={link.platform}/></a>)}</div></div>
   </motion.article>
  </motion.div>}</AnimatePresence>
 </div>;
};