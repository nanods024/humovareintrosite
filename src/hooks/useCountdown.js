import { useEffect, useRef, useState } from 'react'

const SECOND = 1000

function diff(target) {
  const ms = target.getTime() - Date.now()
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true }
  const total = Math.floor(ms / SECOND)
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    isLive: false,
  }
}

/**
 * Ticks once per second, self-correcting against clock drift and
 * tab-throttling by re-aligning to the next whole second each time.
 * The timeout is always cleared on unmount / target change.
 */
export function useCountdown(target) {
  const [time, setTime] = useState(() => diff(target))
  const timer = useRef(null)

  useEffect(() => {
    let cancelled = false

    const tick = () => {
      if (cancelled) return
      setTime(diff(target))
      const drift = Date.now() % SECOND
      timer.current = window.setTimeout(tick, SECOND - drift)
    }

    setTime(diff(target))
    timer.current = window.setTimeout(tick, SECOND - (Date.now() % SECOND))

    // A backgrounded tab freezes timers; resync the moment it returns.
    const onVisible = () => {
      if (document.visibilityState === 'visible') setTime(diff(target))
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      if (timer.current) window.clearTimeout(timer.current)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [target])

  return time
}
