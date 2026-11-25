import { useSyncExternalStore } from 'react'
import { dicts, type Lang } from './i18n'

// Toutes les données restent dans le navigateur du téléphone (localStorage). Rien n'est envoyé.
export type Checkin = { mood: number; energy: number; sleep: number; note: string }
export type Goal = { id: string; title: string; steps: { id: string; text: string; done: boolean }[]; created: string }
export type Activity = { id: string; day: string; kind: string; minutes: number }
export type Contact = { id: string; name: string; phone: string }

export type State = {
  version: 1
  onboarded: boolean
  lang: Lang
  name: string
  checkins: Record<string, Checkin>
  grateful: Record<string, string[]>
  rituals: { id: string; label: string }[]
  ritualsDone: Record<string, string[]>
  goals: Goal[]
  activities: Activity[]
  contacts: Contact[]
}

const variant: string = (window as unknown as { PATNE_VARIANT?: string }).PATNE_VARIANT ?? 'lea'
const KEY = `patne.${variant}.v1`

export const uid = () => Math.random().toString(36).slice(2, 10)
export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const addDays = (d: Date, n: number) => { const c = new Date(d); c.setDate(c.getDate() + n); return c }

function guessLang(): Lang {
  // Langue du téléphone si on la propose, sinon français.
  const l = (navigator.language || 'fr').slice(0, 2)
  return (['fr', 'en', 'es', 'ht'] as Lang[]).includes(l as Lang) ? (l as Lang) : 'fr'
}

function fresh(): State {
  const lang = guessLang()
  return {
    version: 1, onboarded: false, lang, name: '',
    checkins: {}, grateful: {}, rituals: dicts[lang].defaultRituals.map((label) => ({ id: uid(), label })), ritualsDone: {},
    goals: [], activities: [], contacts: [],
  }
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...fresh(), ...JSON.parse(raw) }
  } catch { /* stockage indisponible : on repart d'un état vide */ }
  return fresh()
}

let state = load()
const listeners = new Set<() => void>()

export function setState(fn: (s: State) => State) {
  state = fn(state)
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* plein ou bloqué */ }
  listeners.forEach((l) => l())
}

export function useStore(): State {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l) }, () => state)
}

export function exportBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `patne-${dayKey()}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export async function importBackup(file: File): Promise<boolean> {
  try {
    const data = JSON.parse(await file.text())
    if (data?.version !== 1 || typeof data.checkins !== 'object') return false
    setState(() => ({ ...fresh(), ...data }))
    return true
  } catch { return false }
}

/** Demande au navigateur de ne pas effacer les données automatiquement. */
export function askPersistence() {
  navigator.storage?.persist?.().catch(() => {})
}
