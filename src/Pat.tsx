import { useRef, useState } from 'react'
import { patSays } from './content'
import type { Lang } from './i18n'

// Pat, le kabrit : même dessin que PatBody dans l'app iOS (coordonnées relatives 0–100).
export function Pat({ size = 140, lang, label }: { size?: number; lang: Lang; label: string }) {
  const [said, setSaid] = useState('')
  const [hop, setHop] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  const poke = () => {
    const pool = patSays[lang].filter((s) => s !== said)
    setSaid(pool[Math.floor(Math.random() * pool.length)])
    setHop((h) => h + 1)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setSaid(''), 1800)
  }

  return (
    <button className="pat" style={{ width: size, height: size }} onClick={poke} aria-label={label}>
      {said && <span className="pat-bubble" role="status">{said}</span>}
      <svg key={hop} viewBox="0 0 100 100" className={hop ? 'pat-svg hop' : 'pat-svg'} aria-hidden="true">
        <defs>
          <linearGradient id="patCream" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFBF5" /><stop offset="1" stopColor="#EDE6D9" />
          </linearGradient>
          <linearGradient id="patHorn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E6CCA3" /><stop offset="1" stopColor="#C7A880" />
          </linearGradient>
          <filter id="patBlur"><feGaussianBlur stdDeviation="2" /></filter>
        </defs>
        <ellipse cx="50" cy="95" rx="31" ry="3.5" fill="#000" opacity=".08" />
        <g className="pat-body">
          <rect x="29.25" y="10" width="7.5" height="20" rx="3.75" fill="url(#patHorn)" transform="rotate(-22 33 20)" />
          <rect x="63.25" y="10" width="7.5" height="20" rx="3.75" fill="url(#patHorn)" transform="rotate(22 67 20)" />
          <ellipse cx="11" cy="44" rx="10" ry="5.5" fill="#EDCCB3" transform="rotate(24 11 44)" />
          <ellipse cx="89" cy="44" rx="10" ry="5.5" fill="#EDCCB3" transform="rotate(-24 89 44)" />
          <ellipse cx="36" cy="93" rx="8" ry="3.5" fill="#C2A68A" />
          <ellipse cx="64" cy="93" rx="8" ry="3.5" fill="#C2A68A" />
          <ellipse cx="50" cy="58" rx="37" ry="37" fill="url(#patCream)" />
          <ellipse cx="36" cy="34" rx="12" ry="6" fill="#fff" opacity=".55" filter="url(#patBlur)" />
          <ellipse cx="50" cy="79" rx="3.5" ry="5" fill="#F2EBDE" />
          <g className="pat-eyes">
            <ellipse cx="37" cy="55" rx="3.75" ry="4.75" fill="#2B2942" />
            <ellipse cx="63" cy="55" rx="3.75" ry="4.75" fill="#2B2942" />
            <circle cx="38.5" cy="53" r="1.1" fill="#fff" />
            <circle cx="64.5" cy="53" r="1.1" fill="#fff" />
          </g>
          <circle cx="27" cy="64" r="4.5" fill="#F7D9BD" opacity=".7" />
          <circle cx="73" cy="64" r="4.5" fill="#F7D9BD" opacity=".7" />
          <ellipse cx="50" cy="63" rx="3.5" ry="2.25" fill="#C7947A" />
          <path d="M45 69 Q50 72.5 55 69" stroke="#2B2942" strokeOpacity=".7" strokeWidth=".9" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </button>
  )
}
