'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { User, Mail } from 'lucide-react';
import { COUNTRIES } from '@/lib/formOptions';

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
    setCountryIdx(idx);
    setCityIdx(0);
    emit({ nextCountryIdx: idx, nextCityIdx: 0 });
  }

  function handleCityChange(e) {
    const idx = Number(e.target.value);
    setCityIdx(idx);
    emit({ nextCityIdx: idx });
  }

  function handlePhoneChange(e) {
    const digits = e.target.value.replace(/\D/g, '');
    setPhoneDigits(digits);
    emit({ nextDigits: digits });
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-warm-light">Personal Information</h2>
      <p className="text-sm text-silver">Tell us the basics — this will appear at the top of your CV.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Full Name"
          placeholder="e.g. Alex Johnson"
          value={data.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          required
          leftElement={<User size={15} />}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="alex@example.com"
          value={data.email}
          onChange={(e) => update('email', e.target.value)}
          required
          leftElement={<Mail size={15} />}
        />
        <Select
          label="Country"
          required
          options={COUNTRIES.map((c, i) => ({ value: i, label: `${c.name} (${c.dial})` }))}
          value={countryIdx}
          onChange={handleCountryChange}
        />
        <div className="flex gap-2 items-end">
          <div className="w-20 shrink-0">
            <Input label="Code" value={country.dial} readOnly disabled />
          </div>
          <div className="flex-1">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="770 123 4567"
              value={phoneDigits}
              onChange={handlePhoneChange}
              required
              hint="Required to start the assessment later"
            />
          </div>
        </div>
        <Select
          label="Location"
          options={country.cities.map((city, i) => ({ value: i, label: city }))}
          value={cityIdx}
          onChange={handleCityChange}
        />
      </div>
    </div>
  );
}
