import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, GraduationCap, Code, 
  Save, Eye, Download, Layout, 
  Trash2, Plus, ArrowRight, ArrowLeft, Search, Sparkles,
  Award, Folder, CheckCircle, Target, Trophy, Link as LinkIcon,
  Upload, FileSearch, BarChart, Activity, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// --- Resume Template Components (Inlined for simplicity in this file) ---

const ElegantTemplate = ({ data }) => (
  <div id="resume-elegant" className="p-10 bg-white text-slate-800 font-serif w-[210mm] min-h-[297mm] mx-auto shadow-2xl">
    <div className="border-b-2 border-slate-800 pb-6 mb-8 text-center">
      <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{data.personal?.fullName || 'Your Name'}</h1>
      <div className="text-xs text-slate-600 flex flex-wrap justify-center gap-x-4 gap-y-1 italic mb-4">
        <span>{data.personal?.email}</span>
        <span>•</span>
        <span>{data.personal?.phone}</span>
        <span>•</span>
        <span>{data.personal?.location}</span>
        {data.personal?.linkedin && <><span>•</span> <span className="text-blue-700 underline">{data.personal.linkedin}</span></>}
        {data.personal?.github && <><span>•</span> <span className="text-slate-900 underline">{data.personal.github}</span></>}
        {data.personal?.portfolio && <><span>•</span> <span className="text-slate-900 underline">{data.personal.portfolio}</span></>}
      </div>
      {data.objective && (
        <p className="text-sm text-slate-700 italic max-w-2xl mx-auto leading-relaxed mt-4">"{data.objective}"</p>
      )}
    </div>
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold border-b border-slate-300 mb-4 pb-1 uppercase tracking-wider">Experience</h2>
        {data.experience?.map((exp, i) => (
          <div key={i} className="mb-4 text-sm">
            <div className="flex justify-between font-bold">
              <span>{exp.jobTitle}</span>
              <span>{exp.startDate} - {exp.endDate}</span>
            </div>
            <div className="italic text-slate-600 mb-1">{exp.company}</div>
            <p className="leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </section>
      {data.projects?.[0]?.title && (
        <section>
          <h2 className="text-xl font-bold border-b border-slate-300 mb-4 pb-1 uppercase tracking-wider">Projects</h2>
          {data.projects.map((proj, i) => (
            <div key={i} className="mb-4 text-sm">
              <div className="flex justify-between font-bold">
                <span>{proj.title}</span>
                <span className="text-xs text-blue-600 underline font-normal italic">{proj.link}</span>
              </div>
              <p className="mt-1 leading-relaxed italic text-slate-600">{proj.description}</p>
            </div>
          ))}
        </section>
      )}
      <section>
        <h2 className="text-xl font-bold border-b border-slate-300 mb-4 pb-1 uppercase tracking-wider">Education</h2>
        {data.education?.map((edu, i) => (
          <div key={i} className="mb-3 text-sm">
             <div className="flex justify-between font-bold">
              <span>{edu.degree}</span>
              <span>{edu.startYear} — {edu.endYear}</span>
            </div>
            <div className="text-slate-600">{edu.school}</div>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-xl font-bold border-b border-slate-300 mb-4 pb-1 uppercase tracking-wider">Skills & Certifications</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {data.skills?.map((skill, i) => (
            <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs italic">{skill}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
           {data.certifications?.map((cert, i) => (
             <div key={i} className="text-xs font-serif italic">
                <span className="font-bold underline">{cert.name}</span> — {cert.issuer} ({cert.year})
             </div>
           ))}
        </div>
      </section>
      {data.achievements?.length > 0 && (
         <section>
            <h2 className="text-xl font-bold border-b border-slate-300 mb-4 pb-1 uppercase tracking-wider">Key Achievements</h2>
            <ul className="list-disc list-inside space-y-1 group">
               {data.achievements.map((item, i) => (
                  <li key={i} className="text-sm italic text-slate-700 leading-relaxed">{item}</li>
               ))}
            </ul>
         </section>
      )}
    </div>
  </div>
);

const ModernTemplate = ({ data }) => (
  <div id="resume-modern" className="p-0 bg-white text-slate-800 font-sans w-[210mm] min-h-[297mm] mx-auto shadow-2xl flex">
    <div className="w-1/3 bg-slate-100 p-8 flex flex-col gap-8">
      <div className="space-y-2">
        <div className="w-20 h-2 bg-blue-600 mb-4"></div>
        <h1 className="text-2xl font-black uppercase text-slate-900 leading-tight">{data.personal?.fullName || 'Your Name'}</h1>
        <p className="text-blue-600 font-bold uppercase text-xs tracking-widest">{data.experience?.[0]?.jobTitle || 'Professional'}</p>
      </div>
      <div className="space-y-4">
        <h3 className="font-bold border-b border-slate-300 pb-1 uppercase text-sm tracking-widest">Connect</h3>
        <p className="text-[10px] text-slate-500 break-all">{data.personal?.email}</p>
        <p className="text-[10px] text-slate-500">{data.personal?.phone}</p>
        {data.personal?.linkedin && <p className="text-[10px] text-blue-600 font-bold">{data.personal.linkedin}</p>}
        {data.personal?.github && <p className="text-[10px] text-slate-800 font-bold">{data.personal.github}</p>}
        {data.personal?.portfolio && <p className="text-[10px] text-slate-800 font-bold underline">{data.personal.portfolio}</p>}
      </div>
      <div className="space-y-4">
        <h3 className="font-bold border-b border-slate-300 pb-1 uppercase text-sm tracking-widest">Skills</h3>
        <div className="grid grid-cols-1 gap-1">
          {data.skills?.map((skill, i) => (
            <div key={i} className="text-xs py-1 px-2 bg-white rounded flex items-center gap-2 border border-slate-200">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
               {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="flex-1 p-10 space-y-8">
       {data.objective && (
          <section className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
             <h3 className="text-xs font-black uppercase text-blue-600 mb-2 tracking-widest">Profile</h3>
             <p className="text-sm italic text-slate-600 leading-relaxed font-medium">{data.objective}</p>
          </section>
       )}
       <section>
        <h2 className="text-lg font-black border-l-4 border-blue-600 pl-3 mb-6 uppercase tracking-wider">Experience</h2>
        {data.experience?.map((exp, i) => (
          <div key={i} className="mb-6 group">
            <h4 className="font-bold text-slate-900">{exp.jobTitle}</h4>
            <div className="flex justify-between text-xs font-bold text-blue-600 mb-2">
              <span>{exp.company}</span>
              <span>{exp.startDate} — {exp.endDate}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">{exp.description}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-lg font-black border-l-4 border-blue-600 pl-3 mb-6 uppercase tracking-wider">Education</h2>
        {data.education?.map((edu, i) => (
          <div key={i} className="mb-4">
             <h4 className="font-bold text-slate-900">{edu.degree}</h4>
             <div className="flex justify-between text-xs font-bold text-blue-600">
                <span>{edu.school}</span>
                <span>{edu.startYear} — {edu.endYear}</span>
             </div>
          </div>
        ))}
      </section>
      {data.projects?.[0]?.title && (
         <section>
            <h2 className="text-lg font-black border-l-4 border-blue-600 pl-3 mb-6 uppercase tracking-wider">Key Projects</h2>
            {data.projects.map((proj, i) => (
              <div key={i} className="mb-4">
                 <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                 <p className="text-[10px] text-blue-600 mb-1">{proj.link}</p>
                 <p className="text-xs text-slate-600 leading-tight">{proj.description}</p>
              </div>
            ))}
         </section>
      )}
      {data.certifications?.[0]?.name && (
         <section>
            <h2 className="text-lg font-black border-l-4 border-blue-600 pl-3 mb-6 uppercase tracking-wider">Certifications</h2>
            <div className="grid grid-cols-1 gap-3">
               {data.certifications.map((cert, i) => (
                 <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-bold">{cert.name}</span>
                    <span className="text-slate-500 italic">{cert.year}</span>
                 </div>
               ))}
            </div>
         </section>
      )}
       {data.achievements?.length > 0 && (
          <section>
             <h2 className="text-lg font-black border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-wider">Achievements</h2>
             <div className="space-y-2">
                {data.achievements.map((item, i) => (
                   <div key={i} className="flex gap-3 items-start text-xs font-medium text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0"></div>
                      {item}
                   </div>
                ))}
             </div>
          </section>
       )}
    </div>
  </div>
);

const MinimalTemplate = ({ data }) => (
  <div id="resume-minimal" className="p-12 bg-white text-slate-700 font-sans w-[210mm] min-h-[297mm] mx-auto shadow-2xl">
     <header className="mb-12">
        <h1 className="text-5xl font-light text-slate-900 tracking-tighter mb-4">{data.personal?.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
           <span>{data.personal?.email}</span>
           <span>{data.personal?.phone}</span>
           <span>{data.personal?.location}</span>
           {data.personal?.linkedin && <span className="text-slate-900">{data.personal.linkedin}</span>}
           {data.personal?.github && <span className="text-slate-900">{data.personal.github}</span>}
        </div>
        {data.objective && (
           <p className="mt-8 text-lg font-light leading-relaxed text-slate-500 border-l-2 border-slate-100 pl-6 max-w-3xl">
              {data.objective}
           </p>
        )}
     </header>
     <div className="space-y-12">
        <section>
           <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6 border-b pb-2 px-1">Experience</h3>
           {data.experience?.map((exp, i) => (
             <div key={i} className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-sm font-bold text-slate-400">{exp.startDate} — {exp.endDate}</div>
                <div className="col-span-3">
                   <h4 className="font-bold text-slate-900">{exp.jobTitle}</h4>
                   <p className="text-xs text-slate-500 mb-2">@{exp.company}</p>
                   <p className="text-sm leading-relaxed">{exp.description}</p>
                </div>
             </div>
           ))}
        </section>
        <section>
           <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6 border-b pb-2 px-1">Education</h3>
           {data.education?.map((edu, i) => (
             <div key={i} className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-sm font-bold text-slate-400">{edu.startYear} — {edu.endYear}</div>
                <div className="col-span-3">
                   <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                   <p className="text-xs text-slate-500">{edu.school}</p>
                </div>
             </div>
           ))}
        </section>
        {data.projects?.[0]?.title && (
           <section>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6 border-b pb-2 px-1">Projects</h3>
              {data.projects.map((proj, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 mb-4">
                   <div className="text-[10px] text-slate-400 font-bold uppercase overflow-hidden">{proj.title}</div>
                   <div className="col-span-3">
                      <p className="text-xs font-medium text-slate-800">{proj.description}</p>
                   </div>
                </div>
              ))}
           </section>
        )}
        {data.achievements?.length > 0 && (
           <section>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6 border-b pb-2 px-1">Achievements</h3>
              <div className="grid grid-cols-4 gap-4">
                 <div className="col-span-1"></div>
                 <div className="col-span-3 space-y-3">
                    {data.achievements.map((item, i) => (
                       <p key={i} className="text-sm font-medium leading-snug">{item}</p>
                    ))}
                 </div>
              </div>
           </section>
        )}
     </div>
  </div>
);
const TechTemplate = ({ data }) => (
  <div id="resume-tech" className="p-12 bg-[#0d1117] text-[#c9d1d9] font-mono w-[210mm] min-h-[297mm] mx-auto shadow-2xl border border-[#30363d]">
     <div className="mb-10 text-[#58a6ff]">
        <h1 className="text-3xl font-bold mb-2">/usr/bin/resume --user "{data.personal?.fullName || 'user'}"</h1>
        <div className="text-[10px] opacity-70 flex flex-wrap gap-4">
           {data.personal?.email && <span>email: {data.personal.email}</span>}
           {data.personal?.location && <span>location: {data.personal.location}</span>}
           {data.personal?.linkedin && <span>linkedin: {data.personal.linkedin}</span>}
           {data.personal?.github && <span>github: {data.personal.github}</span>}
        </div>
        {data.objective && (
           <div className="mt-6 p-4 bg-[#161b22] border-l-2 border-[#58a6ff] text-xs leading-relaxed opacity-80">
              <span className="text-[#f85149] font-bold">summary:</span> {data.objective}
           </div>
        )}
     </div>
     <div className="space-y-10">
        {data.experience?.some(exp => exp.jobTitle) && (
        <section>
           <h3 className="text-xl font-bold text-[#8b949e] border-b border-[#30363d] mb-4 pb-1 group cursor-default">
             <span className="text-[#f85149]">#</span> Experience
           </h3>
           {data.experience.map((exp, i) => (
             exp.jobTitle && (
             <div key={i} className="mb-6 ml-4">
                <div className="text-green-500 font-bold">
                  {exp.jobTitle} {exp.company && <span className="text-[#8b949e] font-normal">@ {exp.company}</span>}
                </div>
                {(exp.startDate || exp.endDate) && (
                  <div className="text-[10px] text-[#8b949e] mb-2">[{exp.startDate} {"->"} {exp.endDate}]</div>
                )}
                {exp.description && <p className="text-xs leading-relaxed opacity-80">{exp.description}</p>}
             </div>
             )
           ))}
        </section>
        )}
        {data.education?.some(edu => edu.degree) && (
        <section>
            <h3 className="text-xl font-bold text-[#8b949e] border-b border-[#30363d] mb-4 pb-1">
              <span className="text-[#f85149]">#</span> Education
            </h3>
            {data.education.map((edu, i) => (
              edu.degree && (
              <div key={i} className="mb-4 ml-4">
                 <div className="text-[#58a6ff] font-bold">{edu.degree}</div>
                 <div className="text-[10px] text-[#8b949e]">
                   {edu.school} {edu.school && (edu.startYear || edu.endYear) && "|"} {edu.startYear} {"->"} {edu.endYear}
                 </div>
              </div>
              )
            ))}
        </section>
        )}
        {(data.skills?.some(s => s.trim()) || data.certifications?.some(c => c.name)) && (
        <section>
           <h3 className="text-xl font-bold text-[#8b949e] border-b border-[#30363d] mb-4 pb-1">
             <span className="text-[#f85149]">#</span> Skills & Certs
           </h3>
           <div className="flex flex-wrap gap-2 ml-4 mb-4">
              {data.skills?.map((skill, i) => (
                skill.trim() && <span key={i} className="px-2 py-0.5 bg-[#161b22] border border-[#30363d] rounded text-[10px] hover:border-[#58a6ff] transition-colors">{skill}</span>
              ))}
           </div>
           {data.certifications?.some(c => c.name) && (
           <div className="space-y-1 ml-4 text-[10px]">
              {data.certifications.map((cert, i) => (
                cert.name && <div key={i} className="text-[#8b949e]">{">"} certified --name "{cert.name}" --issuer "{cert.issuer}"</div>
              ))}
           </div>
           )}
        </section>
        )}
        {data.projects?.[0]?.title && (
           <section>
              <h3 className="text-xl font-bold text-[#8b949e] border-b border-[#30363d] mb-4 pb-1">
                <span className="text-[#f85149]">#</span> Projects
              </h3>
              {data.projects.map((proj, i) => (
                proj.title && (
                <div key={i} className="mb-4 ml-4">
                   <div className="text-[#58a6ff] font-bold underline text-xs">{proj.title}</div>
                   {proj.description && <p className="text-[10px] opacity-70 mt-1">{proj.description}</p>}
                </div>
                )
              ))}
           </section>
        )}
        {data.achievements?.some(a => a.trim()) && (
           <section>
              <h3 className="text-xl font-bold text-[#8b949e] border-b border-[#30363d] mb-4 pb-1">
                <span className="text-[#f85149]">#</span> Achievements
              </h3>
              <div className="ml-4 space-y-1">
                 {data.achievements.map((item, i) => (
                    item.trim() && (
                    <div key={i} className="text-[10px] opacity-80">
                       <span className="text-yellow-500 font-bold">*</span> {item}
                    </div>
                    )
                 ))}
              </div>
           </section>
        )}
     </div>
  </div>
);

const CorporateTemplate = ({ data }) => (
  <div id="resume-corporate" className="p-12 bg-white text-slate-900 font-sans w-[210mm] min-h-[297mm] mx-auto shadow-2xl border-t-8 border-slate-900">
     <div className="flex justify-between items-start mb-12">
        <div className="flex-1">
           <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{data.personal?.fullName || 'Your Name'}</h1>
           <div className="text-[10px] font-bold text-slate-500 flex flex-wrap gap-x-4 uppercase tracking-widest">
              <span>{data.personal?.location}</span>
              {data.personal?.linkedin && <span>LinkedIn: {data.personal.linkedin}</span>}
              {data.personal?.github && <span>GitHub: {data.personal.github}</span>}
              {data.personal?.portfolio && <span>Portfolio: {data.personal.portfolio}</span>}
           </div>
        </div>
        <div className="text-right text-sm font-bold flex flex-col gap-1">
           <span>{data.personal?.phone}</span>
           <span className="text-blue-700 underline">{data.personal?.email}</span>
        </div>
     </div>
     {data.objective && (
        <section className="mb-10 px-3">
           <h3 className="text-xs font-black uppercase text-slate-400 mb-3 tracking-widest border-l-4 border-slate-900 pl-3">Executive Summary</h3>
           <p className="text-sm font-medium leading-relaxed italic text-slate-800">{data.objective}</p>
        </section>
     )}
     <div className="space-y-10">
        {data.experience?.some(exp => exp.jobTitle) && (
        <section>
           <h3 className="text-lg font-black border-b-2 border-slate-900 mb-6 uppercase tracking-widest bg-slate-100 px-3 py-1">Experience History</h3>
           {data.experience.map((exp, i) => (
             exp.jobTitle && (
             <div key={i} className="mb-6 px-3">
                <div className="flex justify-between items-baseline mb-1">
                   <h4 className="text-lg font-black">{exp.company}</h4>
                   <span className="text-sm font-black text-slate-400">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-sm font-bold italic text-blue-800 mb-3">{exp.jobTitle}</div>
                <p className="text-sm leading-snug text-slate-700 font-medium">{exp.description}</p>
             </div>
             )
           ))}
        </section>
        )}
        {data.education?.some(edu => edu.degree) && (
        <section>
           <h3 className="text-lg font-black border-b-2 border-slate-900 mb-6 uppercase tracking-widest bg-slate-100 px-3 py-1">Academic History</h3>
           {data.education.map((edu, i) => (
             edu.degree && (
             <div key={i} className="mb-6 px-3">
                <div className="flex justify-between items-baseline mb-1">
                   <h4 className="text-lg font-black">{edu.degree}</h4>
                   <span className="text-sm font-black text-slate-400">{edu.startYear} – {edu.endYear}</span>
                </div>
                <div className="text-sm font-bold italic text-blue-800 mb-2">{edu.school}</div>
             </div>
             )
           ))}
        </section>
        )}
        {(data.skills?.some(s => s.trim()) || data.certifications?.some(c => c.name)) && (
        <section>
          <h3 className="text-lg font-black border-b-2 border-slate-900 mb-6 uppercase tracking-widest bg-slate-100 px-3 py-1">Core Competencies & Certs</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-3 mb-6">
             {data.skills?.map((skill, i) => (
                skill.trim() && (
                <div key={i} className="text-sm font-bold flex items-center gap-2 border-b border-slate-100 pb-1 uppercase tracking-tighter">
                   <span className="w-1.5 h-1.5 bg-slate-900"></span>
                   {skill}
                </div>
                )
             ))}
          </div>
          <div className="px-3 space-y-2">
             {data.certifications?.map((cert, i) => (
                cert.name && (
                <div key={i} className="text-sm font-bold italic text-slate-600 flex justify-between">
                   <span>{cert.name} — {cert.issuer}</span>
                   <span>{cert.year}</span>
                </div>
                )
             ))}
          </div>
        </section>
        )}
        {data.achievements?.some(a => a.trim()) && (
           <section>
              <h3 className="text-lg font-black border-b-2 border-slate-900 mb-6 uppercase tracking-widest bg-slate-100 px-3 py-1">Career Highlights</h3>
              <ul className="list-disc list-inside space-y-2 px-3">
                 {data.achievements.map((item, i) => (
                    item.trim() && <li key={i} className="text-sm font-bold italic text-slate-700">{item}</li>
                 ))}
              </ul>
           </section>
        )}
        {data.projects?.[0]?.title && (
           <section>
              <h3 className="text-lg font-black border-b-2 border-slate-900 mb-6 uppercase tracking-widest bg-slate-100 px-3 py-1">Recent Projects</h3>
              {data.projects.map((proj, i) => (
                proj.title && (
                <div key={i} className="mb-6 px-3">
                   <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-black">{proj.title}</h4>
                      <span className="text-xs font-bold text-blue-700 underline italic">{proj.link}</span>
                   </div>
                   <p className="text-sm leading-snug text-slate-700 font-medium italic">{proj.description}</p>
                </div>
                )
              ))}
           </section>
        )}
     </div>
  </div>
);


// --- End of Templates ---

const Home = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [resumeData, setResumeData] = useState({
    personal: { 
       fullName: '', email: '', phone: '', location: '',
       linkedin: '', github: '', portfolio: ''
    },
    objective: '',
    experience: [{ jobTitle: '', company: '', startDate: '', endDate: '', description: '' }],
    education: [{ degree: '', school: '', startYear: '', endYear: '' }],
    certifications: [{ name: '', issuer: '', year: '' }],
    projects: [{ title: '', link: '', description: '' }],
    achievements: [],
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  
  const years = Array.from({ length: 61 }, (_, i) => 2030 - i);
  const [saving, setSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  // ATS Score State
  const [atsData, setAtsData] = useState(null);
  const [atsFile, setAtsFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [atsLoading, setAtsLoading] = useState(false);

  const [fetching, setFetching] = useState(true);

  // Fetch user info from Supabase session and database
  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Initial fallback from metadata
        setResumeData(prev => ({
          ...prev,
          personal: {
            ...prev.personal,
            fullName: user.user_metadata?.full_name || prev.personal.fullName,
            email: user.email || prev.personal.email
          }
        }));

        // Fetch actual profile from DB
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data && !error) {
          setResumeData({
            personal: {
              fullName: data.full_name || '',
              email: data.email || '',
              phone: data.phone || '',
              location: data.location || '',
              linkedin: data.linkedin || '',
              github: data.github || '',
              portfolio: data.portfolio || ''
            },
            objective: data.summary || '',
            experience: data.experience || [{ jobTitle: '', company: '', startDate: '', endDate: '', description: '' }],
            education: data.education || [{ degree: '', school: '', startYear: '', endYear: '' }],
            certifications: data.certifications || [{ name: '', issuer: '', year: '' }],
            projects: data.projects || [{ title: '', link: '', description: '' }],
            achievements: data.achievements || [],
            skills: data.skills || []
          });
        }
      }
      setFetching(false);
    };
    fetchData();
  }, []);

  const handlePersonalChange = (e) => {
    setResumeData({ 
      ...resumeData, 
      personal: { ...resumeData.personal, [e.target.name]: e.target.value } 
    });
  };

  const addAchievement = () => {
    if (newAchievement.trim() && !resumeData.achievements.includes(newAchievement.trim())) {
      setResumeData({ ...resumeData, achievements: [...resumeData.achievements, newAchievement.trim()] });
      setNewAchievement('');
    }
  };

  const removeAchievement = (item) => {
    setResumeData({ ...resumeData, achievements: resumeData.achievements.filter(a => a !== item) });
  };

  const handleArrayChange = (i, field, value, type) => {
    const newArr = [...resumeData[type]];
    newArr[i][field] = value;
    setResumeData({ ...resumeData, [type]: newArr });
  };

  const addArrayItem = (type) => {
    let newItem;
    if (type === 'experience') {
      newItem = { jobTitle: '', company: '', startDate: '', endDate: '', description: '' };
    } else if (type === 'education') {
      newItem = { degree: '', school: '', startYear: '', endYear: '' };
    } else if (type === 'certifications') {
      newItem = { name: '', issuer: '', year: '' };
    } else if (type === 'projects') {
      newItem = { title: '', link: '', description: '' };
    }
    setResumeData({ ...resumeData, [type]: [...resumeData[type], newItem] });
  };

  const handleAtsCheck = async () => {
    if (!atsFile) return alert("Please upload a resume PDF first.");
    
    setAtsLoading(true);
    const formData = new FormData();
    formData.append('resume', atsFile);
    formData.append('jobDesc', jobDescription || 'General software engineering role');

    try {
      const response = await fetch(`${API_URL}/api/check-ats-pdf/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setAtsData(data);
      } else {
        alert(data.error || "Analysis failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Backend error. Make sure your server is running.");
    } finally {
      setAtsLoading(false);
    }
  };

  const removeArrayItem = (i, type) => {
    const newArr = resumeData[type].filter((_, index) => index !== i);
    setResumeData({ ...resumeData, [type]: newArr });
  };

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData({ ...resumeData, skills: [...resumeData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setResumeData({ ...resumeData, skills: resumeData.skills.filter(s => s !== skill) });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: resumeData.personal.fullName,
          email: resumeData.personal.email,
          phone: resumeData.personal.phone,
          location: resumeData.personal.location,
          linkedin: resumeData.personal.linkedin,
          github: resumeData.personal.github,
          portfolio: resumeData.personal.portfolio,
          summary: resumeData.objective,
          experience: resumeData.experience,
          education: resumeData.education,
          certifications: resumeData.certifications,
          projects: resumeData.projects,
          achievements: resumeData.achievements,
          skills: resumeData.skills,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error saving data: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = async (templateId) => {
    const originalElement = document.getElementById(templateId);
    if (!originalElement) {
       console.error("Template element not found:", templateId);
       return;
    }

    setSaving(true); // Reuse saving state for loading feedback
    try {
      // To get a perfect PDF, we render it at full size in a hidden area
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.top = '0';
      document.body.appendChild(pdfContainer);

      // Clone the element and remove any scaling/transforms
      const clone = originalElement.cloneNode(true);
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.style.width = '210mm'; // Standard A4 width
      pdfContainer.appendChild(clone);

      // Wait a bit for any images/fonts to settle
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(clone, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Resume-${resumeData.personal.fullName || 'BuildIT'}.pdf`);
      
      document.body.removeChild(pdfContainer);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User className="w-5 h-5" /> },
    { id: 'objective', label: 'Objective', icon: <Target className="w-5 h-5" /> },
    { id: 'experience', label: 'Work Experience', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <Folder className="w-5 h-5" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-5 h-5" /> },
    { id: 'skills', label: 'Skills', icon: <Code className="w-5 h-5" /> },
    { id: 'ats', label: 'ATS Score', icon: <BarChart className="w-5 h-5" /> },
    { id: 'preview', label: 'Preview Templates', icon: <Layout className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-900 font-sans relative">
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-[200] flex items-center gap-4 bg-emerald-600 px-8 py-4 rounded-3xl shadow-2xl shadow-emerald-600/40 border border-emerald-500/50"
          >
            <div className="bg-white/20 p-2 rounded-xl">
               <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
               <h4 className="text-white font-black text-lg">All Saved!</h4>
               <p className="text-emerald-100 text-sm font-bold">Your progress is safely stored.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Top Navigation */}
      <div className="lg:hidden sticky top-0 bg-slate-800/80 backdrop-blur-xl z-[40] border-b border-slate-700/50">
        <div className="flex items-center justify-between p-4 px-6 border-b border-white/5">
             <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-black text-white">Build IT</span>
             </div>
             <button onClick={handleSave} className="bg-emerald-600 p-2 rounded-xl text-white">
                <Save className="w-5 h-5" />
             </button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar p-2 gap-2">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => { setActiveTab(tab.id); setActiveTemplate(null); }}
               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm font-bold ${
                 activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-400 bg-slate-700/30'
               }`}
             >
               {React.cloneElement(tab.icon, { className: 'w-4 h-4' })}
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      {/* Sidebar with Tabs (Desktop Only) */}
      <aside className="hidden lg:flex w-80 bg-slate-800/50 border-r border-slate-700/50 backdrop-blur-xl p-8 flex flex-col justify-between fixed h-full z-10 overflow-y-auto no-scrollbar">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white">Build IT</span>
          </div>

          <nav className="flex flex-col gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setActiveTemplate(null); }}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-20"></div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-80 flex-1 p-6 lg:p-12 text-white">
        <AnimatePresence mode="wait">
          {activeTab === 'personal' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-2 text-center lg:text-left">Personal Information</h1>
                <p className="text-slate-400 font-medium text-center lg:text-left">This information will be at the very top of your resume.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {[
                  { label: 'Full Name', name: 'fullName', placeholder: 'John Doe', type: 'text' },
                  { label: 'Email Address', name: 'email', placeholder: 'john@example.com', type: 'email' },
                  { label: 'Phone Number', name: 'phone', placeholder: '+91 98765 43210', type: 'text' },
                  { label: 'Location', name: 'location', placeholder: 'Mumbai, India', type: 'text' },
                  { label: 'LinkedIn', name: 'linkedin', placeholder: 'linkedin.com/in/vignesh', type: 'text' },
                  { label: 'GitHub', name: 'github', placeholder: 'github.com/vignesh', type: 'text' },
                  { label: 'Portfolio', name: 'portfolio', placeholder: 'vignesh.dev', type: 'text' },
                ].map(field => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{field.label}</label>
                    <input 
                      type={field.type}
                      name={field.name}
                      value={resumeData.personal[field.name]}
                      onChange={handlePersonalChange}
                      placeholder={field.placeholder}
                      className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 font-bold"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-10">
                 <button 
                    onClick={handleSave} disabled={saving}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-3 font-bold transition-all disabled:opacity-50"
                 >
                    {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Information</>}
                 </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'objective' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-8 text-white">
                <div className="space-y-2">
                   <h1 className="text-4xl font-black tracking-tight">Professional Objective</h1>
                   <p className="text-slate-400 font-medium">A short summary of your career goals and what you bring to the table.</p>
                </div>
                <div className="p-8 bg-slate-800/40 border border-slate-700 rounded-3xl shadow-xl">
                   <textarea 
                      value={resumeData.objective}
                      onChange={(e) => setResumeData({...resumeData, objective: e.target.value})}
                      placeholder="e.g. Seeking a challenging position as a Lead Developer where I can leverage my 8+ years of experience in React and Node.js..."
                      className="w-full p-6 bg-slate-900 border border-slate-700 rounded-2xl h-64 focus:border-blue-500 outline-none transition-all font-medium text-lg"
                   />
                </div>
                <div className="flex justify-end">
                   <button 
                      onClick={handleSave} disabled={saving}
                      className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-3 font-bold transition-all disabled:opacity-50"
                   >
                      {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Objective</>}
                   </button>
                </div>
             </motion.div>
          )}

          {activeTab === 'experience' && (
             <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl space-y-8"
             >
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-6">
                   <div className="space-y-2 text-center lg:text-left">
                      <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Experience</h1>
                      <p className="text-slate-400 font-medium">Highlight your professional career journey.</p>
                   </div>
                   <button 
                      onClick={() => addArrayItem('experience')}
                      className="w-full lg:w-auto px-6 py-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"
                   >
                      <Plus className="w-5 h-5" /> Add Job
                   </button>
                </div>
                <div className="space-y-6">
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="p-6 lg:p-8 rounded-3xl bg-slate-800/30 border border-slate-700/50 relative group">
                       <button 
                          onClick={() => removeArrayItem(i, 'experience')}
                          className="absolute right-4 lg:right-6 top-4 lg:top-6 p-2 text-slate-500 hover:text-rose-500 transition-colors"
                       >
                          <Trash2 className="w-5 h-5" />
                       </button>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Job Title</label>
                            <input value={exp.jobTitle} onChange={(e) => handleArrayChange(i, 'jobTitle', e.target.value, 'experience')} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl" placeholder="Software Engineer" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Company</label>
                            <input value={exp.company} onChange={(e) => handleArrayChange(i, 'company', e.target.value, 'experience')} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl" placeholder="Tech Giants Inc" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
                            <input value={exp.startDate} onChange={(e) => handleArrayChange(i, 'startDate', e.target.value, 'experience')} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl" placeholder="Feb 2020" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">End Date</label>
                            <input value={exp.endDate} onChange={(e) => handleArrayChange(i, 'endDate', e.target.value, 'experience')} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl" placeholder="Present" />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                            <textarea value={exp.description} onChange={(e) => handleArrayChange(i, 'description', e.target.value, 'experience')} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl h-32" placeholder="List your key responsibilities and achievements..." />
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center pt-10">
                   <button 
                      onClick={handleSave} disabled={saving}
                      className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-blue-600/20"
                   >
                      {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Experience</>}
                   </button>
                </div>
             </motion.div>
          )}

          {activeTab === 'education' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-8">
                <div className="flex justify-between items-end">
                   <div className="space-y-2">
                      <h1 className="text-4xl font-black tracking-tight">Education</h1>
                      <p className="text-slate-400 font-medium">Your academic background and certifications.</p>
                   </div>
                   <button onClick={() => addArrayItem('education')} className="px-6 py-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all">
                      <Plus className="w-5 h-5" /> Add Education
                   </button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                   {resumeData.education.map((edu, i) => (
                      <div key={i} className="p-8 rounded-3xl bg-slate-800/30 border border-slate-700/50 relative flex gap-6">
                         <div className="flex-1 grid grid-cols-3 gap-6">
                            <div className="space-y-2 col-span-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Degree</label>
                               <input value={edu.degree} onChange={(e) => handleArrayChange(i, 'degree', e.target.value, 'education')} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl" placeholder="B.Tech. in Computer Science" list="degree-list" />
                                <datalist id="degree-list">
                                   <option value="B.E. Computer Science & Engineering" />
                                   <option value="B.Tech. in Computer Science" />
                                   <option value="B.Tech. in IT" />
                                   <option value="B.E. in Mechanical Engineering" />
                                   <option value="B.E. in ECE" />
                                   <option value="B.Sc. Mathematics" />
                                   <option value="B.Com. (General)" />
                                   <option value="B.A. Economics" />
                                   <option value="BCA" />
                                   <option value="B.B.A." />
                                   <option value="M.Tech. AI/ML" />
                                   <option value="M.Sc. Physics" />
                                   <option value="M.B.A. (Finance)" />
                                   <option value="MCA" />
                                   <option value="Ph.D." />
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-4 pb-2 pt-1">
                                   <div className="space-y-1">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Start Year</label>
                                      <select 
                                         value={edu.startYear} 
                                         onChange={(e) => handleArrayChange(i, 'startYear', e.target.value, 'education')}
                                         className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none transition-all cursor-pointer text-xs font-bold text-slate-300"
                                      >
                                         <option value="">Year</option>
                                         {years.map(y => <option key={y} value={y} className="bg-slate-900">{y}</option>)}
                                      </select>
                                   </div>
                                   <div className="space-y-1">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none flex items-center gap-1">Passed Out <Sparkles className="w-3 h-3 text-amber-500" /></label>
                                      <select 
                                         value={edu.endYear} 
                                         onChange={(e) => handleArrayChange(i, 'endYear', e.target.value, 'education')}
                                         className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-500 outline-none transition-all cursor-pointer text-xs font-bold text-slate-300"
                                      >
                                         <option value="">Year</option>
                                         <option value="Present" className="bg-slate-900 font-bold text-amber-400">Present</option>
                                         {years.map(y => <option key={y} value={y} className="bg-slate-900">{y}</option>)}
                                      </select>
                                   </div>
                                </div>
                            </div>
                            <div className="space-y-2 col-span-3">
                               <label className="text-xs font-bold text-slate-500 uppercase">School / University</label>
                               <input value={edu.school} onChange={(e) => handleArrayChange(i, 'school', e.target.value, 'education')} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl" placeholder="Anna University, Chennai" />
                            </div>
                         </div>
                         <button onClick={() => removeArrayItem(i, 'education')} className="p-3 text-slate-500 hover:text-rose-500 hover:bg-slate-700/50 rounded-xl max-h-fit transition-all mt-6">
                            <Trash2 className="w-6 h-6" />
                         </button>
                      </div>
                   ))}
                </div>
                <div className="flex justify-center pt-8">
                   <button 
                      onClick={handleSave} disabled={saving}
                      className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-indigo-600/20"
                   >
                      {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Education</>}
                   </button>
                </div>
             </motion.div>
          )}

          {activeTab === 'certifications' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl space-y-8">
                <div className="flex justify-between items-end">
                   <div className="space-y-2">
                       <h1 className="text-4xl font-black tracking-tight">Certifications</h1>
                       <p className="text-slate-400 font-medium">Add your professional certifications and honors.</p>
                   </div>
                   <button onClick={() => addArrayItem('certifications')} className="px-6 py-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                      <Plus className="w-5 h-5" /> Add Certification
                   </button>
                </div>
                <div className="space-y-6">
                   {resumeData.certifications.map((cert, i) => (
                      <div key={i} className="p-8 rounded-3xl bg-slate-800/30 border border-slate-700/50 flex gap-6 items-start">
                         <div className="grid grid-cols-3 gap-6 flex-1">
                            <div className="space-y-2 col-span-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Certification Name</label>
                               <input value={cert.name} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'certifications')} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl" placeholder="AWS Certified Solutions Architect" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Year</label>
                               <input value={cert.year} onChange={(e) => handleArrayChange(i, 'year', e.target.value, 'certifications')} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl" placeholder="2023" />
                            </div>
                            <div className="space-y-2 col-span-3">
                               <label className="text-xs font-bold text-slate-500 uppercase">Issuing Organization</label>
                               <input value={cert.issuer} onChange={(e) => handleArrayChange(i, 'issuer', e.target.value, 'certifications')} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl" placeholder="Amazon Web Services" />
                            </div>
                         </div>
                         <button onClick={() => removeArrayItem(i, 'certifications')} className="p-3 text-slate-500 hover:text-rose-500 hover:bg-slate-700/50 rounded-xl max-h-fit transition-all mt-6">
                            <Trash2 className="w-6 h-6" />
                         </button>
                      </div>
                   ))}
                </div>
                <div className="flex justify-center pt-8">
                   <button 
                      onClick={handleSave} disabled={saving}
                      className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-blue-600/20"
                   >
                      {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Certifications</>}
                   </button>
                </div>
             </motion.div>
          )}

          {activeTab === 'projects' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl space-y-8">
                <div className="flex justify-between items-end">
                   <div className="space-y-2">
                       <h1 className="text-4xl font-black tracking-tight">Projects</h1>
                       <p className="text-slate-400 font-medium">Showcase your best work and personal projects.</p>
                   </div>
                   <button onClick={() => addArrayItem('projects')} className="px-6 py-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                      <Plus className="w-5 h-5" /> Add Project
                   </button>
                </div>
                <div className="space-y-6">
                   {resumeData.projects.map((proj, i) => (
                      <div key={i} className="p-8 rounded-3xl bg-slate-800/30 border border-slate-700/50 flex flex-col gap-6 relative">
                         <button onClick={() => removeArrayItem(i, 'projects')} className="absolute right-6 top-6 p-2 text-slate-500 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-5 h-5" />
                         </button>
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Project Title</label>
                               <input value={proj.title} onChange={(e) => handleArrayChange(i, 'title', e.target.value, 'projects')} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl" placeholder="Portfolio Website" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Live Link / Repo</label>
                               <input value={proj.link} onChange={(e) => handleArrayChange(i, 'link', e.target.value, 'projects')} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl" placeholder="https://github.com/..." />
                            </div>
                            <div className="space-y-2 col-span-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                               <textarea value={proj.description} onChange={(e) => handleArrayChange(i, 'description', e.target.value, 'projects')} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl h-24" placeholder="Briefly describe what you built and the tools used." />
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="flex justify-center pt-10">
                   <button 
                      onClick={handleSave} disabled={saving}
                      className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-blue-600/20"
                   >
                      {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Projects</>}
                   </button>
                </div>
             </motion.div>
          )}

          {activeTab === 'achievements' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-8">
                <div className="space-y-2">
                   <h1 className="text-4xl font-black tracking-tight">Achievements</h1>
                   <p className="text-slate-400 font-medium">Highlight your awards, recognition, and significant milestones.</p>
                </div>
                <div className="flex gap-4 p-6 bg-slate-800/40 border border-slate-700 rounded-3xl shadow-xl">
                   <input 
                      value={newAchievement} 
                      onChange={(e) => setNewAchievement(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                      placeholder="e.g. Employee of the Month, Hackathon Winner..."
                      className="flex-1 p-4 bg-slate-900 border border-slate-700 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold" 
                   />
                   <button onClick={addAchievement} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all flex items-center gap-2">
                      <Plus className="w-5 h-5" /> Add
                   </button>
                </div>
                <div className="space-y-3">
                   {resumeData.achievements.map((item, i) => (
                      <motion.div 
                         initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                         key={i} 
                         className="flex items-center justify-between p-5 bg-slate-800 border border-slate-700 rounded-2xl hover:border-emerald-500/50 transition-all font-bold group"
                      >
                         <div className="flex items-center gap-4">
                            <Trophy className="w-5 h-5 text-amber-400" />
                            {item}
                         </div>
                         <button onClick={() => removeAchievement(item)} className="text-slate-500 hover:text-rose-400 transition-colors">
                            <Trash2 className="w-5 h-5" />
                         </button>
                      </motion.div>
                   ))}
                 </div>
                 <div className="flex justify-center pt-10">
                    <button 
                       onClick={handleSave} disabled={saving}
                       className="px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-emerald-600/20"
                    >
                       {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Achievements</>}
                    </button>
                 </div>
              </motion.div>
           )}

          {activeTab === 'skills' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-8">
                <div className="space-y-2">
                   <h1 className="text-4xl font-black tracking-tight">Skills</h1>
                   <p className="text-slate-400 font-medium">Add technical and soft skills that make you stand out.</p>
                </div>
                <div className="flex gap-4 p-6 bg-slate-800/40 border border-slate-700 rounded-3xl shadow-xl">
                   <input 
                      value={newSkill} 
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      placeholder="e.g. JavaScript, AWS, UI Design..."
                      className="flex-1 p-4 bg-slate-900 border border-slate-700 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold" 
                   />
                   <button onClick={addSkill} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all flex items-center gap-2">
                      <Plus className="w-5 h-5" /> Add
                   </button>
                </div>
                <div className="flex flex-wrap gap-3">
                   {resumeData.skills.map((skill, i) => (
                      <motion.div 
                         initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                         key={i} 
                         className="flex items-center gap-3 px-5 py-3 bg-slate-800 border border-slate-700 rounded-2xl group hover:border-blue-500/50 hover:bg-slate-700/50 transition-all font-bold"
                      >
                         {skill}
                         <button onClick={() => removeSkill(skill)} className="text-slate-500 group-hover:text-rose-400">
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </motion.div>
                   ))}
                 </div>
                 <div className="flex justify-center pt-10">
                    <button 
                       onClick={handleSave} disabled={saving}
                       className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-blue-600/20"
                    >
                       {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Skills</>}
                    </button>
                 </div>
              </motion.div>
           )}

          {activeTab === 'ats' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-10">
                <div className="space-y-4 text-center lg:text-left">
                   <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">AI <span className="text-blue-500">ATS Score</span> Checker</h1>
                   <p className="text-slate-400 text-lg font-medium tracking-tight">Upload your resume and let Gemini AI analyze your compatibility with any job role.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Left: Inputs */}
                   <div className="space-y-6">
                      <div className="p-8 bg-slate-800/40 border border-white/5 rounded-[2rem] backdrop-blur-xl shadow-2xl">
                         <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4">1. Job Description (Optional)</label>
                         <textarea 
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here for better results..."
                            className="w-full p-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl h-48 focus:border-blue-500 outline-none transition-all font-medium text-slate-300 resize-none"
                         />
                      </div>

                      <div className="p-8 bg-slate-800/40 border border-white/5 rounded-[2rem] backdrop-blur-xl shadow-2xl relative group overflow-hidden">
                         <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4">2. Upload Resume PDF</label>
                         <div className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all ${atsFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700/50 hover:border-blue-500/50 hover:bg-white/5'}`}>
                            <input 
                               type="file" 
                               accept=".pdf"
                               onChange={(e) => setAtsFile(e.target.files[0])}
                               className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {atsFile ? (
                               <div className="text-center">
                                  <div className="bg-emerald-500/20 p-4 rounded-full mb-4 mx-auto w-fit">
                                     <FileSearch className="w-8 h-8 text-emerald-400" />
                                  </div>
                                  <p className="text-white font-bold mb-1">{atsFile.name}</p>
                                  <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Click to Change File</p>
                               </div>
                            ) : (
                               <div className="text-center">
                                  <div className="bg-slate-700/30 p-4 rounded-full mb-4 mx-auto w-fit">
                                     <Upload className="w-8 h-8 text-slate-400" />
                                  </div>
                                  <p className="text-white font-bold mb-1">Select Resume PDF</p>
                                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">A4 Format Recommended</p>
                               </div>
                            )}
                         </div>
                      </div>

                      <button 
                         onClick={handleAtsCheck}
                         disabled={atsLoading || !atsFile}
                         className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/20 ${atsLoading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white transform hover:-translate-y-1 active:scale-95'}`}
                      >
                         {atsLoading ? (
                            <>
                               <Activity className="w-6 h-6 animate-spin" />
                               Analyzing...
                            </>
                         ) : (
                            <>
                               <Sparkles className="w-6 h-6" />
                               Generate Score
                            </>
                         )}
                      </button>
                   </div>

                   {/* Right: Results */}
                   <div className="relative">
                      <AnimatePresence mode="wait">
                         {atsData ? (
                            <motion.div 
                               key="res" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                               className="p-8 bg-slate-800/40 border border-white/10 rounded-[2rem] backdrop-blur-xl shadow-2xl space-y-8 h-full"
                            >
                               <div className="flex items-center gap-6">
                                  <div className="relative w-24 h-24">
                                     <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700" />
                                        <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={264} strokeDashoffset={264 - (264 * atsData.score / 100)} className={`${atsData.score > 80 ? 'text-emerald-500' : atsData.score > 50 ? 'text-amber-500' : 'text-rose-500'} transition-all duration-1000 shadow-xl`} strokeLinecap="round" />
                                     </svg>
                                     <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white">{atsData.score}%</div>
                                  </div>
                                  <div>
                                     <h3 className="text-2xl font-black text-white">ATS Compatibility</h3>
                                     <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{atsData.score > 80 ? 'Excellent Match' : 'Needs Optimization'}</p>
                                  </div>
                               </div>

                               <div className="space-y-3">
                                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                     <Activity className="w-4 h-4 text-blue-400" /> AI Executive Summary
                                  </h4>
                                  <p className="text-slate-300 font-medium leading-relaxed italic border-l-4 border-blue-500/30 pl-4 bg-slate-900/40 py-4 rounded-r-2xl text-sm leading-snug">{atsData.summary}</p>
                               </div>

                               <div className="space-y-4">
                                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                     <BarChart className="w-4 h-4 text-emerald-400" /> Key Mistakes & Improvements
                                  </h4>
                                  <div className="space-y-2">
                                     {atsData.suggestions?.map((s, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all">
                                           <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                                           <span className="text-slate-300 font-bold text-sm tracking-tight leading-snug">{s}</span>
                                        </div>
                                     ))}
                                  </div>
                               </div>

                               <div className="space-y-4">
                                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                     <Code className="w-4 h-4 text-rose-400" /> Missing Keywords
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                     {atsData.missingKeywords?.map((k, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-rose-500/10 text-rose-300 rounded-lg text-[10px] font-black border border-rose-500/20 uppercase tracking-tighter">{k}</span>
                                     ))}
                                  </div>
                               </div>
                            </motion.div>
                         ) : (
                            <motion.div 
                               key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                               className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-slate-800/20 border-2 border-dashed border-slate-700/50 rounded-[2rem] text-center"
                            >
                               <div className="bg-slate-800/50 p-6 rounded-full mb-6">
                                  <BarChart className="w-12 h-12 text-slate-500" />
                               </div>
                               <h3 className="text-xl font-bold text-slate-300 mb-2">Analysis Results Area</h3>
                               <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium">Your detailed AI report will appear here after you generate your score.</p>
                            </motion.div>
                         )}
                      </AnimatePresence>
                   </div>
                </div>
             </motion.div>
          )}

          {activeTab === 'preview' && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
               className="space-y-12"
            >
               <div className="space-y-2 text-center lg:text-left">
                  <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Select a Template</h1>
                  <p className="text-slate-400 font-medium">Choose from our 5 high-performance ATS-optimized styles.</p>
               </div>
               
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-10">
                  {[
                    { id: 'resume-elegant', name: 'Template 1', component: <ElegantTemplate data={resumeData} />, color: 'slate' },
                    { id: 'resume-modern', name: 'Template 2', component: <ModernTemplate data={resumeData} />, color: 'blue' },
                    { id: 'resume-minimal', name: 'Template 3', component: <MinimalTemplate data={resumeData} />, color: 'zinc' },
                    { id: 'resume-tech', name: 'Template 4', component: <TechTemplate data={resumeData} />, color: 'green' },
                    { id: 'resume-corporate', name: 'Template 5', component: <CorporateTemplate data={resumeData} />, color: 'indigo' },
                  ].map((temp, i) => (
                    <div key={temp.id} className="space-y-4">
                       <div className="flex justify-between items-center bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
                          <div>
                             <h3 className="text-xl font-bold">{temp.name}</h3>
                          </div>
                          <div className="flex gap-3">
                             <button 
                                onClick={() => setActiveTemplate(temp.id)}
                                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold flex items-center gap-2 transition-all"
                             >
                                <Eye className="w-4 h-4" /> View
                             </button>
                             <button 
                                onClick={() => downloadPDF(temp.id)}
                                disabled={saving}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                             >
                                <Download className="w-4 h-4" /> {saving ? 'Generating...' : 'Download'}
                             </button>
                          </div>
                       </div>
                                 <div 
                          className="relative h-[600px] overflow-hidden rounded-3xl border border-slate-700/50 shadow-2xl flex justify-center bg-slate-900/40 group cursor-zoom-in"
                          onClick={() => setActiveTemplate(temp.id)}
                       >
                          <div className="transform scale-[0.6] origin-top w-full flex justify-center transition-all duration-500 group-hover:scale-[0.65]">
                             {temp.component}
                          </div>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-8 flex items-end justify-center pointer-events-none">
                             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-white shadow-xl">ATS Suitable Score: 98%</div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               {/* Full Screen View Modal Simulation */}
               {activeTemplate && (
                 <div className="fixed inset-0 z-[100] flex items-center justify-center p-12 bg-slate-900/90 backdrop-blur-md overflow-hidden">
                    <button 
                       onClick={() => setActiveTemplate(null)}
                       className="absolute top-10 right-10 p-4 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 text-white z-50"
                    >
                       <Plus className="w-8 h-8 rotate-45" />
                    </button>
                    <div className="w-full h-full overflow-y-auto pt-10 pb-20 no-scrollbar">
                       <div className="max-w-fit mx-auto transform ">
                          {activeTemplate === 'resume-elegant' && <ElegantTemplate data={resumeData} />}
                          {activeTemplate === 'resume-modern' && <ModernTemplate data={resumeData} />}
                          {activeTemplate === 'resume-minimal' && <MinimalTemplate data={resumeData} />}
                          {activeTemplate === 'resume-tech' && <TechTemplate data={resumeData} />}
                          {activeTemplate === 'resume-corporate' && <CorporateTemplate data={resumeData} />}
                       </div>
                    </div>
                 </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Home;
