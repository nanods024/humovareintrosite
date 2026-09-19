import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useParallax } from '../hooks/useParallax'
import './FashionTeaser.css'

import tshirt720 from '../assets/drop/tshirt-720.webp'
import tshirt1254 from '../assets/drop/tshirt-1254.webp'
import hoodie720 from '../assets/drop/hoodie-720.webp'
import hoodie1254 from '../assets/drop/hoodie-1254.webp'
import fabric720 from '../assets/drop/fabric-720.webp'
import fabric1142 from '../assets/drop/fabric-1142.webp'
import print720 from '../assets/drop/print-720.webp'
import print1142 from '../assets/drop/print-1142.webp'

/* The tee and hoodie are square, the fabric and print are both 1142x1377 —
   so as a two-column grid the rows pair up and every image is shown whole,
   never cropped. */
const PIECES = [
  {
    key: 'tshirt',
    name: 'T-Shirt',
    index: '01',
    width: 1254,
    height: 1254,
    src: tshirt1254,
    srcSet: `${tshirt720} 720w, ${tshirt1254} 1254w`,
    alt: 'HUMOVARE red oversized t-shirt with the Humo. logo printed across the chest.',
  },
  {
    key: 'hoodie',
    name: 'Hoodie',
    index: '02',
    width: 1254,
    height: 1254,
    src: hoodie1254,
    srcSet: `${hoodie720} 720w, ${hoodie1254} 1254w`,
    alt: 'HUMOVARE red hoodie with the Humo. logo and the line Wear Your Movement.',
  },
  {
    key: 'fabric',
    name: 'Fabric',
    index: '03',
    width: 1142,
    height: 1378,
    src: fabric1142,
    srcSet: `${fabric720} 720w, ${fabric1142} 1142w`,
    alt: 'Close-up of the premium red cotton blend fabric and the woven HUMOVARE label.',
  },
  {
    key: 'print',
    name: 'The Print',
    index: '04',
    width: 1142,
    height: 1377,
    src: print1142,
    srcSet: `${print720} 720w, ${print1142} 1142w`,
    alt: 'Macro detail of the raised Humo. print showing its texture on the red knit.',
  },
]

// One column below 760px, two above — matches the CSS grid.
const SIZES = '(max-width: 760px) calc(100vw - 2.5rem), (max-width: 1440px) 46vw, 620px'

const reveal = (reducedMotion, delay = 0) => ({
  initial: reducedMotion ? false : { opacity: 0, y: 34, filter: 'blur(12px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-12% 0px -12% 0px' },
  transition: reducedMotion
    ? { duration: 0.001 }
    : { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] },
})

export default function FashionTeaser({ reducedMotion }) {
  const ref = useRef(null)
  // Very slight parallax — enough to feel alive, never enough to notice.
  const y = useParallax(ref, 22)

  return (
    <section className="section teaser" id="first-drop" ref={ref}>
      <div className="teaser__head">
        <motion.p className="eyebrow" {...reveal(reducedMotion)}>
          Chapter 01
        </motion.p>
        <motion.h2 className="display teaser__title" {...reveal(reducedMotion, 0.06)}>
          The first
          <br />
          drop
        </motion.h2>
        <motion.p className="teaser__copy" {...reveal(reducedMotion, 0.14)}>
          Printed t-shirts.
          <br />
          Hoodies.
          <br />
          Built for your movement.
        </motion.p>
      </div>

      <motion.div className="teaser__grid" style={reducedMotion ? undefined : { y }}>
        {PIECES.map((piece, i) => (
          <motion.figure
            key={piece.key}
            className="piece"
            {...reveal(reducedMotion, 0.08 * i)}
          >
            <span className="piece__frame">
              <img
                className="piece__img"
                src={piece.src}
                srcSet={piece.srcSet}
                sizes={SIZES}
                width={piece.width}
                height={piece.height}
                alt={piece.alt}
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </span>
            <figcaption className="piece__meta">
              <span className="piece__name">{piece.name}</span>
              <span className="piece__index">{piece.index}</span>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>

      <motion.div className="teaser__strip" {...reveal(reducedMotion, 0.1)}>
        <span>Printed t-shirts</span>
        <span aria-hidden="true">•</span>
        <span>Hoodies</span>
        <span aria-hidden="true">•</span>
        <span>More</span>
      </motion.div>
    </section>
  )
}
