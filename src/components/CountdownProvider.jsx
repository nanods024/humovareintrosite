import { createContext, useContext } from 'react'
import { useCountdown } from '../hooks/useCountdown'

const CountdownContext = createContext(null)

/**
 * One timer for the whole site. `children` arrive as a stable element
 * from App, so the per-second update only re-renders the components
 * that actually read the clock.
 */
export function CountdownProvider({ launchDate, children }) {
  const time = useCountdown(launchDate)
  return <CountdownContext.Provider value={time}>{children}</CountdownContext.Provider>
}

export function useCountdownValue() {
  const ctx = useContext(CountdownContext)
  if (!ctx) throw new Error('useCountdownValue must be used inside <CountdownProvider>')
  return ctx
}
