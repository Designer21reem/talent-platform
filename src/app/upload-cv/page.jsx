'use client';

import { motion } from 'framer-motion';
import { Upload, FileText, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { FileUploader } from '@/components/upload/FileUploader';
import { Card } from '@/components/ui/Card';

const TIPS = [
  { icon: FileText, text: 'PDF or DOCX formats are accepted' },
  { icon: ShieldCheck, text: 'Your file is processed locally — never stored on a server' },
  { icon: Upload, text: 'After uploading you can still take the assessment' },
];

export default function UploadCVPage() {
  console.log('[UploadCVPage] Rendered');

  return (
    <div className="py-12 sm:py-20">
      <Container maxWidth="lg">
        {/* Page header */}
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
            Upload your existing CV in PDF or DOCX format. We'll parse it and have you ready in
            seconds.
          </p>
        </motion.div>

        {/* Uploader */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <FileUploader />
        </motion.div>

        {/* Tips */}
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
      </Container>
    </div>
  );
}
