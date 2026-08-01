'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, ShieldCheck, Languages, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Container } from './Container';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/upload-cv', label: 'Upload CV' },
  { href: '/build-cv', label: 'CV Builder' },
  { href: '/assessment', label: 'Assessment' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, lang, toggle } = useLanguage();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur-md border-b border-brand/20 shadow-sm">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/Logo (1).png" alt="THE VALUE" className="h-8 w-auto object-contain" />
            <span className="font-bold text-white text-lg tracking-tight">THE VALUE</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand/15 text-brand'
                      : 'text-warm hover:bg-surface-2 hover:text-white'
                  )}
                >
                  {t(link.label)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-silver whitespace-nowrap">
              {t('Trusted by HR teams across Iraq')}
              <ShieldCheck size={15} className="text-brand shrink-0" />
            </span>

            {/* Language toggle — always visible (desktop and mobile) so
                switching languages isn't buried behind another menu. */}
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-brand/30 text-xs font-semibold text-brand hover:bg-brand/10 transition-colors"
              aria-label={t('Language')}
            >
              <Languages size={14} />
              <span className="hidden sm:inline">{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {user && (
              <button
                onClick={signOut}
                aria-label={t('Sign out')}
                className="hidden sm:flex p-2 rounded-lg text-silver hover:text-red-400 hover:bg-surface-2 transition-colors"
              >
                <LogOut size={16} />
              </button>
            )}

            {/* Mobile toggle */}
            <button
              className="xl:hidden p-2 rounded-lg text-warm hover:bg-surface-2"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Nav */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="xl:hidden border-t border-brand/20 bg-dark"
        >
          <Container>
            <nav className="py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand/15 text-brand'
                        : 'text-warm hover:bg-surface-2 hover:text-white'
                    )}
                  >
                    {t(link.label)}
                  </Link>
                );
              })}

              {user && (
                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="sm:hidden flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-warm hover:bg-surface-2 hover:text-red-400 transition-colors text-start"
                >
                  <LogOut size={15} />
                  {t('Sign out')}
                </button>
              )}

              <div className="px-3 pt-2">
                <span className="flex items-center gap-1.5 text-xs font-medium text-silver">
                  {t('Trusted by HR teams across Iraq')}
                  <ShieldCheck size={15} className="text-brand shrink-0" />
                </span>
              </div>
            </nav>
          </Container>
        </motion.div>
      )}
    </header>
  );
}
