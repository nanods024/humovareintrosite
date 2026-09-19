import { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useCountdownValue } from './CountdownProvider'
import LaunchBurst from './LaunchBurst'
import './Countdown.css'

const REEL = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * An odometer reel: 0-9 stacked inside a clipped box, moved with a single
 * transform. No elements are ever mounted or unmounted while the clock runs,
 * so there is nothing to leak and nothing for the compositor to re-layout.
 */
const Digit = memo(function Digit({ char }) {
  const n = Number(char)
  return (
    <span className="unit__digit">
      <span className="unit__reel" style={{ transform: `translate3d(0, ${n * -10}%, 0)` }}>
        {REEL.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </span>
    </span>
  )
})

const Unit = memo(function Unit({ value, label }) {
  const chars = String(value).padStart(2, '0').split('')
  return (
    <div className="unit">
      <div className="unit__digits" aria-hidden="true">
        {chars.map((char, i) => (
          <Digit key={`${label}-${i}`} char={char} />
        ))}
      </div>
      <span className="unit__label">{label}</span>
    </div>
  )
})

/* The burst runs a touch over 2s. Once that window has passed the headline is
   pinned visible by a class rather than by the animation finishing: a stalled
   or interrupted animation must never leave the launch moment blank. The class
   wins over Framer's inline styles and is applied by the style engine, so it
   does not itself depend on animation frames. Same node throughout, so
   role="status" announces once. */
const SETTLE_MS = 2300

function LiveReveal({ reducedMotion }) {
  const [settled, setSettled] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) return
    const id = window.setTimeout(() => setSettled(true), SETTLE_MS)
    return () => window.clearTimeout(id)
  }, [reducedMotion])

  return (
    <div className="countdown">
      <div className="reveal">
        {/* Decorative, and dropped as soon as the moment has landed. */}
        {!reducedMotion && !settled && <LaunchBurst />}

        <motion.h2
          className={`display countdown__headline countdown__headline--live reveal__headline${
            settled ? ' reveal__headline--settled' : ''
          }`}
          role="status"
          initial={reducedMotion ? false : { opacity: 0, scale: 1.22, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={
            reducedMotion
              ? { duration: 0.001 }
              : { duration: 1.15, delay: 1.16, ease: [0.16, 1, 0.3, 1] }
          }
        >
          We are live.
        </motion.h2>
      </div>
    </div>
  )
}

export default function Countdown({ reducedMotion }) {
  const { days, hours, minutes, seconds, isLive } = useCountdownValue()

  if (isLive) {
    return <LiveReveal reducedMotion={reducedMotion} />
  }

  return (
    <div className="countdown">
      <h2 className="countdown__headline">
        {days} {days === 1 ? 'Day' : 'Days'} to go
      </h2>

      {/* role="timer" is implicitly aria-live="off", so assistive tech can
          read the countdown on demand instead of being interrupted every
          second. The visual digits above are aria-hidden. */}
      <p className="sr-only" role="timer">
        {days} days, {hours} hours, {minutes} minutes and {seconds} seconds until the
        HUMOVARE launch.
      </p>

      <div className="countdown__grid">
        <Unit value={days} label="Days" />
        <Unit value={hours} label="Hours" />
        <Unit value={minutes} label="Minutes" />
        <Unit value={seconds} label="Seconds" />
      </div>
    </div>
  )
}
