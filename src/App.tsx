import { useEffect, useState } from 'react'
import { Icon, useT } from './ui'
import { useStore } from './store'
import { Goals, History, Move, Rituals, Today } from './screens'
import { Help, Onboarding, Settings } from './overlays'

const TABS = [
  { id: 'today', icon: 'today', label: 'tabToday', View: Today },
  { id: 'rituals', icon: 'rituals', label: 'tabRituals', View: Rituals },
  { id: 'goals', icon: 'goals', label: 'tabGoals', View: Goals },
  { id: 'move', icon: 'move', label: 'tabMove', View: Move },
  { id: 'history', icon: 'history', label: 'tabHistory', View: History },
] as const

export default function App() {
  const s = useStore(), t = useT()
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('today')
  const [sheet, setSheet] = useState<'help' | 'settings' | null>(null)

  useEffect(() => { document.documentElement.lang = s.lang }, [s.lang])
  useEffect(() => { window.scrollTo(0, 0) }, [tab])

  if (!s.onboarded) return <Onboarding />
  const View = TABS.find((x) => x.id === tab)!.View

  return (
    <>
      <div className="topbar">
        <button className="btn-help" onClick={() => setSheet('help')}><Icon name="help" size={20} /> {t.help}</button>
        <button className="btn-icon" onClick={() => setSheet('settings')} aria-label={t.settings}><Icon name="settings" /></button>
      </div>
      <main className="page"><View /></main>
      <nav className="tabbar" aria-label="Navigation">
        {TABS.map((x) => (
          <button key={x.id} className={tab === x.id ? 'on' : ''} onClick={() => setTab(x.id)} aria-current={tab === x.id ? 'page' : undefined}>
            <Icon name={x.icon} />
            <span>{t[x.label]}</span>
          </button>
        ))}
      </nav>
      {sheet === 'help' && <Help onClose={() => setSheet(null)} />}
      {sheet === 'settings' && <Settings onClose={() => setSheet(null)} />}
    </>
  )
}
