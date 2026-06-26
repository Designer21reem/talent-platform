'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileEdit, ChevronLeft, ChevronRight, CheckCircle2, Eye, EyeOff, Download } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from '@/components/cv-builder/StepIndicator';
import { PersonalInfoStep } from '@/components/cv-builder/PersonalInfoStep';
import { EducationStep } from '@/components/cv-builder/EducationStep';
import { WorkExperienceStep } from '@/components/cv-builder/WorkExperienceStep';
import { SkillsStep } from '@/components/cv-builder/SkillsStep';
import { LanguagesStep } from '@/components/cv-builder/LanguagesStep';
import { CertificationsStep } from '@/components/cv-builder/CertificationsStep';
import { ProjectsStep } from '@/components/cv-builder/ProjectsStep';
import { CVPreview } from '@/components/cv-builder/CVPreview';
import { saveCV } from '@/lib/storage';

const STEPS = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Education' },
  { id: 3, label: 'Experience' },
  { id: 4, label: 'Skills' },
  { id: 5, label: 'Languages' },
  { id: 6, label: 'Certifications' },
  { id: 7, label: 'Projects' },
];

const EMPTY_CV = {
  personalInfo: { fullName: '', email: '', phone: '', location: '' },
  education: [],
  workExperience: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
};

function validateStep(step, cv) {
  if (step === 1) {
    const { fullName, email, phone } = cv.personalInfo;
    if (!fullName.trim()) return 'Full name is required.';
    if (!email.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address.';
    if (!phone.trim()) return 'Phone number is required.';
    if (!/^\+?[\d\s\-().]{7,}$/.test(phone.trim())) return 'Please enter a valid phone number.';
  }
  if (step === 2) {
    for (const entry of cv.education) {
      if (!entry.institution.trim()) return 'Institution name is required for each education entry.';
      if (!entry.degree.trim()) return 'Degree is required for each education entry.';
    }
  }
  if (step === 3) {
    for (const entry of cv.workExperience) {
      if (!entry.company.trim()) return 'Company name is required for each experience entry.';
      if (!entry.position.trim()) return 'Position / Title is required for each experience entry.';
    }
  }
  return null;
}

export default function BuildCVPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cv, setCv] = useState(EMPTY_CV);
  const [submitted, setSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);

  console.log('[BuildCVPage] Rendered — step:', currentStep, 'submitted:', submitted);

  function updatePersonalInfo(data) {
    setCv((prev) => ({ ...prev, personalInfo: data }));
  }

  function goNext() {
    const validationError = validateStep(currentStep, cv);
    if (validationError) {
      console.warn('[BuildCVPage] Validation error on step', currentStep, ':', validationError);
      setError(validationError);
      return;
    }
    setError(null);
    console.log('[BuildCVPage] Going to step', currentStep + 1);
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  }

  function goBack() {
    setError(null);
    console.log('[BuildCVPage] Going back to step', currentStep - 1);
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  const [downloading, setDownloading] = useState(false);

  async function downloadAsPDF() {
    const element = document.getElementById('cv-print-content');
    if (!element) return;

    console.log('[BuildCVPage] Generating PDF for:', cv.personalInfo.fullName);
    setDownloading(true);

    try {
      const { toPng } = await import('html-to-image');
      const jsPDF = (await import('jspdf')).default;

      const dataUrl = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeightMm = (img.naturalHeight / img.naturalWidth) * pageWidth;

      let yOffset = 0;
      while (yOffset < imgHeightMm) {
        pdf.addImage(dataUrl, 'PNG', 0, -yOffset, pageWidth, imgHeightMm);
        yOffset += pageHeight;
        if (yOffset < imgHeightMm) pdf.addPage();
      }

      const fileName = cv.personalInfo.fullName
        ? `${cv.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`
        : 'CV.pdf';
      pdf.save(fileName);
      console.log('[BuildCVPage] PDF saved as:', fileName);
    } catch (err) {
      console.error('[BuildCVPage] PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  }

  function handleSubmit() {
    const validationError = validateStep(currentStep, cv);
    if (validationError) {
      setError(validationError);
      return;
    }
    console.log('[BuildCVPage] Submitting CV:', cv);
    saveCV(cv);
    setSubmitted(true);
    setShowPreview(true);
  }

  if (submitted) {
    return (
      <div className="py-12 sm:py-20">
        <Container maxWidth="xl">
          {/* Success banner */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-start gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-5"
          >
            <CheckCircle2 size={24} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-800">CV saved successfully!</p>
              <p className="text-emerald-600 text-sm mt-0.5">
                Your CV data has been saved. You can now take the assessment or come back later.
              </p>
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">Your CV Preview</h2>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                leftIcon={<Download size={15} />}
                onClick={downloadAsPDF}
                disabled={downloading}
              >
                {downloading ? 'Generating…' : 'Download PDF'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setSubmitted(false); setCurrentStep(1); }}
              >
                Edit CV
              </Button>
            </div>
          </div>

          <div id="cv-print-content">
            <CVPreview data={cv} />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <Container maxWidth="xl">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand mb-4">
            <FileEdit size={26} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Build Your CV</h1>
          <p className="text-silver text-lg">Fill in each section and we'll generate a professional CV.</p>
        </motion.div>

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form panel */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-2xl border border-surface-2 shadow-sm p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 1 && (
                    <PersonalInfoStep data={cv.personalInfo} onChange={updatePersonalInfo} />
                  )}
                  {currentStep === 2 && (
                    <EducationStep data={cv.education} onChange={(d) => setCv((p) => ({ ...p, education: d }))} />
                  )}
                  {currentStep === 3 && (
                    <WorkExperienceStep data={cv.workExperience} onChange={(d) => setCv((p) => ({ ...p, workExperience: d }))} />
                  )}
                  {currentStep === 4 && (
                    <SkillsStep data={cv.skills} onChange={(d) => setCv((p) => ({ ...p, skills: d }))} />
                  )}
                  {currentStep === 5 && (
                    <LanguagesStep data={cv.languages} onChange={(d) => setCv((p) => ({ ...p, languages: d }))} />
                  )}
                  {currentStep === 6 && (
                    <CertificationsStep data={cv.certifications} onChange={(d) => setCv((p) => ({ ...p, certifications: d }))} />
                  )}
                  {currentStep === 7 && (
                    <ProjectsStep data={cv.projects} onChange={(d) => setCv((p) => ({ ...p, projects: d }))} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Validation error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5"
                >
                  {error}
                </motion.p>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-surface-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  disabled={currentStep === 1}
                  leftIcon={<ChevronLeft size={16} />}
                >
                  Back
                </Button>

                <div className="text-xs text-silver">
                  Step {currentStep} of {STEPS.length}
                </div>

                {currentStep < STEPS.length ? (
                  <Button size="sm" onClick={goNext} rightIcon={<ChevronRight size={16} />}>
                    Continue
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSubmit} rightIcon={<CheckCircle2 size={16} />}>
                    Save CV
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Live preview panel */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-warm">Live Preview</p>
                <button
                  onClick={() => setShowPreview((v) => !v)}
                  className="flex items-center gap-1.5 text-xs text-silver hover:text-warm transition-colors"
                >
                  {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                  {showPreview ? 'Hide' : 'Show'}
                </button>
              </div>
              {showPreview ? (
                <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-surface-2 shadow-sm">
                  <CVPreview data={cv} />
                </div>
              ) : (
                <div
                  className="rounded-2xl border-2 border-dashed border-surface-2 p-8 text-center text-silver text-sm cursor-pointer hover:border-brand hover:text-brand transition-colors"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye size={24} className="mx-auto mb-2 opacity-50" />
                  Click to see your CV preview
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
