import { motion } from 'framer-motion'
import Logo from './Logo'
import './IntroScreen.css'

export default function IntroScreen({ onEnter, reducedMotion }) {
  const t = (d, delay = 0) =>
    reducedMotion
      ? { duration: 0.001 }
      : { duration: d, delay, ease: [0.22, 1, 0.36, 1] }

  return (
    <motion.button
      type="button"
      className="intro"
      onClick={onEnter}
      aria-label="Enter the HUMOVARE launch experience"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={
        reducedMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 1.28, filter: 'blur(26px)' }
      }
      transition={t(1.1)}
      style={{ transformOrigin: '50% 46%' }}
    >
      <motion.span
        className="intro__mark"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.94, filter: 'blur(14px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={t(1.6, 0.15)}
      >
        <Logo float={!reducedMotion} priority />
      </motion.span>

      <motion.p
        className="intro__line"
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(1.2, 0.85)}
      >
        Something new is coming.
      </motion.p>

      <motion.span
        className="intro__enter"
        initial={reducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(1.1, 1.35)}
      >
        <span className="intro__pulse" aria-hidden="true">
          <span className="intro__dot" />
        </span>
        <span className="intro__cta">Tap to enter</span>
      </motion.span>
    </motion.button>
  )
}
