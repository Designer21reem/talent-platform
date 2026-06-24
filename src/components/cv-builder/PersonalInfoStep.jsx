'use client';

import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export function PersonalInfoStep({ data, onChange }) {
  console.log('[PersonalInfoStep] Rendered with data:', data);

  function update(field, value) {
    console.log(`[PersonalInfoStep] Field "${field}" updated:`, value);
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
      <p className="text-sm text-slate-500">Tell us the basics — this will appear at the top of your CV.</p>

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
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 555 000 0000"
          value={data.phone}
          onChange={(e) => update('phone', e.target.value)}
          required
          leftElement={<Phone size={15} />}
          hint="Required to start the assessment later"
        />
        <Input
          label="Location"
          placeholder="City, Country"
          value={data.location}
          onChange={(e) => update('location', e.target.value)}
          leftElement={<MapPin size={15} />}
        />
      </div>
    </div>
  );
}
