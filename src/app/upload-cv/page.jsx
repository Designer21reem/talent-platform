'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Upload, CheckCircle2, FileEdit, ArrowRight, RotateCcw,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { HeroBackground } from '@/components/layout/HeroBackground';
import { FileUploader } from '@/components/upload/FileUploader';
import { ConsentCheckboxes, EMPTY_CONSENT } from '@/components/upload/ConsentCheckboxes';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { saveCV } from '@/lib/storage';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { requestUploadUrl, uploadToS3 } from '@/lib/api';
import Link from 'next/link';

export default function UploadCVPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { token } = useAuth();
  const [pageState, setPageState] = useState('upload');
  const [consent, setConsent] = useState(EMPTY_CONSENT);
  const [submitting, setSubmitting] = useState(false);
  const [s3Key, setS3Key] = useState(null);

  // Real upload: ask the backend for a presigned S3 URL, then PUT the file
  // straight to S3 as-is — no client-side parsing of the file's contents.
  // Every step is logged so a broken hookup (wrong BACKEND_URL, missing/
  // expired JWT, CORS, S3 policy, …) shows up clearly in the console
  // instead of failing silently.
  async function uploadToS3(file, onProgress) {
    if (!token) {
      console.error('[Upload] No JWT available — sign in with Google (not "Skip sign-in") before uploading.');
      throw new Error('You must be signed in with Google to upload a CV.');
    }

    console.log('[Upload] Requesting a presigned URL for', file.name, file.type, file.size, 'bytes');
    let urlData;
    try {
      urlData = await requestUploadUrl(token, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        frontendSelection: 'cv_upload_file',
      });
    } catch (err) {
      console.error('[Upload] /generate-upload-url failed:', err);
      throw err;
    }
    console.log('[Upload] /generate-upload-url response body:', urlData);

    onProgress?.(35);
    console.log('[Upload] Uploading directly to S3:', urlData.upload_url);

    try {
      await uploadToS3(urlData.upload_url, file, file.type, urlData);
    } catch (err) {
      console.error('[Upload] S3 PUT failed:', err);
      throw new Error('Uploading the file to storage failed.');
    }

    onProgress?.(100);
    setS3Key(urlData.s3_key);
    console.log('[Upload] Upload complete. S3 key:', urlData.s3_key);
  }

  function handleFile() {
    setPageState('uploaded');
  }

  function handleSubmit() {
    setSubmitting(true);
    // TODO(backend): the file itself is already in S3 (see s3Key below).
    // Once there's an endpoint to trigger/receive CV extraction for that
    // key (and to receive consent), POST this payload there instead of
    // only saving locally.
    console.log('[Upload] Submission payload (not yet sent — endpoint pending):', { s3Key, consent });
    saveCV({
      personalInfo: { fullName: '', email: '', phone: '', location: '' },
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
    setS3Key(null);
    setConsent(EMPTY_CONSENT);
    setSubmitting(false);
  }

  const canSubmit = consent.acceptTerms && !submitting;

  return (
    <div className="overflow-x-hidden">
      <section className="relative bg-dark pt-14 pb-16 sm:pt-16 sm:pb-20 overflow-hidden">
        <HeroBackground variant="waves" />
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand mb-5">
              <Upload size={26} className="text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-warm-light mb-3">{t('Upload Your CV')}</h1>
            <p className="text-silver text-lg max-w-lg mx-auto">
              {t("Upload your CV and we'll take care of the rest.")}
            </p>
          </motion.div>
        </Container>
      </section>

      <div className="py-12 sm:py-16">
      <Container maxWidth="lg">
        <AnimatePresence mode="wait">
          {/* Upload */}
          {pageState === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FileUploader onFile={handleFile} onUpload={uploadToS3} />
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

                <p className="text-xs text-silver mb-4 mt-5 leading-relaxed">
                  {t('Completing the skill assessment gives employers a clearer picture of your abilities and significantly increases your chances of receiving job offers.')}
                </p>

                <Button
                  fullWidth
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  rightIcon={<ArrowRight size={16} className="rtl:-scale-x-100" />}
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
    </div>
  );
}
