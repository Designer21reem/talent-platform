'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Upload, CheckCircle2,
  AlertCircle, User, Mail, Phone, MapPin, ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { FileUploader } from '@/components/upload/FileUploader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { saveCV } from '@/lib/storage';
import { parseFile } from '@/lib/cvParser';
import { useLanguage } from '@/lib/i18n';

const EMPTY_INFO = { fullName: '', email: '', phone: '', location: '' };

export default function UploadCVPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [pageState, setPageState] = useState('upload');
  const [parsedInfo, setParsedInfo] = useState(EMPTY_INFO);
  const [parseError, setParseError] = useState(null);


  async function handleFile(file) {
    setPageState('parsing');
    try {
      const info = await parseFile(file);
      setParsedInfo(info);
      setParseError(null);
      setPageState('review');
    } catch {
      setParseError('failed');
      setParsedInfo(EMPTY_INFO);
      setPageState('review');
    }
  }

  function saveAndContinue() {
    saveCV({
      personalInfo: parsedInfo,
      education: [],
      workExperience: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: [],
    });
    router.push('/assessment');
  }

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
            {t("Upload your CV in PDF format and we'll extract your information automatically.")}
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
              <p className="text-warm font-medium">{t('Reading your CV…')}</p>
              <p className="text-silver text-sm">{t('Extracting your information')}</p>
            </motion.div>
          )}

          {/* Review extracted info */}
          {pageState === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto"
            >
              <Card padding="lg">
                  {/* Status banner */}
                  {parseError === 'failed' ? (
                    <div className="flex items-start gap-3 mb-5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700">
                        {t("Couldn't auto-detect all fields. Please fill them in manually below.")}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 mb-5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-emerald-700">
                        {t('Information extracted! Review and correct if needed, then continue.')}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Input
                      label={t('Full Name')}
                      value={parsedInfo.fullName}
                      onChange={(e) => setParsedInfo((p) => ({ ...p, fullName: e.target.value }))}
                      leftElement={<User size={15} />}
                      placeholder={t('Your full name')}
                    />
                    <Input
                      label={t('Email Address')}
                      type="email"
                      value={parsedInfo.email}
                      onChange={(e) => setParsedInfo((p) => ({ ...p, email: e.target.value }))}
                      leftElement={<Mail size={15} />}
                      placeholder={t('alex@example.com')}
                    />
                    <Input
                      label={t('Phone Number')}
                      type="tel"
                      value={parsedInfo.phone}
                      onChange={(e) => setParsedInfo((p) => ({ ...p, phone: e.target.value }))}
                      leftElement={<Phone size={15} />}
                      placeholder="+1 555 000 0000"
                    />
                    <Input
                      label={t('Location')}
                      value={parsedInfo.location}
                      onChange={(e) => setParsedInfo((p) => ({ ...p, location: e.target.value }))}
                      leftElement={<MapPin size={15} />}
                      placeholder={t('City, Country')}
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button fullWidth onClick={saveAndContinue} rightIcon={<ArrowRight size={16} />}>
                      {t('Save & Go to Assessment')}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setPageState('upload')}>
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
