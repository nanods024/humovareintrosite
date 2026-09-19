/* =============================================================
   HUMOVARE — single source of truth for the launch.
   Change the drop date here and the whole site follows:
   the countdown, the hero line and the final CTA all read it.
   ============================================================= */

// Local time. Format: "YYYY-MM-DDTHH:MM:SS"
export const LAUNCH_DATE = new Date('2026-09-30T17:35:00')

// Intro is shown once per visitor; bump this string to force
// everyone through the intro again (e.g. for a new campaign).
export const INTRO_STORAGE_KEY = 'humovare:intro:v1'

export const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/humovare' },
]

// wa.me needs the number in full international form, digits only.
const WHATSAPP_NUMBER = '917989355385'
const WHATSAPP_MESSAGE = 'Hi HUMOVARE — I want in on the first drop.'

export const WHATSAPP = {
  display: '7989355385',
  href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
}

/* Credit line in the footer. Add the URL and it becomes a link; leave it
   empty and it renders as plain text. */
export const POWERED_BY = {
  label: 'Nano Digital Services',
  href: 'https://nanodigitalservices.onrender.com/',
}

export const CONTACT = {
  phone: '7989355385',
  // tel: links must be digits only, with the country code.
  phoneHref: 'tel:+917989355385',
  address: [
    'Door No. 43-18-41',
    'P Savitri Enclave, 3F4',
    'TSN Colony, Venkat Raju Nagar',
    'Dondaparthy',
    '530016',
  ],
}
