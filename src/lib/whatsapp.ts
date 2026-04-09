/**
 * E.164 digits only, no + (e.g. 250791000000).
 * Override with NEXT_PUBLIC_WHATSAPP_E164 in .env
 */
export function getWhatsAppBusinessE164(): string {
  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_E164 ?? "250791000000";
  const digits = raw.replace(/\D/g, "");
  return digits.length > 0 ? digits : "250791000000";
}

export function buildWhatsAppUrl(message: string): string {
  const phone = getWhatsAppBusinessE164();
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
