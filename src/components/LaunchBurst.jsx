import { memo } from 'react'
import { motion } from 'framer-motion'
import './LaunchBurst.css'

/* Jagged fractures radiating from the centre of a 200x200 box. Hand-plotted
   rather than random so the shape is the same every time. */
const CRACKS = [
  'M100 100 L118 88 L128 66 L146 52 L152 26',
  'M100 100 L86 84 L74 60 L52 46 L44 20',
  'M100 100 L120 108 L146 104 L168 116 L194 110',
  'M100 100 L80 112 L54 108 L30 120 L6 112',
  'M100 100 L110 122 L104 148 L118 170 L110 196',
  'M100 100 L90 120 L94 146 L78 166 L84 194',
  'M100 100 L124 94 L150 80 L176 84 L198 68',
  'M100 100 L74 96 L48 82 L24 88 L2 70',
]

/* Deterministic, so the blast is identical on every launch. */
const SHARDS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2 + (i % 2 ? 0.22 : -0.15)
  const dist = 130 + (i % 4) * 48
  return {
    id: i,
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    rotate: (i % 2 ? 1 : -1) * (90 + i * 17),
    size: 7 + (i % 3) * 6,
    delay: 0.88 + (i % 5) * 0.035,
  }
})

const EASE_OUT = [0.16, 1, 0.3, 1]
const EASE_BLAST = [0.22, 1, 0.36, 1]

/**
 * The launch moment: a seam of light splits open, fractures race outward,
 * then a shockwave blows the pieces apart and WE ARE LIVE. settles into place.
 *
 * Everything is transform and opacity, clipped to its own box so it can never
 * add scroll height or a horizontal scrollbar. Purely decorative — the
 * headline underneath is what gets announced.
 */
function LaunchBurst() {
  return (
    <div className="burst" aria-hidden="true">
      {/* the seam splitting open */}
      <motion.span
        className="burst__seam"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1, 0.2], opacity: [0, 1, 0.9, 0] }}
        transition={{ duration: 1.25, times: [0, 0.34, 0.68, 1], ease: EASE_OUT }}
      />

      {/* the fractures */}
      <svg className="burst__cracks" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
        {CRACKS.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
            transition={{
              pathLength: { duration: 0.7, delay: 0.34 + i * 0.028, ease: EASE_OUT },
              opacity: {
                duration: 1.5,
                delay: 0.34 + i * 0.028,
                times: [0, 0.18, 0.62, 1],
                ease: 'easeOut',
              },
            }}
          />
        ))}
      </svg>

      {/* the blast */}
      <motion.span
        className="burst__flash"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.62, delay: 0.84, times: [0, 0.22, 1], ease: 'easeOut' }}
      />

      {[0, 0.13].map((delay, i) => (
        <motion.span
          key={i}
          className="burst__ring"
          initial={{ scale: 0.18, opacity: 0 }}
          animate={{ scale: 1.75, opacity: [0, 0.85, 0] }}
          transition={{
            duration: 1.05,
            delay: 0.86 + delay,
            times: [0, 0.16, 1],
            ease: EASE_BLAST,
          }}
        />
      ))}

      {SHARDS.map((s) => (
        <motion.span
          key={s.id}
          className="burst__shard"
          style={{ width: s.size, height: s.size }}
          initial={{ x: 0, y: 0, scale: 0.3, rotate: 0, opacity: 0 }}
          animate={{
            x: s.x,
            y: s.y,
            scale: [0.3, 1, 0.4],
            rotate: s.rotate,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.1,
            delay: s.delay,
            times: [0, 0.2, 1],
            ease: EASE_BLAST,
          }}
        />
      ))}
    </div>
  )
}

export default memo(LaunchBurst)
