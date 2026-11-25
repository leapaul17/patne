import { useState } from 'react'
import { Card, Icon, MoodFace, Sheet, useT } from './ui'
import { Pat } from './Pat'
import { addDays, dayKey, setState, uid, useStore, type Checkin, type Goal } from './store'
import { affirmations, ofTheDay, pawol } from './content'

const today = () => dayKey()

/* ───────── Aujourd'hui ───────── */

export function Today() {
  const s = useStore(), t = useT()
  const [affOffset, setAffOffset] = useState(0)
  const h = new Date().getHours()
  const p = ofTheDay(pawol)
  const dateLabel = new Date().toLocaleDateString(s.lang === 'ht' ? 'fr' : s.lang, { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">{dateLabel}</p>
        <h1>{h >= 17 ? t.goodEvening : t.hello}{s.name ? `, ${s.name}` : ''}</h1>
      </header>

      <div className="pat-row">
        <Pat lang={s.lang} label={t.patIntro} />
        <p className="pat-intro">{t.patIntro}</p>
      </div>

      <CheckinCard />
      <GratefulCard />

      <Card title={t.affirmTitle} tint="lilac"
        action={<button className="btn-icon" onClick={() => setAffOffset((o) => o + 1)} aria-label={t.another}><Icon name="refresh" size={20} /></button>}>
        <p className="quote">{ofTheDay(affirmations[s.lang], affOffset)}</p>
      </Card>

      <Card title={t.pawolTitle} tint="peach">
        <p className="quote">{p.kreyol}</p>
        {s.lang === 'fr' && <p className="muted-on-pastel">{p.fr}</p>}
        <p>{p.sens[s.lang]}</p>
      </Card>
    </>
  )
}

function CheckinCard() {
  const s = useStore(), t = useT()
  const saved = s.checkins[today()]
  const [editing, setEditing] = useState(!saved)
  const [draft, setDraft] = useState<Checkin>(saved ?? { mood: 2, energy: 2, sleep: 7, note: '' })

  if (saved && !editing) {
    return (
      <Card title={t.checkinDone} tint="mint" action={<button className="btn-ghost on-pastel" onClick={() => { setDraft(saved); setEditing(true) }}>{t.checkinEdit}</button>}>
        <div className="checkin-summary">
          <MoodFace v={saved.mood} size={48} />
          <div>
            <p><strong>{t.mood} :</strong> {t.moods[saved.mood]}</p>
            <p><strong>{t.energy} :</strong> {t.energies[saved.energy]} · <strong>{t.sleep} :</strong> {saved.sleep}{t.hours}</p>
            {saved.note && <p className="note">« {saved.note} »</p>}
          </div>
        </div>
      </Card>
    )
  }

  const save = () => {
    setState((st) => ({ ...st, checkins: { ...st.checkins, [today()]: { ...draft, note: draft.note.trim() } } }))
    setEditing(false)
  }

  return (
    <Card title={t.checkinTitle}>
      <fieldset className="field">
        <legend>{t.mood}</legend>
        <div className="mood-row">
          {[0, 1, 2, 3, 4].map((v) => (
            <button key={v} className={`mood-btn ${draft.mood === v ? 'on' : ''}`} onClick={() => setDraft({ ...draft, mood: v })}
              aria-pressed={draft.mood === v} aria-label={t.moods[v]}>
              <MoodFace v={v} size={44} />
              <span>{t.moods[v]}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>{t.energy} : <strong>{t.energies[draft.energy]}</strong></legend>
        <div className="seg">
          {[0, 1, 2, 3, 4].map((v) => (
            <button key={v} className={draft.energy >= v ? 'on' : ''} onClick={() => setDraft({ ...draft, energy: v })}
              aria-pressed={draft.energy === v} aria-label={t.energies[v]} />
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>{t.sleep}</legend>
        <div className="stepper">
          <button onClick={() => setDraft({ ...draft, sleep: Math.max(0, draft.sleep - 0.5) })} aria-label="−">−</button>
          <output>{draft.sleep}{t.hours}</output>
          <button onClick={() => setDraft({ ...draft, sleep: Math.min(16, draft.sleep + 0.5) })} aria-label="+">+</button>
        </div>
      </fieldset>

      <label className="field">
        <span className="legend">{t.note}</span>
        <textarea rows={2} value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} />
      </label>

      <button className="btn-primary" onClick={save}>{t.save}</button>
    </Card>
  )
}

function GratefulCard() {
  const s = useStore(), t = useT()
  const items = s.grateful[today()] ?? ['', '', '']
  const set = (i: number, v: string) => {
    const next = [...items]; next[i] = v
    setState((st) => ({ ...st, grateful: { ...st.grateful, [today()]: next } }))
  }
  return (
    <Card title={t.gratefulTitle} tint="sky">
      <div className="stack">
        {items.map((v, i) => (
          <input key={i} className="input on-pastel" value={v} placeholder={t.gratefulPh} onChange={(e) => set(i, e.target.value)}
            aria-label={`${t.gratefulTitle} ${i + 1}`} />
        ))}
      </div>
    </Card>
  )
}

/* ───────── Rituels ───────── */

function streak(done: Record<string, string[]>) {
  let n = 0, d = new Date()
  if (!done[dayKey(d)]?.length) d = addDays(d, -1) // aujourd'hui pas encore fait : on compte jusqu'à hier
  while (done[dayKey(d)]?.length) { n++; d = addDays(d, -1) }
  return n
}

export function Rituals() {
  const s = useStore(), t = useT()
  const [label, setLabel] = useState('')
  const done = s.ritualsDone[today()] ?? []
  const toggle = (id: string) => setState((st) => {
    const cur = st.ritualsDone[today()] ?? []
    return { ...st, ritualsDone: { ...st.ritualsDone, [today()]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] } }
  })
  const add = () => {
    if (!label.trim()) return
    setState((st) => ({ ...st, rituals: [...st.rituals, { id: uid(), label: label.trim() }] }))
    setLabel('')
  }
  const remove = (id: string) => setState((st) => ({ ...st, rituals: st.rituals.filter((r) => r.id !== id) }))
  const n = streak(s.ritualsDone)
  const allDone = s.rituals.length > 0 && s.rituals.every((r) => done.includes(r.id))

  return (
    <>
      <header className="page-head"><h1>{t.ritualsTitle}</h1><p className="muted">{t.ritualsHint}</p></header>
      {n > 0 && <div className="pill-banner">🔥 {n} {t.streak}</div>}
      {allDone && <div className="pill-banner ok">{t.ritualsAllDone}</div>}
      <Card>
        <ul className="checklist">
          {s.rituals.map((r) => (
            <li key={r.id}>
              <button className={`check ${done.includes(r.id) ? 'on' : ''}`} onClick={() => toggle(r.id)} aria-pressed={done.includes(r.id)}>
                <span className="box">{done.includes(r.id) && <Icon name="check" size={18} />}</span>
                <span>{r.label}</span>
              </button>
              <button className="btn-icon subtle" onClick={() => remove(r.id)} aria-label={`${t.delete} : ${r.label}`}><Icon name="trash" size={18} /></button>
            </li>
          ))}
        </ul>
        <form className="add-row" onSubmit={(e) => { e.preventDefault(); add() }}>
          <input className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder={t.newRitual} aria-label={t.newRitual} />
          <button className="btn-icon solid" type="submit" aria-label={t.add}><Icon name="plus" size={20} /></button>
        </form>
      </Card>
    </>
  )
}

/* ───────── Objectifs ───────── */

export function Goals() {
  const s = useStore(), t = useT()
  const [title, setTitle] = useState('')
  const tip = ofTheDay(t.tips)
  const add = () => {
    if (!title.trim()) return
    setState((st) => ({ ...st, goals: [{ id: uid(), title: title.trim(), steps: [], created: today() }, ...st.goals] }))
    setTitle('')
  }
  return (
    <>
      <header className="page-head"><h1>{t.goalsTitle}</h1></header>
      <Card title={`${t.tipTitle} : ${tip[0]}`} tint="butter"><p>{tip[1]}</p></Card>
      <form className="add-row card" onSubmit={(e) => { e.preventDefault(); add() }}>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.goalPh} aria-label={t.newGoal} />
        <button className="btn-icon solid" type="submit" aria-label={t.add}><Icon name="plus" size={20} /></button>
      </form>
      {s.goals.length === 0 && <p className="empty">{t.goalsEmpty}</p>}
      {s.goals.map((g) => <GoalCard key={g.id} id={g.id} />)}
    </>
  )
}

function GoalCard({ id }: { id: string }) {
  const s = useStore(), t = useT()
  const g = s.goals.find((x) => x.id === id)!
  const [step, setStep] = useState('')
  const update = (fn: (g: Goal) => Goal) =>
    setState((st) => ({ ...st, goals: st.goals.map((x) => (x.id === id ? fn(x) : x)) }))
  const doneN = g.steps.filter((x) => x.done).length
  const pct = g.steps.length ? Math.round((doneN / g.steps.length) * 100) : 0

  return (
    <Card title={g.title}
      action={<button className="btn-icon subtle" onClick={() => setState((st) => ({ ...st, goals: st.goals.filter((x) => x.id !== id) }))}
        aria-label={`${t.delete} : ${g.title}`}><Icon name="trash" size={18} /></button>}>
      {g.steps.length > 0 && (
        <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div style={{ width: `${pct}%` }} />
        </div>
      )}
      <ul className="checklist">
        {g.steps.map((st) => (
          <li key={st.id}>
            <button className={`check ${st.done ? 'on' : ''}`} aria-pressed={st.done}
              onClick={() => update((x) => ({ ...x, steps: x.steps.map((y) => (y.id === st.id ? { ...y, done: !y.done } : y)) }))}>
              <span className="box">{st.done && <Icon name="check" size={18} />}</span>
              <span>{st.text}</span>
            </button>
            <button className="btn-icon subtle" aria-label={`${t.delete} : ${st.text}`}
              onClick={() => update((x) => ({ ...x, steps: x.steps.filter((y) => y.id !== st.id) }))}><Icon name="trash" size={16} /></button>
          </li>
        ))}
      </ul>
      <form className="add-row" onSubmit={(e) => {
        e.preventDefault()
        if (!step.trim()) return
        update((x) => ({ ...x, steps: [...x.steps, { id: uid(), text: step.trim(), done: false }] }))
        setStep('')
      }}>
        <input className="input" value={step} onChange={(e) => setStep(e.target.value)} placeholder={t.stepPh} aria-label={t.addStep} />
        <button className="btn-icon" type="submit" aria-label={t.addStep}><Icon name="plus" size={20} /></button>
      </form>
    </Card>
  )
}

/* ───────── Bouger ───────── */

const KINDS = ['walk', 'dance', 'garden', 'house', 'stretch', 'bike', 'swim', 'other'] as const
const KIND_EMOJI: Record<string, string> = { walk: '🚶🏾‍♀️', dance: '💃🏾', garden: '🌱', house: '🧹', stretch: '🧘🏾‍♀️', bike: '🚲', swim: '🏊🏾‍♀️', other: '✨' }

function weekStart(d = new Date()) {
  const c = new Date(d); c.setHours(0, 0, 0, 0)
  c.setDate(c.getDate() - ((c.getDay() + 6) % 7)) // lundi
  return c
}

export function Move() {
  const s = useStore(), t = useT()
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<string>('walk')
  const [minutes, setMinutes] = useState(20)
  const [cheer, setCheer] = useState('')
  const start = dayKey(weekStart())
  const week = s.activities.filter((a) => a.day >= start).sort((a, b) => (a.day < b.day ? 1 : -1))
  const total = week.reduce((n, a) => n + a.minutes, 0)
  const pct = Math.min(1, total / 150)
  const r = 52, c = 2 * Math.PI * r

  const save = () => {
    setState((st) => ({ ...st, activities: [...st.activities, { id: uid(), day: today(), kind, minutes }] }))
    setOpen(false)
    setCheer(t.moveCheer[Math.floor(Math.random() * t.moveCheer.length)])
  }

  return (
    <>
      <header className="page-head"><h1>{t.moveTitle}</h1></header>
      <Card tint="mint">
        <div className="ring-wrap">
          <svg viewBox="0 0 120 120" width="132" height="132" aria-hidden="true">
            <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(22,25,58,.12)" strokeWidth="12" />
            <circle cx="60" cy="60" r={r} fill="none" stroke="var(--accent-fixed)" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 60 60)" />
          </svg>
          <div>
            <p className="eyebrow on-pastel">{t.moveWeek}</p>
            <p className="big-number">{total} <small>{t.minutes}</small></p>
            <p className="muted-on-pastel">{t.moveGoal}</p>
          </div>
        </div>
        {cheer && <p className="cheer" role="status">{cheer}</p>}
      </Card>
      <button className="btn-primary wide" onClick={() => setOpen(true)}><Icon name="plus" size={20} /> {t.logActivity}</button>
      {week.length === 0 ? <p className="empty">{t.moveEmpty}</p> : (
        <Card>
          <ul className="list">
            {week.map((a) => (
              <li key={a.id}>
                <span className="emoji" aria-hidden="true">{KIND_EMOJI[a.kind]}</span>
                <span className="grow">{t.activities[a.kind as keyof typeof t.activities]}<br />
                  <small className="muted">{new Date(a.day + 'T12:00').toLocaleDateString(s.lang === 'ht' ? 'fr' : s.lang, { weekday: 'long' })}</small></span>
                <strong>{a.minutes} {t.minutes}</strong>
                <button className="btn-icon subtle" aria-label={t.delete}
                  onClick={() => setState((st) => ({ ...st, activities: st.activities.filter((x) => x.id !== a.id) }))}><Icon name="trash" size={16} /></button>
              </li>
            ))}
          </ul>
        </Card>
      )}
      {open && (
        <Sheet title={t.logActivity} onClose={() => setOpen(false)}>
          <p className="legend">{t.whichActivity}</p>
          <div className="kind-grid">
            {KINDS.map((k) => (
              <button key={k} className={`kind ${kind === k ? 'on' : ''}`} onClick={() => setKind(k)} aria-pressed={kind === k}>
                <span className="emoji" aria-hidden="true">{KIND_EMOJI[k]}</span>{t.activities[k]}
              </button>
            ))}
          </div>
          <p className="legend">{t.howLong}</p>
          <div className="chips">
            {[10, 15, 20, 30, 45, 60, 90].map((m) => (
              <button key={m} className={`chip ${minutes === m ? 'on' : ''}`} onClick={() => setMinutes(m)} aria-pressed={minutes === m}>{m} {t.minutes}</button>
            ))}
          </div>
          <button className="btn-primary wide" onClick={save}>{t.save}</button>
        </Sheet>
      )}
    </>
  )
}

/* ───────── Historique ───────── */

export function History() {
  const s = useStore(), t = useT()
  const days = Array.from({ length: 14 }, (_, i) => dayKey(addDays(new Date(), i - 13)))
  const pts = days.map((d) => s.checkins[d]?.mood)
  const W = 300, H = 120, step = W / 13
  const y = (v: number) => H - 14 - (v / 4) * (H - 28)
  const line = pts.map((v, i) => (v === undefined ? null : `${i * step},${y(v)}`)).filter(Boolean)
  const month = dayKey().slice(0, 7)
  const nCheck = Object.keys(s.checkins).filter((d) => d.startsWith(month)).length
  const nRit = Object.entries(s.ritualsDone).filter(([d]) => d.startsWith(month)).reduce((n, [, v]) => n + v.length, 0)
  const nMin = s.activities.filter((a) => a.day.startsWith(month)).reduce((n, a) => n + a.minutes, 0)
  const recent = Object.entries(s.checkins).sort(([a], [b]) => (a < b ? 1 : -1)).slice(0, 10)
  const fmt = (d: string) => new Date(d + 'T12:00').toLocaleDateString(s.lang === 'ht' ? 'fr' : s.lang, { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <>
      <header className="page-head"><h1>{t.historyTitle}</h1></header>
      <div className="stats">
        <div><strong>{nCheck}</strong><span>{t.checkins}</span></div>
        <div><strong>{nRit}</strong><span>{t.ritualsDone}</span></div>
        <div><strong>{nMin}</strong><span>{t.minutesMoved}</span></div>
      </div>
      <Card title={t.last14}>
        {line.length === 0 ? <p className="muted">{t.noData}</p> : (
          <svg viewBox={`-10 0 ${W + 20} ${H}`} className="chart" role="img" aria-label={t.last14}>
            {[0, 2, 4].map((v) => <line key={v} x1="0" x2={W} y1={y(v)} y2={y(v)} className="gridline" />)}
            {line.length > 1 && <polyline points={line.join(' ')} className="chart-line" />}
            {pts.map((v, i) => v === undefined ? null : (
              <circle key={i} cx={i * step} cy={y(v)} r="6" fill={`var(--mood-${v})`} stroke="var(--card)" strokeWidth="2">
                <title>{fmt(days[i])} : {t.moods[v]}</title>
              </circle>
            ))}
          </svg>
        )}
      </Card>
      {recent.length > 0 && (
        <Card title={t.recentNotes}>
          <ul className="list">
            {recent.map(([d, c]) => (
              <li key={d}>
                <MoodFace v={c.mood} size={32} />
                <span className="grow"><strong>{fmt(d)}</strong> · {t.moods[c.mood]}
                  {c.note && <><br /><small className="muted">{c.note}</small></>}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}
