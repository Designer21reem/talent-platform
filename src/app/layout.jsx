import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthGate } from '@/components/layout/AuthGate';
import { LanguageProvider } from '@/lib/i18n';
import { AuthProvider } from '@/lib/auth';

export const metadata = {
  title: "THE VALUE's GOT TALENT",
  description:
    'Upload your CV, build a professional profile, and complete skill assessments to showcase your talents to THE VALUE.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" type="image/png" href="/icon.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-dark antialiased">
        <LanguageProvider>
          <AuthProvider>
            <AuthGate>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </AuthGate>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
