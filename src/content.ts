import type { Lang } from './i18n'

// Proverbes repris de l'app iOS (Pawol.swift), avec un sens en trois langues.
export const pawol: { kreyol: string; fr: string; sens: Record<Lang, string> }[] = [
  { kreyol: 'Piti piti zwazo fè nich li.', fr: "Petit à petit, l'oiseau fait son nid.",
    sens: { fr: "Les petits gestes répétés construisent quelque chose de solide. Aujourd'hui, un seul geste suffit.",
      ht: 'Ti jès ou repete yo bati yon bagay solid. Jodi a, yon sèl jès ase.',
      en: "Small repeated gestures build something solid. Today, one gesture is enough." } },
  { kreyol: 'Men anpil, chay pa lou.', fr: "Quand les mains sont nombreuses, la charge n'est pas lourde.",
    sens: { fr: "Demander de l'aide allège. Tu n'as pas à tout porter seul·e.",
      ht: 'Mande èd fè chay la pi lejè. Ou pa oblije pote tout poukont ou.',
      en: "Asking for help lightens the load. You don't have to carry it all alone." } },
  { kreyol: 'Lespwa fè viv.', fr: "L'espoir fait vivre.",
    sens: { fr: 'Même les jours sombres passent. Quelque chose peut changer.',
      ht: 'Menm jou ki fè nwa yo pase. Yon bagay ka chanje.',
      en: 'Even dark days pass. Something can change.' } },
  { kreyol: 'Sak vid pa kanpe.', fr: 'Un sac vide ne tient pas debout.',
    sens: { fr: 'Prends soin de toi avant de donner aux autres : dormir, manger, souffler.',
      ht: 'Pran swen tèt ou anvan ou bay lòt moun : dòmi, manje, pran souf.',
      en: 'Look after yourself before giving to others: sleep, eat, breathe.' } },
  { kreyol: 'Deyè mòn gen mòn.', fr: 'Derrière les montagnes, il y a des montagnes.',
    sens: { fr: 'Les défis se suivent. Avance un pas à la fois et reprends ton souffle entre deux.',
      ht: 'Defi yo youn dèyè lòt. Avanse yon pa alafwa epi pran souf ant yo.',
      en: 'Challenges keep coming. Take one step at a time and catch your breath in between.' } },
  { kreyol: 'Sa ki pa touye ou, angrese ou.', fr: "Ce qui ne te tue pas t'engraisse.",
    sens: { fr: 'Ce qui ne te détruit pas te rend plus fort. Regarde le chemin déjà parcouru.',
      ht: 'Sa ki pa kraze w fè w vin pi fò. Gade wout ou deja fè.',
      en: "What doesn't break you makes you stronger. Look how far you've come." } },
  { kreyol: 'Tout moun se moun.', fr: 'Toute personne est une personne.',
    sens: { fr: 'Chacun·e mérite le respect, toi aussi, y compris les jours où tu doutes de toi.',
      ht: 'Chak moun merite respè, ou menm tou, menm jou ou gen dout sou tèt ou.',
      en: 'Everyone deserves respect, you too, even on days you doubt yourself.' } },
  { kreyol: 'Dousman dousman, ou rive lwen.', fr: 'Doucement, doucement, tu vas loin.',
    sens: { fr: "Pas besoin d'aller vite. Ce qui compte, c'est de continuer.",
      ht: 'Ou pa bezwen prese. Sa ki konte, se kontinye.',
      en: "No need to rush. What matters is to keep going." } },
]

export const affirmations: Record<Lang, string[]> = {
  fr: ["Je fais de mon mieux, et c'est assez.", 'Je mérite du repos et de la douceur.', "Aujourd'hui, je choisis une petite chose qui me fait du bien.",
    'Mes émotions passent, comme les nuages.', "Je suis fier·e du chemin que j'ai fait.", 'Je peux demander de l\'aide, c\'est une force.',
    "Je n'ai pas besoin d'être parfait·e pour être aimé·e.", 'Chaque jour est un nouveau départ.', 'Je respire. Je suis là. Ça va aller.',
    'Je prends soin de mon corps, il prend soin de moi.', 'Ma valeur ne dépend pas de ce que je produis.', 'Je garde la foi, un jour à la fois.'],
  ht: ['M ap fè sa m kapab, e sa ase.', 'Mwen merite repo ak dousè.', 'Jodi a, mwen chwazi yon ti bagay ki fè m byen.',
    'Emosyon m yo pase, tankou nwaj.', 'Mwen fyè de wout mwen fè.', 'Mwen ka mande èd, se yon fòs.',
    'Mwen pa bezwen pafè pou moun renmen m.', 'Chak jou se yon nouvo kòmansman.', 'Mwen respire. Mwen la. Sa pral bon.',
    'Mwen pran swen kò m, li pran swen m.', 'Valè m pa depann de sa m fè.', 'Mwen kenbe lafwa, yon jou alafwa.'],
  en: ["I'm doing my best, and that's enough.", 'I deserve rest and gentleness.', 'Today I choose one small thing that does me good.',
    'My emotions pass, like clouds.', "I'm proud of how far I've come.", 'I can ask for help; that is strength.',
    "I don't need to be perfect to be loved.", 'Every day is a new beginning.', "I breathe. I'm here. It will be okay.",
    'I take care of my body; it takes care of me.', "My worth doesn't depend on what I produce.", 'I keep the faith, one day at a time.'],
}

export const patSays: Record<Lang, string[]> = {
  fr: ['Bêê !', 'Coucou', 'Ça va ?', 'Doucement', 'Mèsi', 'Je suis là', 'Respire un coup', 'Un petit verre d\'eau ?', 'Tu comptes pour moi', 'Kenbe la !'],
  ht: ['Bêê !', 'Alo !', 'Sak pase ?', 'Dousman', 'Mèsi', 'Mwen la', 'Pran souf', 'Yon ti vè dlo ?', 'Ou konte pou mwen', 'Kenbe la !'],
  en: ['Baa!', 'Hi there', 'You okay?', 'Gently', 'Mèsi', "I'm here", 'Take a breath', 'Glass of water?', 'You matter to me', 'Kenbe la!'],
}

/** Même élément toute la journée, change chaque jour. */
export function ofTheDay<T>(arr: T[], offset = 0): T {
  const d = new Date()
  const n = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000)
  return arr[(n + offset) % arr.length]
}
