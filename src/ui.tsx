import { useEffect, type ReactNode } from 'react'
import { useStore } from './store'
import { dicts } from './i18n'

export function useT() {
  return dicts[useStore().lang]
}

export function Card({ title, tint, children, action }: { title?: string; tint?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="card" style={tint ? { background: `var(--${tint})`, color: 'var(--on-pastel)' } : undefined}>
      {(title || action) && (
        <header className="card-head">
          {title && <h2>{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const t = useT()
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <header className="sheet-head">
          <h2>{title}</h2>
          <button className="btn-ghost" onClick={onClose}>{t.close}</button>
        </header>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  )
}

/** Visage d'humeur dessiné (identique sur Android et iPhone, contrairement aux emojis). v : 0 à 4. */
export function MoodFace({ v, size = 40 }: { v: number; size?: number }) {
  const curve = [-6, -3, 0, 4, 7][v]
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill={`var(--mood-${v})`} />
      <circle cx="14" cy="17" r="2.4" fill="#16193A" />
      <circle cx="26" cy="17" r="2.4" fill="#16193A" />
      <path d={`M12 ${27 - curve / 2} Q20 ${27 + curve} 28 ${27 - curve / 2}`} stroke="#16193A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

const paths: Record<string, ReactNode> = {
  today: <><circle cx="12" cy="12" r="4.5" /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" /></>,
  rituals: <><rect x="4" y="4" width="16" height="16" rx="5" /><path d="M8.5 12.2l2.4 2.4 4.8-5" /></>,
  goals: <><path d="M6 21V4" /><path d="M6 4.5c4-2 7 2 12 0v9c-5 2-8-2-12 0" /></>,
  move: <><circle cx="14" cy="4.5" r="2" /><path d="M10 21l2.5-6 2.5 2v4M8 11l3-3.5 3.5 1.5 2 3.5H19M12.5 15l-1.5-4" /></>,
  history: <><path d="M4 20h16" /><path d="M7 16v-4M12 16V8M17 16v-6" /></>,
  help: <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3L5.5 5.5" /></>,
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  refresh: <path d="M19 8a7.5 7.5 0 1 0 1 6M19 3.5V8h-4.5" />,
}

export function Icon({ name, size = 24 }: { name: keyof typeof paths | string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
