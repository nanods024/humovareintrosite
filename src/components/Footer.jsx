import { CONTACT, POWERED_BY, SOCIALS } from '../config'
import './Footer.css'

export default function Footer({ onReplayIntro }) {
  return (
    <footer className="footer" id="contact">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__name">Humovare</span>
          <span className="footer__soon">Coming soon.</span>
        </div>

        <div className="footer__cols">
          <section className="footer__col">
            <h2 className="footer__heading">Contact</h2>
            <address className="footer__address">
              {CONTACT.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <a className="footer__phone" href={CONTACT.phoneHref}>
              {CONTACT.phone}
            </a>
          </section>

          <section className="footer__col">
            <h2 className="footer__heading">Follow</h2>
            <nav className="footer__links" aria-label="Social">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener">
                  {s.label}
                </a>
              ))}
            </nav>
          </section>
        </div>

        <div className="footer__meta">
          <p className="footer__copy">&copy; {new Date().getFullYear()} Humovare</p>
          <button type="button" className="footer__replay" onClick={onReplayIntro}>
            Replay intro
          </button>
        </div>

        <p className="footer__powered">
          <span className="footer__poweredLabel">Powered by</span>
          {POWERED_BY.href ? (
            <a
              className="credit"
              href={POWERED_BY.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {/* One text node. The left-to-right fill is a clipped
                  background, not a second copy of the name, so the link has
                  exactly one accessible name. */}
              <span className="credit__text">{POWERED_BY.label}</span>
              <svg
                className="credit__arrow"
                viewBox="0 0 12 12"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M3 9L9 3M9 3H4.5M9 3v4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ) : (
            <span className="credit credit--plain">{POWERED_BY.label}</span>
          )}
        </p>
      </div>
    </footer>
  )
}
