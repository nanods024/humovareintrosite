import { motion } from 'framer-motion'
import Logo from './Logo'
import Countdown from './Countdown'
import './Hero.css'

const WORD = 'HUMOVARE'.split('')

export default function Hero({ reducedMotion }) {
  const rise = (delay = 0) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 26, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: reducedMotion
      ? { duration: 0.001 }
      : { duration: 1.05, delay, ease: [0.16, 1, 0.3, 1] },
  })

  return (
    <section className="section hero" id="top">
      <div className="hero__top">
        <motion.span className="hero__mark" {...rise(0.05)}>
          <Logo priority />
        </motion.span>

        <h1 className="display hero__title" aria-label="HUMOVARE">
          {WORD.map((letter, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              initial={reducedMotion ? false : { opacity: 0, y: '38%', filter: 'blur(14px)' }}
              animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
              transition={
                reducedMotion
                  ? { duration: 0.001 }
                  : { duration: 1.15, delay: 0.18 + i * 0.055, ease: [0.16, 1, 0.3, 1] }
              }
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        <div className="hero__sub">
          <motion.p className="hero__coming" {...rise(0.78)}>
            Coming soon.
          </motion.p>
          <motion.p className="lede hero__drop" {...rise(0.9)}>
            The first drop is almost here.
          </motion.p>
        </div>
      </div>

      <motion.div {...rise(1.05)}>
        <Countdown reducedMotion={reducedMotion} />
      </motion.div>

      <motion.span
        className="hero__scroll"
        aria-hidden="true"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        <i />
        Scroll
      </motion.span>
    </section>
  )
}
