// Converts the CV Builder's internal state shape into the CVExtractedData
// JSON contract the backend expects. Fields the builder doesn't collect
// (gender, birth_date, professional_summary, awards, …) are simply omitted —
// they're all Optional on the backend model, so FastAPI defaults them.
// `consent` travels in this same payload/endpoint rather than separately.
export function mapCVToExtractedData(cv, consent) {
  const { personalInfo, education, workExperience, skills, languages, certifications, projects } = cv;

  const [governoreate, country] = (personalInfo.location || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const currentJob = workExperience.find((w) => w.current) || workExperience[0] || null;

  return {
    personal_info: {
      full_name: personalInfo.fullName || null,
      email: personalInfo.email || null,
      phone: personalInfo.phone || null,
      country: country || null,
      governoreate: governoreate || null,
    },
    current_job_title: currentJob?.position || null,
    current_company: currentJob?.company || null,
    skills: skills.map((s) => s.name),
    work_experience: workExperience.map((w) => ({
      company_name: w.company || null,
      job_title: w.position || null,
      start_date: w.startDate || null,
      end_date: w.current ? null : w.endDate || null,
      is_current: !!w.current,
      responsibilities: (w.description || '').split('\n').map((l) => l.trim()).filter(Boolean),
      achievements: [],
      technologies: [],
    })),
    education: education.map((e) => ({
      institution_name: e.institution || null,
      degree: e.degree || null,
      field_of_study: e.field || null,
      start_date: e.startYear || null,
      end_date: e.endYear || null,
    })),
    certifications: certifications.map((c) => ({
      name: c.name || null,
      issuer: c.issuer || null,
      issue_date: c.year || null,
      expiry_date: c.expiryYear || null,
    })),
    projects: projects.map((p) => ({
      name: p.name || null,
      description: p.description || null,
      technologies: p.technologies || [],
      url: p.url || null,
    })),
    languages: languages.map((l) => ({
      language: l.name || null,
      proficiency: l.proficiency || null,
    })),
    consent: {
      accept_terms: !!consent?.acceptTerms,
      show_to_recruiter: !!consent?.showToRecruiter,
    },
  };
}
