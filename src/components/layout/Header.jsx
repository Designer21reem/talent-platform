'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Container } from './Container';
import { LanguageToggle } from './LanguageToggle';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/upload-cv', label: 'Upload CV' },
  { href: '/build-cv', label: 'CV Builder' },
  { href: '/assessment', label: 'Assessment' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();
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

          <div className="hidden xl:flex items-center gap-3">
            <LanguageToggle />
            {user && (
              <button
                onClick={signOut}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-surface-2 hover:border-brand/40 transition-colors"
                title={t('Sign out')}
              >
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-brand/20 text-brand text-[10px] font-semibold flex items-center justify-center">
                    {user.name?.[0]}
                  </span>
                )}
                <span className="text-xs font-medium text-warm">{t('Sign out')}</span>
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="xl:hidden p-2 rounded-lg text-warm hover:bg-surface-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
              <div className="px-3 pt-2 flex items-center gap-3">
                <LanguageToggle />
                {user && (
                  <button
                    onClick={signOut}
                    className="text-xs font-medium text-warm hover:text-white transition-colors"
                  >
                    {t('Sign out')}
                  </button>
                )}
              </div>
            </nav>
          </Container>
        </motion.div>
      )}
    </header>
  );
}
