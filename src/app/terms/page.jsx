'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { useLanguage } from '@/lib/i18n';

const SECTIONS = [
  {
    title: 'Use of the Platform',
    body: 'THE VALUE provides CV building, CV upload, and skill assessment tools free of charge to candidates. By using the platform you agree to provide accurate, truthful information about yourself.',
  },
  {
    title: 'Your Data',
    body: 'Information you submit — your CV, assessment answers, and contact details — is stored to build your candidate profile and, where you opt in, shared with partner recruiter teams for hiring purposes only.',
  },
  {
    title: 'Consent & Communication',
    body: 'By accepting these terms you consent to THE VALUE and its partner organizations contacting you regarding relevant job opportunities based on the information you provide.',
  },
  {
    title: 'Accuracy of Information',
    body: 'You are responsible for the accuracy of the CV content, certifications, and experience you submit. Misrepresenting qualifications may result in your profile being removed from consideration.',
  },
  {
    title: 'Changes',
    body: 'These terms may be updated from time to time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.',
  },
];

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="py-16 sm:py-20">
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand mb-4">
            <FileText size={26} className="text-dark" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-warm-light mb-2">{t('Terms & Conditions')}</h1>
          <p className="text-silver">{t('Please read these terms before submitting your information.')}</p>
        </motion.div>

        <div className="space-y-8">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 className="text-lg font-semibold text-brand mb-2">{t(s.title)}</h2>
              <p className="text-warm leading-relaxed">{t(s.body)}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
