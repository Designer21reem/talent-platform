import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthGate } from '@/components/layout/AuthGate';
import { ReviewPopup } from '@/components/feedback/ReviewPopup';
import { LanguageProvider } from '@/lib/i18n';
import { AuthProvider } from '@/lib/auth';

export const metadata = {
  title: "THE VALUE's GOT TALENT",
  description:
    'Upload your CV, build a professional profile, and complete skill assessments to showcase your talents to THE VALUE.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/icon.png" />
        {/* Warms the connection ahead of time so the Google Sign-In widget
            doesn't eat a fresh DNS+TLS handshake on first use. */}
        <link rel="preconnect" href="https://accounts.google.com" />
        {/* Applies the saved language/direction before first paint — without
            this, a returning Arabic user briefly sees an English/LTR flash
            until LanguageProvider's effect runs post-hydration. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var l=localStorage.getItem('tv_lang');if(l==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';}}catch(e){}})();",
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-dark antialiased">
        <LanguageProvider>
          <AuthProvider>
            <AuthGate>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <ReviewPopup />
            </AuthGate>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
