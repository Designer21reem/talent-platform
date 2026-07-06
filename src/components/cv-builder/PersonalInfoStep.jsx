'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { User, Mail } from 'lucide-react';
import { COUNTRIES } from '@/lib/formOptions';
import { useLanguage } from '@/lib/i18n';

function guessCountryIdx(phone) {
  const idx = COUNTRIES.findIndex((c) => phone?.trim().startsWith(c.dial));
  return idx >= 0 ? idx : 0;
}

function guessDigits(phone, countryIdx) {
  const dial = COUNTRIES[countryIdx].dial;
  const raw = (phone || '').trim();
  const withoutDial = raw.startsWith(dial) ? raw.slice(dial.length) : raw;
  return withoutDial.replace(/\D/g, '');
}

function guessCityIdx(location, countryIdx) {
  const cities = COUNTRIES[countryIdx].cities;
  const idx = cities.findIndex((city) => location?.includes(city));
  return idx >= 0 ? idx : 0;
}

export function PersonalInfoStep({ data, onChange }) {
  const { t } = useLanguage();
  const [countryIdx, setCountryIdx] = useState(() => guessCountryIdx(data.phone));
  const [cityIdx, setCityIdx] = useState(() => guessCityIdx(data.location, guessCountryIdx(data.phone)));
  const [phoneDigits, setPhoneDigits] = useState(() => guessDigits(data.phone, guessCountryIdx(data.phone)));

  const country = COUNTRIES[countryIdx];

  function update(field, value) {
    onChange({ ...data, [field]: value });
  }

  function emit({ nextCountryIdx = countryIdx, nextCityIdx = cityIdx, nextDigits = phoneDigits }) {
    const c = COUNTRIES[nextCountryIdx];
    onChange({
      ...data,
      phone: nextDigits ? `${c.dial} ${nextDigits}` : '',
      location: `${c.cities[nextCityIdx]}, ${c.name}`,
    });
  }

  function handleCountryChange(e) {
    const idx = Number(e.target.value);
    const nextDigits = phoneDigits.slice(0, COUNTRIES[idx].phoneLength);
    setCountryIdx(idx);
    setCityIdx(0);
    setPhoneDigits(nextDigits);
    emit({ nextCountryIdx: idx, nextCityIdx: 0, nextDigits });
  }

  function handleCityChange(e) {
    const idx = Number(e.target.value);
    setCityIdx(idx);
    emit({ nextCityIdx: idx });
  }

  function handlePhoneChange(e) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, country.phoneLength);
    setPhoneDigits(digits);
    emit({ nextDigits: digits });
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-warm-light">{t('Personal Information')}</h2>
      <p className="text-sm text-silver">{t('Tell us the basics — this will appear at the top of your CV.')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label={t('Full Name')}
          placeholder={t('e.g. Alex Johnson')}
          value={data.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          required
          leftElement={<User size={15} />}
        />
        <Input
          label={t('Email Address')}
          type="email"
          placeholder={t('alex@example.com')}
          value={data.email}
          onChange={(e) => update('email', e.target.value)}
          required
          leftElement={<Mail size={15} />}
        />
        <Select
          label={t('Country')}
          required
          options={COUNTRIES.map((c, i) => ({ value: i, label: `${t(c.name)} (‎${c.dial}‎)` }))}
          value={countryIdx}
          onChange={handleCountryChange}
        />
        <Input
          label={t('Phone Number')}
          type="tel"
          dir="ltr"
          placeholder={t('770 123 4567')}
          value={phoneDigits}
          onChange={handlePhoneChange}
          maxLength={country.phoneLength}
          required
          hint={`${t('Required to start the assessment later')} · ${country.phoneLength} ${t('digits')}`}
          leftElement={<span dir="ltr" className="text-warm text-sm font-medium">{country.dial}</span>}
          className="ps-16"
        />
        <Select
          label={t('Location')}
          options={country.cities.map((city, i) => ({ value: i, label: t(city) }))}
          value={cityIdx}
          onChange={handleCityChange}
        />
      </div>
    </div>
  );
}
