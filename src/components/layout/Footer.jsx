'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Container } from './Container';
import { useLanguage } from '@/lib/i18n';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-dark text-silver mt-auto border-t border-brand/20">
      <Container>
        <div className="py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/Logo (1).png" alt="THE VALUE" className="h-6 w-auto object-contain" />
            <span className="font-semibold text-warm-light text-sm">THE VALUE</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/" className="hover:text-brand transition-colors">{t('Home')}</Link>
            <Link href="/upload-cv" className="hover:text-brand transition-colors">{t('Upload CV')}</Link>
            <Link href="/build-cv" className="hover:text-brand transition-colors">{t('CV Builder')}</Link>
            <Link href="/assessment" className="hover:text-brand transition-colors">{t('Discover Your Personality')}</Link>
            <Link href="/dashboard" className="hover:text-brand transition-colors">{t('Dashboard')}</Link>
            <Link href="/about" className="hover:text-brand transition-colors">{t('About')}</Link>
          </nav>

          <div className="flex flex-col items-center sm:items-end gap-1.5">
            <span className="flex items-center gap-1.5 text-xs font-medium text-silver">
              {t('Trusted by HR teams across Iraq')}
              <ShieldCheck size={15} className="text-brand shrink-0" />
            </span>
            <p className="text-xs text-silver">
              &copy; {new Date().getFullYear()} THE VALUE. {t('All rights reserved.')}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
