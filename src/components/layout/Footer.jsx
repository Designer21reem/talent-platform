import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="bg-dark text-silver mt-auto border-t border-brand/20">
      <Container>
        <div className="py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/Logo (1).png" alt="THE VALUE" className="h-6 w-auto object-contain" />
            <span className="font-semibold text-white text-sm">THE VALUE</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <Link href="/upload-cv" className="hover:text-brand transition-colors">Upload CV</Link>
            <Link href="/build-cv" className="hover:text-brand transition-colors">Build CV</Link>
            <Link href="/assessment" className="hover:text-brand transition-colors">Assessment</Link>
            <Link href="/dashboard" className="hover:text-brand transition-colors">Dashboard</Link>
            <Link href="/about" className="hover:text-brand transition-colors">About</Link>
          </nav>

          <p className="text-xs text-silver">
            &copy; {new Date().getFullYear()} THE VALUE. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
