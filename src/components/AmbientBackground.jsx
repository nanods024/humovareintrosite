import { useRef } from 'react'
import { useAmbientPointer } from '../hooks/useAmbientPointer'
import './AmbientBackground.css'

/* Inlined so the grain costs zero network requests. */
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.86' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E")`

/**
 * The whole atmosphere: gradient depth, slow moving light bodies,
 * a pointer-tracked spotlight, vignette and film grain.
 * `phase` drives the blur-to-sharp cinematic transition.
 */
export default function AmbientBackground({ phase, reducedMotion }) {
  const ref = useRef(null)
  useAmbientPointer(ref, { enabled: !reducedMotion })

  return (
    <>
      <div ref={ref} className="ambient" data-phase={phase} aria-hidden="true">
        <div className="ambient__veil ambient__veil--a" />
        <div className="ambient__veil ambient__veil--b" />
        <div className="ambient__veil ambient__veil--c" />
        <div className="ambient__spot" />
        <div className="ambient__vignette" />
      </div>
      <div className="grain" aria-hidden="true" style={{ '--grain-src': GRAIN }} />
    </>
  )
}
