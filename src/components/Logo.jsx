/* -------------------------------------------------------------
   Official HUMOVARE artwork.

   Master file: assets-src/humovare-logo.png (1600x1600, red tile).
   The shipped asset is the same artwork with the red background
   matted out, so the wordmark sits directly on the page and is
   never clipped or faded by a blending mask.

   Regenerate after replacing the master:  npm run logo
   ------------------------------------------------------------- */
import logoSrc from '../assets/humovare-logo.webp'
import './Logo.css'

export default function Logo({ size, float = false, className = '', priority = false }) {
  return (
    <span
      className={`logo ${float ? 'logo--float' : ''} ${className}`}
      style={size ? { '--logo-size': size } : undefined}
    >
      <img
        className="logo__img"
        src={logoSrc}
        alt="HUMOVARE"
        width="1200"
        height="1200"
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        draggable="false"
      />
    </span>
  )
}
