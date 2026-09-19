/* -------------------------------------------------------------
   To use the official artwork, drop  humovare-logo.png  into
   src/assets/ and change the import below to point at it.
   Nothing else needs to change — the tile is square either way
   and is only ever scaled uniformly (object-fit: contain).
   ------------------------------------------------------------- */
import logoSrc from '../assets/humovare-logo.svg'
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
        width="1000"
        height="1000"
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        draggable="false"
      />
    </span>
  )
}
