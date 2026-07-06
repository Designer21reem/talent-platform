'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Upload, CheckCircle2, FileEdit, ArrowRight, RotateCcw,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { FileUploader } from '@/components/upload/FileUploader';
import { ConsentCheckboxes, EMPTY_CONSENT } from '@/components/upload/ConsentCheckboxes';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Turnstile } from '@/components/ui/Turnstile';
import { saveCV } from '@/lib/storage';
import { parseFile } from '@/lib/cvParser';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';

const EMPTY_INFO = { fullName: '', email: '', phone: '', location: '' };

export default function UploadCVPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [pageState, setPageState] = useState('upload');
  const [parsedInfo, setParsedInfo] = useState(EMPTY_INFO);
  const [consent, setConsent] = useState(EMPTY_CONSENT);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleFile(file) {
    setPageState('parsing');
    try {
      // Extraction happens invisibly to the candidate now — the backend
      // process (triggered on submit below) owns turning this into a
      // profile. We still run the local parse so we have something to
      // hand off, but no longer show it for manual correction.
      const info = await parseFile(file);
      setParsedInfo(info);
    } catch {
      setParsedInfo(EMPTY_INFO);
    } finally {
      setPageState('uploaded');
    }
  }

  function handleSubmit() {
    setSubmitting(true);
    // TODO(backend): POST the uploaded file + consent flags here and let
    // the backend trigger CV data extraction; this local save is a stand-in
    // until that endpoint exists.
    saveCV({
      personalInfo: parsedInfo,
      consent,
      education: [],
      workExperience: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: [],
    });
    router.push('/assessment');
  }

  function reset() {
    setPageState('upload');
    setParsedInfo(EMPTY_INFO);
    setConsent(EMPTY_CONSENT);
    setTurnstileToken(null);
    setSubmitting(false);
  }

  const canSubmit = consent.acceptTerms && !!turnstileToken && !submitting;

  return (
    <div className="py-12 sm:py-20">
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand mb-5">
            <Upload size={26} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-warm-light mb-3">{t('Upload Your CV')}</h1>
          <p className="text-silver text-lg max-w-lg mx-auto">
            {t("Upload your CV and we'll take care of the rest.")}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Upload */}
          {pageState === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FileUploader onFile={handleFile} />
            </motion.div>
          )}

          {/* Parsing spinner */}
          {pageState === 'parsing' && (
            <motion.div
              key="parsing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-20"
            >
              <div className="w-14 h-14 border-4 border-brand border-t-transparent rounded-full animate-spin" />
              <p className="text-warm font-medium">{t('Uploading your CV…')}</p>
            </motion.div>
          )}

          {/* Uploaded — consent, verification, and the go-to-assessment CTA */}
          {pageState === 'uploaded' && (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto"
            >
              <Card padding="lg">
                <div className="flex items-start gap-3 mb-6 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-700">
                    {t("Your CV has been uploaded! We're extracting your information in the background.")}
                  </p>
                </div>

                <ConsentCheckboxes value={consent} onChange={setConsent} />

                <div className="my-6">
                  <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />
                </div>

                <p className="text-xs text-silver mb-4 leading-relaxed">
                  {t('Completing the assessment increases your opportunities to receive job offers and improves your visibility on the platform’s leaderboard.')}
                </p>

                <Button
                  fullWidth
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  rightIcon={<ArrowRight size={16} />}
                >
                  {submitting ? t('Processing…') : t('Upload & Go to Assessment')}
                </Button>

                <div className="flex gap-3 mt-3">
                  <Link href="/build-cv" className="flex-1">
                    <Button variant="secondary" fullWidth leftIcon={<FileEdit size={15} />}>
                      {t('Try CV Builder')}
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={reset} leftIcon={<RotateCcw size={15} />}>
                    {t('Re-upload')}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
