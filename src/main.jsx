import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

/* Browsers restore the previous scroll position on reload, which would drop a
   returning visitor halfway down the page. This is a launch experience — it
   should always open at the top. Set before render so nothing paints at the
   restored offset. */
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
