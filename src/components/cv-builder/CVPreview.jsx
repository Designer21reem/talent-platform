'use client';

import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, GraduationCap, Briefcase,
  Wrench, Languages, Award, FolderGit2, ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

function Section({ title, icon: Icon, children }) {
  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
        <Icon size={16} className="text-brand" />
        <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export function CVPreview({ data }) {
  const { personalInfo, education, workExperience, skills, languages, certifications, projects } = data;

  console.log('[CVPreview] Rendering CV preview for:', personalInfo.fullName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-linear-to-r from-dark to-surface-2 text-white p-8">
        <h1 className="text-3xl font-bold mb-1">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-brand/80 text-sm">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail size={13} /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone size={13} /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} /> {personalInfo.location}
            </span>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Education */}
        {education.length > 0 && (
          <Section title="Education" icon={GraduationCap}>
            <div className="space-y-3">
              {education.map((e) => (
                <div key={e.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-800">{e.degree} {e.field && `in ${e.field}`}</p>
                      <p className="text-slate-500 text-sm">{e.institution}</p>
                    </div>
                    {(e.startYear || e.endYear) && (
                      <span className="text-xs text-slate-400 shrink-0 ml-4">
                        {e.startYear} {e.endYear && `– ${e.endYear}`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <Section title="Work Experience" icon={Briefcase}>
            <div className="space-y-4">
              {workExperience.map((w) => (
                <div key={w.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-800">{w.position}</p>
                      <p className="text-slate-500 text-sm">{w.company}</p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 ml-4">
                      {w.startDate} – {w.current ? 'Present' : w.endDate}
                    </span>
                  </div>
                  {w.description && (
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{w.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Section title="Skills" icon={Wrench}>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium border border-brand/20"
                >
                  {s.name}
                  <span className="ml-1.5 text-brand/70 text-xs">· {s.level}</span>
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <Section title="Languages" icon={Languages}>
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <span
                  key={l.id}
                  className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-medium border border-brand/20"
                >
                  {l.name} · {l.proficiency}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Section title="Certifications" icon={Award}>
            <div className="space-y-2">
              {certifications.map((c) => (
                <div key={c.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{c.name}</p>
                    <p className="text-slate-400 text-xs">{c.issuer}</p>
                  </div>
                  {c.year && <span className="text-xs text-slate-400">{c.year}</span>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Projects" icon={FolderGit2}>
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-800 text-sm">{p.name}</p>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand hover:text-brand shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                  {p.technologies && (
                    <p className="text-xs text-slate-400 mb-1">{p.technologies}</p>
                  )}
                  {p.description && (
                    <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </motion.div>
  );
}
