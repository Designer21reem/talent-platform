import Link from 'next/link';
import { BriefcaseBusiness } from 'lucide-react';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <Container>
        <div className="py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center">
              <BriefcaseBusiness size={14} className="text-white" />
            </div>
            <span className="font-semibold text-white text-sm">TalentHub</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/upload-cv" className="hover:text-white transition-colors">Upload CV</Link>
            <Link href="/build-cv" className="hover:text-white transition-colors">Build CV</Link>
            <Link href="/assessment" className="hover:text-white transition-colors">Assessment</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </nav>

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} TalentHub. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
