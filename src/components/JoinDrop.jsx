import { motion } from 'framer-motion'
import { WHATSAPP } from '../config'
import { useCountdownValue } from './CountdownProvider'
import './JoinDrop.css'

function DaysLine() {
  const { days, isLive } = useCountdownValue()
  return (
    <p className="display joindrop__days">
      {isLive ? 'Live now.' : `${days} ${days === 1 ? 'Day' : 'Days'}.`}
    </p>
  )
}

function WhatsAppMark() {
  return (
    <svg className="joindrop__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Zm-2.6 4.1c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.35-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46Z"
      />
    </svg>
  )
}

export default function JoinDrop({ reducedMotion }) {
  const reveal = (delay = 0) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 30, filter: 'blur(12px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-12% 0px -12% 0px' },
    transition: reducedMotion
      ? { duration: 0.001 }
      : { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] },
  })

  return (
    <section className="section joindrop" id="join">
      <motion.div className="joindrop__lead" {...reveal()}>
        <p className="joindrop__begun">The countdown has begun.</p>
        <DaysLine />
      </motion.div>

      <motion.h2 className="joindrop__title" {...reveal(0.08)}>
        Join the drop
      </motion.h2>

      <motion.p className="lede joindrop__copy" {...reveal(0.12)}>
        Message us on WhatsApp to get on the list.
      </motion.p>

      <motion.a
        className="joindrop__button"
        href={WHATSAPP.href}
        target="_blank"
        rel="noreferrer noopener"
        {...reveal(0.16)}
      >
        <WhatsAppMark />
        <span className="joindrop__number">{WHATSAPP.display}</span>
        <span className="joindrop__action">WhatsApp us</span>
      </motion.a>
    </section>
  )
}
