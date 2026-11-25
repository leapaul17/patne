import { useEffect, useRef, useState } from 'react'
import { Card, Icon, Sheet, useT } from './ui'
import { Pat } from './Pat'
import { askPersistence, exportBackup, importBackup, setState, uid, useStore } from './store'
import { dicts, langNames, type Lang } from './i18n'

const variant = (window as unknown as { PATNE_VARIANT?: string }).PATNE_VARIANT ?? 'lea'

// Numéros selon le pays : République dominicaine pour la version de maman, France pour Léa.
const LINES = variant === 'manman'
  ? { emergency: '911', mental: '*462' }
  : { emergency: '112', mental: '3114' }

/* ───────── Aide ───────── */

export function Help({ onClose }: { onClose: () => void }) {
  const s = useStore(), t = useT()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const add = () => {
    if (!name.trim() || !phone.trim()) return
    setState((st) => ({ ...st, contacts: [...st.contacts, { id: uid(), name: name.trim(), phone: phone.trim() }] }))
    setName(''); setPhone('')
  }
  return (
    <Sheet title={t.helpTitle} onClose={onClose}>
      <p className="lead">{t.helpIntro}</p>
      <div className="call-grid">
        <a className="call-btn danger" href={`tel:${LINES.emergency}`}><Icon name="phone" /> <span>{t.emergency}<strong>{LINES.emergency}</strong></span></a>
        <a className="call-btn" href={`tel:${encodeURIComponent(LINES.mental)}`}><Icon name="phone" /> <span>{t.mentalLine}<strong>{LINES.mental}</strong></span></a>
      </div>

      <h3>{t.myPeople}</h3>
      <ul className="list">
        {s.contacts.map((c) => (
          <li key={c.id}>
            <span className="grow"><strong>{c.name}</strong><br /><small className="muted">{c.phone}</small></span>
            <a className="btn-icon solid" href={`tel:${c.phone.replace(/[^\d+*#]/g, '')}`} aria-label={`${t.call} ${c.name}`}><Icon name="phone" size={20} /></a>
            <button className="btn-icon subtle" aria-label={`${t.delete} : ${c.name}`}
              onClick={() => setState((st) => ({ ...st, contacts: st.contacts.filter((x) => x.id !== c.id) }))}><Icon name="trash" size={16} /></button>
          </li>
        ))}
      </ul>
      <form className="contact-form" onSubmit={(e) => { e.preventDefault(); add() }}>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.contactName} aria-label={t.contactName} />
        <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.contactPhone} aria-label={t.contactPhone} inputMode="tel" />
        <button className="btn-secondary" type="submit"><Icon name="plus" size={18} /> {t.addContact}</button>
      </form>

      <h3>{t.breathe}</h3>
      <Breathe />
    </Sheet>
  )
}

/** Respiration 4-4-6 guidée par un cercle qui grandit et rétrécit. */
function Breathe() {
  const t = useT(), s = useStore()
  const [on, setOn] = useState(false)
  const [phase, setPhase] = useState(0)
  const phases = [{ label: t.breatheIn, sec: 4, scale: 1 }, { label: t.breatheHold, sec: 4, scale: 1 }, { label: t.breatheOut, sec: 6, scale: 0.55 }]
  useEffect(() => {
    if (!on) return
    const id = window.setTimeout(() => setPhase((p) => (p + 1) % 3), phases[phase].sec * 1000)
    return () => window.clearTimeout(id)
  }, [on, phase]) // eslint-disable-line react-hooks/exhaustive-deps
  const cur = phases[phase]
  return (
    <div className="breathe">
      <div className="breathe-circle" style={{ transform: `scale(${on ? cur.scale : 0.55})`, transitionDuration: `${on ? cur.sec : 0.6}s` }}>
        <Pat size={90} lang={s.lang} label={t.breathe} />
      </div>
      <p className="breathe-label" aria-live="polite">{on ? cur.label : ' '}</p>
      <button className="btn-secondary" onClick={() => { setPhase(0); setOn(!on) }}>{on ? t.stop : t.start}</button>
    </div>
  )
}

/* ───────── Réglages ───────── */

type InstallEvent = Event & { prompt: () => Promise<void> }
let deferredInstall: InstallEvent | null = null
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e as InstallEvent })

export function Settings({ onClose }: { onClose: () => void }) {
  const s = useStore(), t = useT()
  const [msg, setMsg] = useState('')
  const file = useRef<HTMLInputElement>(null)
  const [canInstall, setCanInstall] = useState(!!deferredInstall)
  useEffect(() => {
    const h = () => setCanInstall(true)
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])

  return (
    <Sheet title={t.settings} onClose={onClose}>
      <h3>{t.language}</h3>
      <LangPicker />
      <h3>{t.yourName}</h3>
      <input className="input" value={s.name} onChange={(e) => setState((st) => ({ ...st, name: e.target.value }))} aria-label={t.yourName} />

      <h3>{t.installTitle}</h3>
      {canInstall && (
        <button className="btn-primary" onClick={async () => { await deferredInstall?.prompt(); deferredInstall = null; setCanInstall(false) }}>{t.installBtn}</button>
      )}
      <p className="muted">{t.installAndroid}</p>
      <p className="muted">{t.installIos}</p>

      <h3>{t.backup}</h3>
      <p className="muted">{t.backupHint}</p>
      <div className="stack">
        <button className="btn-secondary" onClick={exportBackup}>{t.exportBtn}</button>
        <button className="btn-secondary" onClick={() => file.current?.click()}>{t.importBtn}</button>
        <input ref={file} type="file" accept="application/json,.json" hidden onChange={async (e) => {
          const f = e.target.files?.[0]; if (!f) return
          setMsg((await importBackup(f)) ? t.importOk : t.importErr)
          e.target.value = ''
        }} />
        {msg && <p role="status">{msg}</p>}
      </div>
    </Sheet>
  )
}

function LangPicker({ onPick }: { onPick?: (l: Lang) => void }) {
  const s = useStore()
  return (
    <div className="chips" role="radiogroup">
      {(Object.keys(langNames) as Lang[]).map((l) => (
        <button key={l} role="radio" aria-checked={s.lang === l} className={`chip ${s.lang === l ? 'on' : ''}`}
          onClick={() => { setState((st) => ({ ...st, lang: l })); onPick?.(l) }}>{langNames[l]}</button>
      ))}
    </div>
  )
}

/* ───────── Bandeau « garder mes données » ───────── */

const standalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true
// Navigateurs intégrés (WhatsApp, Instagram, Facebook…) : leur stockage est jetable.
const inAppBrowser = () => /FBAN|FBAV|Instagram|WhatsApp|Line\/|Snapchat|musical_ly|TikTok|; wv\)/i.test(navigator.userAgent)

export function KeepBanner() {
  const t = useT()
  const [hidden, setHidden] = useState(() => { try { return sessionStorage.getItem('patne.banner') === '1' } catch { return false } })
  const [canInstall, setCanInstall] = useState(!!deferredInstall)
  useEffect(() => {
    const h = () => setCanInstall(true)
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])
  if (standalone()) return null
  const inApp = inAppBrowser()
  if (hidden && !inApp) return null
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent)
  return (
    <div className={`keep-banner ${inApp ? 'warn' : ''}`} role="status">
      <p>{inApp ? t.bannerInApp : t.bannerInstall}</p>
      {!inApp && <p className="small">{ios ? t.installIos : t.installAndroid}</p>}
      <div className="keep-actions">
        {!inApp && canInstall && (
          <button className="btn-primary" onClick={async () => { await deferredInstall?.prompt(); deferredInstall = null; setCanInstall(false) }}>{t.installBtn}</button>
        )}
        {!inApp && (
          <button className="btn-ghost" onClick={() => { try { sessionStorage.setItem('patne.banner', '1') } catch { /* ignore */ } setHidden(true) }}>{t.bannerHide}</button>
        )}
      </div>
    </div>
  )
}

/* ───────── Premier lancement ───────── */

export function Onboarding() {
  const s = useStore(), t = useT()
  return (
    <main className="onboarding">
      <KeepBanner />
      <Pat size={170} lang={s.lang} label={t.patIntro} />
      <h1>{t.welcome}</h1>
      <p className="lead">{t.welcomeText}</p>
      <Card>
        <p className="legend">{t.pickLang}</p>
        {/* Les rituels par défaut suivent la langue choisie tant que rien n'a été coché. */}
        <LangPicker onPick={(l) => setState((st) => ({ ...st, rituals: dicts[l].defaultRituals.map((label) => ({ id: uid(), label })) }))} />
        <input className="input" value={s.name} placeholder={t.namePh} aria-label={t.yourName}
          onChange={(e) => setState((st) => ({ ...st, name: e.target.value }))} />
      </Card>
      <p className="muted small">{t.privacy}</p>
      <button className="btn-primary wide" onClick={() => { askPersistence(); setState((st) => ({ ...st, onboarded: true })) }}>{t.letsGo}</button>
    </main>
  )
}
