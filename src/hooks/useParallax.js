import { useEffect, useRef } from 'react'
import { useScroll, useTransform } from 'framer-motion'

/**
 * A small element-relative parallax built on window scroll.
 *
 * useScroll({ target }) is the obvious API, but it walks offsetParent up to
 * the scroll root — and body.offsetParent is always null on a normally
 * scrolled page, so it warns and mis-measures. Measuring the element once
 * (and on resize) avoids that entirely and does no per-frame layout reads.
 *
 * @returns a MotionValue in pixels, travelling +distance -> -distance as the
 *          element crosses the viewport.
 */
export function useParallax(ref, distance = 20) {
  const { scrollY } = useScroll()
  const bounds = useRef({ top: 0, height: 1 })

  useEffect(() => {
    const measure = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      bounds.current = { top: rect.top + window.scrollY, height: rect.height }
    }

    measure()
    window.addEventListener('resize', measure, { passive: true })
    // Fonts landing late can shift the section; re-measure once they do.
    document.fonts?.ready.then(measure).catch(() => {})

    return () => window.removeEventListener('resize', measure)
  }, [ref])

  return useTransform(scrollY, (value) => {
    const { top, height } = bounds.current
    const span = height + window.innerHeight
    if (span <= 0) return 0
    const progress = (value + window.innerHeight - top) / span
    const clamped = progress < 0 ? 0 : progress > 1 ? 1 : progress
    return (0.5 - clamped) * distance * 2
  })
}
