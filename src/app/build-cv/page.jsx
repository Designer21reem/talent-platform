'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileEdit, ChevronLeft, ChevronRight, CheckCircle2, Download } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { HeroBackground } from '@/components/layout/HeroBackground';
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
import { ConsentCheckboxes, EMPTY_CONSENT } from '@/components/upload/ConsentCheckboxes';
import { saveCV } from '@/lib/storage';
import { mapCVToExtractedData } from '@/lib/cvMapper';
import { isValidPhoneForCountry } from '@/lib/formOptions';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { requestUploadUrl, uploadToS3 } from '@/lib/api';

const STEPS = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Education & Certifications' },
  { id: 3, label: 'Experience & Projects' },
  { id: 4, label: 'Skills & Languages' },
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
    if (!isValidPhoneForCountry(phone)) return 'Please enter a valid phone number.';
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
  const { t } = useLanguage();
  const { token } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [cv, setCv] = useState(EMPTY_CV);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(EMPTY_CONSENT);
  const canSubmit = consent.acceptTerms;


  function updatePersonalInfo(data) {
    setCv((prev) => ({ ...prev, personalInfo: data }));
  }

  function goNext() {
    const validationError = validateStep(currentStep, cv);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  }

  function goBack() {
    setError(null);
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  const [downloading, setDownloading] = useState(false);

  async function downloadAsPDF() {
    const element = document.getElementById('cv-print-content');
    if (!element) return;

    setDownloading(true);

    try {
      const { toPng } = await import('html-to-image');
      const jsPDF = (await import('jspdf')).default;

      const dataUrl = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        // The CV preview only uses generic system fonts (font-serif), so no
        // webfont embedding is needed — and skipping it avoids html-to-image
        // choking on cross-origin stylesheets injected elsewhere on the page
        // (e.g. Google Sign-In's), which throw CORS errors when it tries to
        // read their cssRules.
        skipFonts: true,
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeightMm = (img.naturalHeight / img.naturalWidth) * pageWidth;

      // Sub-pixel rounding from the capture can push imgHeightMm a fraction
      // of a mm past one page — ignore overflow under this tolerance so a
      // one-page CV never spills a near-blank trailing page.
      const OVERFLOW_TOLERANCE_MM = 3;
      const pageCount = Math.max(1, Math.ceil((imgHeightMm - OVERFLOW_TOLERANCE_MM) / pageHeight));

      for (let i = 0; i < pageCount; i++) {
        if (i > 0) pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, -(i * pageHeight), pageWidth, imgHeightMm);
      }

      const fileName = cv.personalInfo.fullName
        ? `${cv.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`
        : 'CV.pdf';
      pdf.save(fileName);
    } catch {
    } finally {
      setDownloading(false);
    }
  }

  async function handleSubmit() {
    const validationError = validateStep(currentStep, cv);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!canSubmit) return;

    if (!token) {
      setError(t('You must be signed in with Google to save your CV.'));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const fileName = 'cv_builder.json';
      const extractedData = mapCVToExtractedData(cv, consent);
      const jsonBody = JSON.stringify(extractedData);
      const urlData = await requestUploadUrl(token, {
        fileName,
        fileType: 'application/json',
        fileSize: new Blob([jsonBody]).size,
        frontendSelection: 'cv_builder_json',
      });

      // Every JSON upload must carry the user_id/email the backend resolved
      // for this presigned URL, so it can be matched to the candidate once
      // it's picked up from the S3 data lake.
      const payload = { ...extractedData, user_id: urlData.user_id, email: urlData.user_email };
      await uploadToS3(urlData.upload_url, JSON.stringify(payload), 'application/json', urlData);

      saveCV({ ...cv, consent });
      setSubmitted(true);
    } catch (err) {
      console.error('[CV Builder] Submission failed:', err);
      setError(err.message || t('Something went wrong saving your CV. Please try again.'));
    } finally {
      setSubmitting(false);
    }
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
              <p className="font-semibold text-emerald-800">{t('CV saved successfully!')}</p>
              <p className="text-emerald-600 text-sm mt-0.5">
                {t('Your CV data has been saved. You can now take the assessment or come back later.')}
              </p>
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">{t('Your CV Preview')}</h2>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                leftIcon={<Download size={15} />}
                onClick={downloadAsPDF}
                disabled={downloading}
              >
                {downloading ? t('Generating…') : t('Download PDF')}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setSubmitted(false); setCurrentStep(1); }}
              >
                {t('Edit CV')}
              </Button>
            </div>
          </div>

          <CVPreview data={cv} id="cv-print-content" />
        </Container>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <section className="relative bg-dark pt-12 pb-14 sm:pt-14 sm:pb-16 overflow-hidden">
        <HeroBackground variant="waves" />
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand mb-4">
              <FileEdit size={26} className="text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{t('CV Builder')}</h1>
            <p className="text-silver text-lg">{t("Fill in each section and we'll generate a professional CV.")}</p>
          </motion.div>
        </Container>
      </section>

      <div className="py-10 sm:py-12">
      <Container maxWidth="xl">
        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator steps={STEPS.map((s) => ({ ...s, label: t(s.label) }))} currentStep={currentStep} />
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
                    <div className="space-y-8">
                      <EducationStep data={cv.education} onChange={(d) => setCv((p) => ({ ...p, education: d }))} />
                      <div className="border-t border-surface-2 pt-8">
                        <CertificationsStep data={cv.certifications} onChange={(d) => setCv((p) => ({ ...p, certifications: d }))} />
                      </div>
                    </div>
                  )}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <WorkExperienceStep data={cv.workExperience} onChange={(d) => setCv((p) => ({ ...p, workExperience: d }))} />
                      <div className="border-t border-surface-2 pt-8">
                        <ProjectsStep data={cv.projects} onChange={(d) => setCv((p) => ({ ...p, projects: d }))} />
                      </div>
                    </div>
                  )}
                  {currentStep === 4 && (
                    <div className="space-y-8">
                      <SkillsStep data={cv.skills} onChange={(d) => setCv((p) => ({ ...p, skills: d }))} />
                      <div className="border-t border-surface-2 pt-8">
                        <LanguagesStep data={cv.languages} onChange={(d) => setCv((p) => ({ ...p, languages: d }))} />
                      </div>
                      <div className="border-t border-surface-2 pt-8">
                        <ConsentCheckboxes value={consent} onChange={setConsent} />
                      </div>
                    </div>
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
                  {t(error)}
                </motion.p>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-surface-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  disabled={currentStep === 1}
                  leftIcon={<ChevronLeft size={16} className="rtl:-scale-x-100" />}
                >
                  {t('Back')}
                </Button>

                <div className="text-xs text-silver">
                  {t('Step')} {currentStep} {t('of')} {STEPS.length}
                </div>

                {currentStep < STEPS.length ? (
                  <Button size="sm" onClick={goNext} rightIcon={<ChevronRight size={16} className="rtl:-scale-x-100" />}>
                    {t('Continue')}
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSubmit} disabled={!canSubmit || submitting} rightIcon={<CheckCircle2 size={16} />}>
                    {submitting ? t('Saving…') : t('Save CV')}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Live preview panel — always visible so changes are reflected immediately */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-sm font-medium text-warm mb-3">{t('Live Preview')}</p>
              <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-surface-2 shadow-sm">
                <CVPreview data={cv} />
              </div>
            </div>
          </div>
        </div>
      </Container>
      </div>
    </div>
  );
}
