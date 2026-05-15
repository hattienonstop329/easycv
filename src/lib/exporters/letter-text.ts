import { ResumeData } from '../types';

function joinIfTruthy(sep: string, ...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(sep);
}

export function letterToPlainText(data: ResumeData): string {
  const l = data.letter;
  const sender = l.overrideSender
    ? {
        name: l.senderName,
        title: l.senderTitle,
        email: l.senderEmail,
        phone: l.senderPhone,
        location: l.senderLocation,
        website: l.senderWebsite,
      }
    : {
        name: data.profile.fullName,
        title: data.profile.title,
        email: data.profile.email,
        phone: data.profile.phone,
        location: data.profile.location,
        website: data.profile.website,
      };

  const out: string[] = [];
  if (sender.name) out.push(sender.name);
  if (sender.title) out.push(sender.title);
  const contact = joinIfTruthy(' · ', sender.email, sender.phone, sender.location, sender.website);
  if (contact) out.push(contact);
  out.push('');

  if (l.date) out.push(l.date, '');
  if (l.recipientName) out.push(l.recipientName);
  if (l.recipientCompany) out.push(l.recipientCompany);
  if (l.recipientAddress) out.push(l.recipientAddress);
  if (l.recipientName || l.recipientCompany || l.recipientAddress) out.push('');

  if (l.subject) out.push(l.subject, '');
  if (l.salutation) out.push(l.salutation, '');
  if (l.body) out.push(l.body, '');
  if (l.closing) out.push(l.closing, '');
  if (l.signatureName) out.push(l.signatureName);

  while (out.length > 0 && out[out.length - 1] === '') out.pop();
  return out.join('\n') + '\n';
}
