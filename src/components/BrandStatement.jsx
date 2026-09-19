import { motion } from 'framer-motion'
import './BrandStatement.css'

export default function BrandStatement({ reducedMotion }) {
  const reveal = (delay = 0) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 40, filter: 'blur(16px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-15% 0px -15% 0px' },
    transition: reducedMotion
      ? { duration: 0.001 }
      : { duration: 1.3, delay, ease: [0.16, 1, 0.3, 1] },
  })

  return (
    <section className="section statement" id="movement">
      <motion.p className="display statement__word" {...reveal()}>
        Humovare
      </motion.p>

      <motion.h2 className="statement__lines" {...reveal(0.12)}>
        <em>Not just clothing.</em>
        A movement.
      </motion.h2>
    </section>
  )
}
