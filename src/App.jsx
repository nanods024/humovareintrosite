import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { INTRO_STORAGE_KEY, LAUNCH_DATE } from './config'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import AmbientBackground from './components/AmbientBackground'
import { CountdownProvider } from './components/CountdownProvider'
import IntroScreen from './components/IntroScreen'
import Hero from './components/Hero'
import FashionTeaser from './components/FashionTeaser'
import BrandStatement from './components/BrandStatement'
import JoinDrop from './components/JoinDrop'
import Footer from './components/Footer'

/* Private browsing and locked-down storage settings can throw here,
   so every access is guarded — the intro simply plays again. */
function readIntroSeen() {
  try {
    return window.localStorage.getItem(INTRO_STORAGE_KEY) === 'seen'
  } catch {
    return false
  }
}

function writeIntroSeen(seen) {
  try {
    if (seen) window.localStorage.setItem(INTRO_STORAGE_KEY, 'seen')
    else window.localStorage.removeItem(INTRO_STORAGE_KEY)
  } catch {
    /* no-op */
  }
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const [entered, setEntered] = useState(readIntroSeen)

  // Nothing behind the intro should scroll while it is up. The flag goes on
  // <html> because that is the element that actually scrolls.
  useEffect(() => {
    document.documentElement.dataset.locked = entered ? 'false' : 'true'
    return () => {
      document.documentElement.dataset.locked = 'false'
    }
  }, [entered])

  const handleEnter = useCallback(() => {
    writeIntroSeen(true)
    setEntered(true)
  }, [])

  const handleReplay = useCallback(() => {
    writeIntroSeen(false)
    // 'auto' defers to the CSS scroll-behavior (smooth); the replay should
    // snap to the top instantly, behind the intro fading back in.
    window.scrollTo({ top: 0, behavior: 'instant' })
    setEntered(false)
  }, [])

  return (
    <CountdownProvider launchDate={LAUNCH_DATE}>
      <a className="skip-link" href="#first-drop">
        Skip to content
      </a>

      <AmbientBackground phase={entered ? 'main' : 'intro'} reducedMotion={reducedMotion} />

      <AnimatePresence>
        {!entered && (
          <IntroScreen key="intro" onEnter={handleEnter} reducedMotion={reducedMotion} />
        )}
      </AnimatePresence>

      {/* Opacity only. A scale or blur here would put every section — on
          screen or not — on a composited layer, and any interruption (a
          backgrounded tab freezing rAF) would strand the whole document
          oversized and clipped. The zoom and the blur-to-sharp beat live on
          the fixed background layer, where they cost nothing and cannot clip
          content; the slide-in comes from the hero's own reveals. */}
      {entered && (
        <motion.main
          className="shell"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            reducedMotion
              ? { duration: 0.001 }
              : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <Hero reducedMotion={reducedMotion} />
          <hr className="rule" />
          <FashionTeaser reducedMotion={reducedMotion} />
          <hr className="rule" />
          <BrandStatement reducedMotion={reducedMotion} />
          <hr className="rule" />
          <JoinDrop reducedMotion={reducedMotion} />
          <Footer onReplayIntro={handleReplay} />
        </motion.main>
      )}
    </CountdownProvider>
  )
}
