'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';

// Frontend half of phone-number sign-in (spec item 2). The backend
// endpoints it calls (via useAuth().requestPhoneOtp / verifyPhoneOtp)
// don't exist yet, so this degrades to a clear error rather than a silent
// failure — see the [Auth] console logs for the exact backend gap.
export function PhoneSignIn() {
  const { t } = useLanguage();
  const { requestPhoneOtp, verifyPhoneOtp } = useAuth();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSendCode(e) {
    e.preventDefault();
    if (!phone.trim() || loading) return;
    setLoading(true);
    setError(null);
    const result = await requestPhoneOtp(phone.trim());
    setLoading(false);
    if (result.ok) {
      setStep('code');
    } else {
      setError(result.message);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (!code.trim() || loading) return;
    setLoading(true);
    setError(null);
    const result = await verifyPhoneOtp(phone.trim(), code.trim());
    setLoading(false);
    if (!result.ok) setError(result.message);
    // On success AuthProvider's user/token update and AuthGate unmounts this.
  }

  return (
    <form onSubmit={step === 'phone' ? handleSendCode : handleVerify} className="mt-4 space-y-3 text-start">
      {step === 'phone' ? (
        <Input
          type="tel"
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+964 770 000 0000"
          leftElement={<Phone size={15} />}
          required
        />
      ) : (
        <>
          <p className="text-xs text-silver">
            {t('Enter the code sent to')} <span dir="ltr">{phone}</span>
          </p>
          <Input
            type="text"
            inputMode="numeric"
            dir="ltr"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t('Verification code')}
            className="text-center tracking-[0.4em]"
            required
          />
        </>
      )}

      {error && <p className="text-xs text-red-500">{t(error)}</p>}

      <Button type="submit" fullWidth loading={loading}>
        {step === 'phone' ? t('Send Code') : t('Verify & Sign In')}
      </Button>
    </form>
  );
}
