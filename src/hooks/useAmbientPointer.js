import { useEffect } from 'react'

/**
 * Mouse-following spotlight, written straight to CSS custom properties
 * inside a requestAnimationFrame — no React state, so nothing re-renders
 * while the pointer moves. Falls back to a slow automatic drift on touch
 * devices and whenever reduced motion is requested.
 */
export function useAmbientPointer(ref, { enabled = true } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!enabled) {
      el.style.setProperty('--mx', '50%')
      el.style.setProperty('--my', '42%')
      el.dataset.drift = 'auto'
      return
    }

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) {
      el.dataset.drift = 'auto'
      return
    }

    el.dataset.drift = 'pointer'

    let frame = 0
    let tx = window.innerWidth / 2
    let ty = window.innerHeight * 0.42
    let cx = tx
    let cy = ty

    const render = () => {
      // Gentle easing so the light trails the cursor instead of snapping.
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      el.style.setProperty('--mx', `${(cx / window.innerWidth) * 100}%`)
      el.style.setProperty('--my', `${(cy / window.innerHeight) * 100}%`)
      frame = requestAnimationFrame(render)
    }

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [ref, enabled])
}
