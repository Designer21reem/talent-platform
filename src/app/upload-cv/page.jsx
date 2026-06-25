'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Upload, FileText, ShieldCheck, CheckCircle2,
  AlertCircle, User, Mail, Phone, MapPin, ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { FileUploader } from '@/components/upload/FileUploader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { saveCV } from '@/lib/storage';
import { parsePDF } from '@/lib/cvParser';

const TIPS = [
  { icon: FileText, text: 'PDF format is supported for automatic info extraction' },
  { icon: ShieldCheck, text: 'Your file is processed locally — never sent to a server' },
  { icon: Upload, text: 'After uploading, take the assessment to see your skills report' },
];

const EMPTY_INFO = { fullName: '', email: '', phone: '', location: '' };

export default function UploadCVPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState('upload');
  const [parsedInfo, setParsedInfo] = useState(EMPTY_INFO);
  const [parseError, setParseError] = useState(null);

  console.log('[UploadCVPage] Rendered — state:', pageState);

  async function handleFile(file) {
    console.log('[UploadCVPage] File received for processing:', file.name);

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'docx') {
      console.log('[UploadCVPage] DOCX file — redirecting to Build CV');
      setParseError('docx');
      setParsedInfo(EMPTY_INFO);
      setPageState('review');
      return;
    }

    setPageState('parsing');
    try {
      const info = await parsePDF(file);
      console.log('[UploadCVPage] Parsed info:', info);
      setParsedInfo(info);
      setParseError(null);
      setPageState('review');
    } catch (err) {
      console.error('[UploadCVPage] Parse failed:', err);
      setParseError('failed');
      setParsedInfo(EMPTY_INFO);
      setPageState('review');
    }
  }

  function saveAndContinue() {
    console.log('[UploadCVPage] Saving CV personalInfo to storage…', parsedInfo);
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-5">
            <Upload size={26} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Upload Your CV</h1>
          <p className="text-slate-500 text-lg max-w-lg mx-auto">
            Upload your CV in PDF format and we'll extract your information automatically.
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
              <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-700 font-medium">Reading your CV…</p>
              <p className="text-slate-400 text-sm">Extracting your information</p>
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
              {parseError === 'docx' ? (
                <Card padding="lg" className="text-center">
                  <AlertCircle size={36} className="text-amber-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-800 text-lg mb-2">
                    DOCX auto-parsing is not supported
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Use the CV Builder to fill in your information — it only takes a few minutes.
                  </p>
                  <Button onClick={() => router.push('/build-cv')} rightIcon={<ArrowRight size={16} />}>
                    Go to CV Builder
                  </Button>
                </Card>
              ) : (
                <Card padding="lg">
                  {/* Status banner */}
                  {parseError === 'failed' ? (
                    <div className="flex items-start gap-3 mb-5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700">
                        Couldn't auto-detect all fields. Please fill them in manually below.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 mb-5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-emerald-700">
                        Information extracted! Review and correct if needed, then continue.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      value={parsedInfo.fullName}
                      onChange={(e) => setParsedInfo((p) => ({ ...p, fullName: e.target.value }))}
                      leftElement={<User size={15} />}
                      placeholder="Your full name"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={parsedInfo.email}
                      onChange={(e) => setParsedInfo((p) => ({ ...p, email: e.target.value }))}
                      leftElement={<Mail size={15} />}
                      placeholder="you@example.com"
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={parsedInfo.phone}
                      onChange={(e) => setParsedInfo((p) => ({ ...p, phone: e.target.value }))}
                      leftElement={<Phone size={15} />}
                      placeholder="+1 555 000 0000"
                    />
                    <Input
                      label="Location"
                      value={parsedInfo.location}
                      onChange={(e) => setParsedInfo((p) => ({ ...p, location: e.target.value }))}
                      leftElement={<MapPin size={15} />}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button fullWidth onClick={saveAndContinue} rightIcon={<ArrowRight size={16} />}>
                      Save & Go to Assessment
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setPageState('upload')}>
                      Re-upload
                    </Button>
                  </div>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips — only on upload state */}
        {pageState === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {TIPS.map(({ icon: Icon, text }) => (
              <Card key={text} padding="md" className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-blue-600" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
              </Card>
            ))}
          </motion.div>
        )}
      </Container>
    </div>
  );
}
