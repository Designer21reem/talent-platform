'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

function Section({ title, children }) {
  return (
    <section className="mb-4">
      <h2 className="text-[15px] font-bold text-black border-b border-black pb-0.5 mb-2">{title}</h2>
      {children}
    </section>
  );
}

function yearOf(dateStr) {
  if (!dateStr) return '';
  return dateStr.includes('-') ? dateStr.split('-')[0] : dateStr;
}

function Bullets({ text }) {
  const lines = (text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;
  return (
    <ul className="list-disc ps-5 mt-1 space-y-0.5">
      {lines.map((line, i) => (
        <li key={i} className="text-[12.5px] leading-snug text-black">{line}</li>
      ))}
    </ul>
  );
}

export function CVPreview({ data }) {
  const { t } = useLanguage();
  const { personalInfo, education, workExperience, skills, languages, certifications, projects } = data;


  const skillsLine = skills.map((s) => `${s.name} (${s.level})`).join(', ');
  const languagesLine = languages.map((l) => `${l.name} (${l.proficiency})`).join(', ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-black p-8 sm:p-10 font-serif text-black"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1
          className="text-3xl font-bold tracking-wide uppercase"
          style={{ fontVariant: 'small-caps' }}
        >
          {personalInfo.fullName || t('Your Name')}
        </h1>
        {personalInfo.location && (
          <p className="text-sm mt-1">{personalInfo.location}</p>
        )}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-[13px]">
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone size={12} /> <span dir="ltr">{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail size={12} /> {personalInfo.email}
            </span>
          )}
        </div>
      </div>

      {/* Education (+ Certifications) */}
      {(education.length > 0 || certifications.length > 0) && (
        <Section title={t('Education')}>
          <div className="space-y-3">
            {education.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between items-baseline gap-4">
                  <p className="font-bold text-[13.5px]">{e.institution}</p>
                  {(e.startYear || e.endYear) && (
                    <p className="font-bold text-[13px] shrink-0">
                      {yearOf(e.startYear)} {e.endYear && `– ${yearOf(e.endYear)}`}
                    </p>
                  )}
                </div>
                {(e.degree || e.field) && (
                  <p className="italic text-[13px]">
                    {e.degree}{e.field && ` in ${e.field}`}
                  </p>
                )}
              </div>
            ))}

            {certifications.length > 0 && (
              <div className={education.length > 0 ? 'pt-2' : ''}>
                <p className="font-bold text-[13px] mb-1">{t('Certifications')}</p>
                <ul className="ps-5 list-disc space-y-0.5">
                  {certifications.map((c) => (
                    <li key={c.id} className="text-[12.5px] leading-snug flex justify-between gap-4">
                      <span>
                        {c.name}{c.issuer && ` — ${c.issuer}`}
                      </span>
                      {c.year && <span className="shrink-0">{c.year}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Experience (+ Projects) */}
      {(workExperience.length > 0 || projects.length > 0) && (
        <Section title={t('Experience')}>
          <div className="space-y-4">
            {workExperience.map((w) => (
              <div key={w.id}>
                <div className="flex justify-between items-baseline gap-4">
                  <p className="font-bold text-[13.5px]">{w.company}</p>
                  <p className="font-bold text-[13px] shrink-0">
                    {w.startDate} – {w.current ? t('Present') : w.endDate}
                  </p>
                </div>
                {w.position && <p className="italic text-[13px]">{w.position}</p>}
                <Bullets text={w.description} />
              </div>
            ))}

            {projects.length > 0 && (
              <div className={workExperience.length > 0 ? 'pt-2' : ''}>
                {workExperience.length > 0 && (
                  <p className="font-bold text-[13px] mb-1">{t('Projects')}</p>
                )}
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div key={p.id}>
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="font-bold text-[13.5px]">
                          {p.name}
                          {p.technologies && (
                            <span className="italic font-normal text-[12.5px]"> | {p.technologies}</span>
                          )}
                        </p>
                        {p.url && (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      <Bullets text={p.description} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Technical Skills (+ Languages) */}
      {(skillsLine || languagesLine) && (
        <Section title={t('Technical Skills')}>
          <div className="space-y-1 text-[13px]">
            {skillsLine && (
              <p><span className="font-bold">{t('Skills')}</span>: {skillsLine}</p>
            )}
            {languagesLine && (
              <p><span className="font-bold">{t('Languages')}</span>: {languagesLine}</p>
            )}
          </div>
        </Section>
      )}

      {/* Platform watermark */}
      <div className="flex justify-end items-center gap-1.5 mt-6 pt-2 border-t border-slate-200">
        <img src="/Logo (1).png" alt="" className="h-3 w-auto object-contain opacity-80" />
        <span className="font-sans text-[8px] tracking-wide text-brand-dark font-semibold">
          {t('Generated By THE VALUE')}
        </span>
      </div>
    </motion.div>
  );
}
