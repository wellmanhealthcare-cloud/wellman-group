import type { SiteSettings } from '@/types/settings';

/**
 * Opens WhatsApp and/or a mailto: draft with the given message, based on the
 * admin's configured notification_channel (Settings → Notifications).
 * Each call must run synchronously inside the triggering click handler —
 * browsers block window.open() calls made outside a user gesture.
 */
export function sendAdminNotification(
  settings: SiteSettings | null,
  opts: { subject: string; lines: (string | null)[] }
) {
  const channel = settings?.notification_channel ?? 'whatsapp';
  const whatsappNumber = settings?.whatsapp_number?.replace(/\D/g, '') ?? '919409428888';
  const emailTo = settings?.email_primary ?? 'info@wellmangroup.in';
  const text = opts.lines.filter((l): l is string => l !== null).join('\n');

  if (channel === 'whatsapp' || channel === 'both') {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  }
  if (channel === 'email' || channel === 'both') {
    const plainBody = text.replace(/\*/g, '');
    window.open(
      `mailto:${emailTo}?subject=${encodeURIComponent(opts.subject)}&body=${encodeURIComponent(plainBody)}`,
      '_blank'
    );
  }
}
