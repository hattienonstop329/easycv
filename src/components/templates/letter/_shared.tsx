import { ResumeData } from '@/lib/types';

export interface SenderInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
}

export function effectiveSender(data: ResumeData): SenderInfo {
  const l = data.letter;
  if (l.overrideSender) {
    return {
      name: l.senderName,
      title: l.senderTitle,
      email: l.senderEmail,
      phone: l.senderPhone,
      location: l.senderLocation,
      website: l.senderWebsite,
    };
  }
  const p = data.profile;
  return {
    name: p.fullName,
    title: p.title,
    email: p.email,
    phone: p.phone,
    location: p.location,
    website: p.website,
  };
}
