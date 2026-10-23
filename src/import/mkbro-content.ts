// Draft SEO content for MK Bro products: product type, specs, description and
// FAQs, built from the product name, unit and category. Everything is marked
// "draft" so the shop can review it in the admin. Facts we can't know from the
// price list (duration, height, maker) are left empty instead of guessed.

type Noise = 'none' | 'low' | 'medium' | 'loud'
type Age = 'kids' | 'family' | 'adults'

type Profile = {
  type: string // used in titles/URLs when the name doesn't already say it
  keyword: string // if the name contains this, don't repeat the type
  effect: string
  noise: Noise
  age: Age
  intro: [string, string]
  bestFor: string
  tip: string
}

const PROFILES: Record<string, Profile> = {
  'SOUND CRACKERS': {
    type: 'Sound Cracker', keyword: 'cracker', effect: 'a sharp single bang', noise: 'loud', age: 'adults',
    intro: ['a traditional one-sound cracker', 'a classic Sivakasi sound cracker'],
    bestFor: 'It is the go-to cracker for a loud start to Diwali morning, weddings and festival processions.',
    tip: 'Place it on open ground, light the wick at arm’s length and step well back.',
  },
  'CHORSA GIANT & DELUX CRACKERS': {
    type: 'String Cracker', keyword: 'cracker', effect: 'a quick run of crackling bangs', noise: 'loud', age: 'adults',
    intro: ['a string cracker from the popular Chorsa, Giant and Deluxe range', 'a bunched string cracker'],
    bestFor: 'It suits street celebrations and anyone who likes a burst of rapid sound without a long garland.',
    tip: 'Lay it flat on a clear road or open ground, away from vehicles and dry leaves.',
  },
  'GROUND CHAKKARAM': {
    type: 'Ground Chakkar', keyword: 'chakkar', effect: 'a spinning wheel of sparks on the ground', noise: 'low', age: 'kids',
    intro: ['a ground chakkar (ground spinner)', 'a favourite ground chakkar'],
    bestFor: 'Children love watching it whirl, so it is a staple in every family Diwali kit.',
    tip: 'Light it on a hard, flat floor and keep feet and loose clothing away while it spins.',
  },
  'WHEEL SERIES SPINNERS': {
    type: 'Spinner', keyword: 'spinner', effect: 'colourful spinning sparks', noise: 'low', age: 'kids',
    intro: ['a spinner from our wheel series', 'a bright spinning firework'],
    bestFor: 'It is a gentle, colourful item for kids and for filling the gaps between louder crackers.',
    tip: 'Use it on smooth, open ground; never hold it in the hand after lighting.',
  },
  'FLOWER POTS': {
    type: 'Flower Pot', keyword: 'flower pot', effect: 'a fountain of sparks rising from the ground', noise: 'low', age: 'kids',
    intro: ['a flower pot (anar) fountain', 'a Sivakasi flower pot'],
    bestFor: 'Flower pots are a must for doorstep celebrations and family photos on Diwali night.',
    tip: 'Stand it upright on level ground, light the tip and move back at least two metres.',
  },
  'COLOR MATCHES': {
    type: 'Colour Matches', keyword: 'match', effect: 'small coloured flames when struck', noise: 'none', age: 'kids',
    intro: ['a box of colour matches', 'colour-flame matchsticks'],
    bestFor: 'They are an easy, quiet favourite for younger children and for lighting other items.',
    tip: 'Strike away from the body and drop used sticks into a bucket of water or sand.',
  },
  BOMBS: {
    type: 'Bomb Cracker', keyword: 'bomb', effect: 'a powerful, deep bang', noise: 'loud', age: 'adults',
    intro: ['a high-sound bomb cracker', 'a powerful Sivakasi bomb'],
    bestFor: 'It is for adults who want the biggest bang of the night at open-ground celebrations.',
    tip: 'Use only in open spaces, light with an agarbatti (incense stick) and move far back immediately.',
  },
  'PAPER BOMBS': {
    type: 'Paper Bomb', keyword: 'bomb', effect: 'a very loud, heavy blast', noise: 'loud', age: 'adults',
    intro: ['a paper bomb', 'a heavy-duty paper bomb'],
    bestFor: 'Paper bombs are meant for experienced adults at large open grounds.',
    tip: 'Keep children and pets indoors, light with a long incense stick and stand well clear.',
  },
  'TWINKLING STARS & PENCIL': {
    type: 'Twinkling Star', keyword: 'star', effect: 'twinkling, crackling sparks', noise: 'low', age: 'kids',
    intro: ['a twinkling item from the stars and pencils range', 'a hand-friendly twinkling firework'],
    bestFor: 'It is an ideal first firework for kids, with a pretty twinkle and very little noise.',
    tip: 'Hold at arm’s length, point away from faces and drop finished sticks into water.',
  },
  ROCKETS: {
    type: 'Rocket', keyword: 'rocket', effect: 'a fast launch into the sky with a trail of sparks', noise: 'medium', age: 'adults',
    intro: ['a sky rocket', 'a Sivakasi rocket'],
    bestFor: 'Rockets bring excitement to Diwali night and New Year countdowns.',
    tip: 'Launch from an empty glass bottle on open ground, never towards buildings, trees or people.',
  },
  'WALA ITEMS': {
    type: 'Wala Garland Cracker', keyword: 'wala', effect: 'a long chain of continuous bangs', noise: 'loud', age: 'adults',
    intro: ['a wala (garland cracker)', 'a classic Sivakasi wala'],
    bestFor: 'Walas are the traditional choice for weddings, temple festivals, election wins and Diwali mornings.',
    tip: 'Unroll it fully on a clear road, light one end and keep everyone at a safe distance.',
  },
  'COLOR FOUNTAIN ITEMS': {
    type: 'Colour Fountain', keyword: 'fountain', effect: 'a burst of multi-colour sparks', noise: 'low', age: 'family',
    intro: ['a colour fountain', 'a vibrant colour fountain'],
    bestFor: 'It adds colour and wow to family celebrations without loud sound.',
    tip: 'Place it on flat ground, light the fuse and step back two to three metres.',
  },
  'SHOWER FOUNTAIN ITEMS': {
    type: 'Shower Fountain', keyword: 'fountain', effect: 'a shower of bright sparks', noise: 'low', age: 'family',
    intro: ['a shower fountain', 'a ground shower fountain'],
    bestFor: 'It is perfect for courtyards and terraces where you want a big look with gentle sound.',
    tip: 'Keep it on a stable, non-flammable surface and away from curtains and vehicles.',
  },
  'MINI COLOR FOUNTAIN ITEMS': {
    type: 'Mini Fountain', keyword: 'fountain', effect: 'playful colour sparks and fun effects', noise: 'low', age: 'kids',
    intro: ['a fun mini fountain', 'a novelty mini colour fountain'],
    bestFor: 'Its playful effects make it a hit with children of all ages.',
    tip: 'Light it on the ground and let kids enjoy it from a few steps away.',
  },
  'FANCY ITEMS': {
    type: 'Aerial Shell', keyword: 'aerial', effect: 'an aerial burst of colour in the sky', noise: 'loud', age: 'adults',
    intro: ['a fancy aerial shell', 'a single-shot fancy aerial firework'],
    bestFor: 'It gives a professional-looking sky burst for weddings, parties and Diwali night.',
    tip: 'Fire it from its tube on open ground with plenty of overhead clearance.',
  },
  'MULTI FANCY ITEMS': {
    type: 'Multi-Shot Aerial Shell', keyword: 'aerial', effect: 'several aerial bursts one after another', noise: 'loud', age: 'adults',
    intro: ['a multi-piece fancy aerial pack', 'a multi fancy aerial shell set'],
    bestFor: 'It is great value for a mini sky show at home functions.',
    tip: 'Fire each piece on open ground and wait before approaching a used tube.',
  },
  'STEP FANCY ITEMS': {
    type: 'Step Fancy Aerial Shot', keyword: 'step', effect: 'a stepped sequence of aerial bursts', noise: 'loud', age: 'adults',
    intro: ['a step fancy aerial firework', 'a multi-step aerial display'],
    bestFor: 'It builds up step by step, ideal as the highlight of a celebration.',
    tip: 'Set it on firm, level ground with a wide clear area around and above it.',
  },
  'MULTI COLOR SHOT ITEMS': {
    type: 'Multi-Colour Sky Shot', keyword: 'sky', effect: 'repeating multi-colour bursts high in the sky', noise: 'loud', age: 'adults',
    intro: ['a multi-colour sky shot', 'a repeater sky shot box'],
    bestFor: 'Sky shots are the crowd favourite for weddings, temple festivals and New Year.',
    tip: 'Place the box on flat, open ground, light the fuse and move at least 10 metres away.',
  },
  'STONE ITEMS': {
    type: 'Kids Novelty Cracker', keyword: 'cracker', effect: 'small pops and fun effects', noise: 'low', age: 'kids',
    intro: ['a kids’ favourite from our stone items range', 'a small novelty item'],
    bestFor: 'These small items keep children busy and happy all evening.',
    tip: 'Use under adult supervision and keep unused pieces in their box.',
  },
  'BIJILLI CRACKERS': {
    type: 'Bijili Cracker', keyword: 'cracker', effect: 'quick crackling bangs', noise: 'medium', age: 'family',
    intro: ['a bijili cracker', 'a traditional bijili-style cracker'],
    bestFor: 'Bijilis are a nostalgic favourite and a budget-friendly way to add sound.',
    tip: 'Light one at a time on open ground and never relight a dud.',
  },
  SPARKLERS: {
    type: 'Sparkler', keyword: 'sparkler', effect: 'bright hand-held sparks', noise: 'none', age: 'kids',
    intro: ['a hand-held sparkler (kambi mathappu)', 'a Sivakasi sparkler'],
    bestFor: 'Sparklers are the safest and most loved item for kids and family photos.',
    tip: 'Hold at arm’s length and drop finished wires into a bucket of water.',
  },
  'SPECIAL SPARKLERS': {
    type: 'Special Sparkler', keyword: 'sparkler', effect: 'rotating sparks', noise: 'none', age: 'kids',
    intro: ['a special sparkler', 'a novelty sparkler'],
    bestFor: 'It is a fun twist on regular sparklers for kids.',
    tip: 'Use outdoors, keep it pointed away from faces and cool used wires in water.',
  },
  'GIFT BOX': {
    type: 'Crackers Gift Box', keyword: 'gift box', effect: 'an assortment of sparklers, flower pots, chakkars and more', noise: 'medium', age: 'family',
    intro: ['a ready-made crackers gift box', 'an assorted Diwali gift box'],
    bestFor: 'Gift boxes are an easy, complete Diwali for a family and a popular gift for relatives, friends and staff.',
    tip: 'Read the instructions on each item and keep the box closed when not in use.',
  },
}

const FRACTIONS: Record<string, string> = { '1/2': '½', '3/4': '¾', '1/4': '¼' }
const DECIMALS: Record<string, string> = { '1/2': '.5', '3/4': '.75', '1/4': '.25' }

export type ContentInput = { no: number; name: string; unit: string; category: string }

export type ProductContent = {
  name: string
  productType: string
  slugBase: string
  size?: string
  shots?: number
  packContents: string
  effect: string
  noiseLevel: Noise
  ageGroup: Age
  description: string
  faqs: { question: string; answer: string }[]
  altText: string
}

// Nicer display: 3 1/2" → 3½", 1/4 KG → ¼ kg.
export const prettyName = (name: string) =>
  name
    .replace(/(\d+)\s+(1\/2|3\/4|1\/4)\s*"/g, (_, n, f) => `${n}${FRACTIONS[f]}"`)
    .replace(/\b(1\/2|3\/4|1\/4)\s*KG\b/gi, (_, f) => `${FRACTIONS[f]} kg`)
    .replace(/\b(\d+)\s*KG\b/gi, '$1 kg')
    .replace(/\b(\d+)\s*CM\b/gi, '$1 cm')

// URL-friendly wording: 3 1/2" → 3.5 inch, ¼ kg → quarter kg.
const seoWords = (name: string) =>
  name
    .replace(/(\d+)\s+(1\/2|3\/4|1\/4)\s*"/g, (_, n, f) => `${n}${DECIMALS[f]} inch `)
    .replace(/(\d+)\s*"/g, '$1 inch ')
    .replace(/\b1\/4\s*KG\b/gi, 'quarter kg')
    .replace(/\b1\/2\s*KG\b/gi, 'half kg')

function parseSpecs(name: string, unit: string, category: string) {
  const inch = name.match(/(\d+)(?:\s+(1\/2|3\/4|1\/4))?\s*"/)
  const cm = name.match(/(\d+)\s*cm/i)
  const kg = name.match(/\b((?:\d+\/)?\d+)\s*kg\b/i)
  const size = inch
    ? `${inch[1]}${inch[2] ? FRACTIONS[inch[2]] : ''} inch`
    : cm
      ? `${cm[1]} cm`
      : kg
        ? `${FRACTIONS[kg[1]] ?? kg[1]} kg`
        : undefined
  const shots = Number(name.match(/(\d+)\s*shot/i)?.[1]) || undefined
  const steps = Number(name.match(/(\d+)\s*step/i)?.[1]) || undefined
  const items = Number(name.match(/(\d+)\s*items/i)?.[1]) || undefined
  const wala = Number(name.match(/(\d+)\s*wala/i)?.[1]) || undefined
  const pieces = Number(name.match(/\((\d+)\s*(?:pcs|count)\)/i)?.[1] ?? name.match(/(\d+)\s*pcs/i)?.[1]) || undefined

  let packContents: string
  if (category === 'GIFT BOX' && items) packContents = `${items} assorted items in one gift box`
  else if (wala) packContents = `1 garland of ${wala.toLocaleString('en-IN')} crackers`
  else if (/pkt/i.test(unit)) packContents = pieces ? `1 packet of ${pieces} pieces` : '1 packet'
  else if (/box/i.test(unit)) packContents = pieces ? `1 box of ${pieces} pieces` : '1 box'
  else if (/^(\d+) Pcs$/.test(unit)) packContents = `${unit.split(' ')[0]} pieces`
  else packContents = pieces ? `1 pack of ${pieces} pieces` : '1 piece'

  return { size, shots, steps, wala, items, packContents }
}

const ageAnswer: Record<Age, string> = {
  kids: 'Yes, it is one of the gentler items and is popular with children, but an adult should always light it and stay close by.',
  family: 'It is suitable for the whole family to watch. An adult should light it and children should watch from a safe distance.',
  adults: 'No. This is a high-sound or aerial item meant to be handled only by adults. Children should watch from a distance, preferably indoors or behind a window.',
}

export function buildContent(input: ContentInput, index: number): ProductContent {
  const profile = PROFILES[input.category]
  if (!profile) throw new Error(`No content profile for category "${input.category}"`)

  const name = prettyName(input.name)
  const specs = parseSpecs(input.name, input.unit, input.category)
  const needsType = !name.toLowerCase().includes(profile.keyword)
  const productType = profile.type

  let effect = profile.effect
  if (specs.shots && input.category === 'MULTI COLOR SHOT ITEMS') effect = `${specs.shots} multi-colour aerial bursts in quick succession`
  if (specs.steps) effect = `a ${specs.steps}-step sequence of aerial bursts`
  if (specs.wala) effect = `${specs.wala.toLocaleString('en-IN')} continuous bangs`
  const colour = name.match(/\b(red|green|gold|electric|colou?r)\b/i)?.[1]?.toLowerCase()
  if (colour && input.category.includes('SPARKLERS')) {
    effect = colour === 'electric' ? 'bright silver-white sparks' : colour.startsWith('col') ? 'multi-colour sparks' : `${colour} sparks`
  }

  const v = index % 2
  const typeLower = productType.toLowerCase()
  const sizeText = specs.size ? ` in the ${specs.size} size` : ''
  const sentences = [
    v === 0
      ? `${name} is ${profile.intro[0]}${sizeText}, supplied direct from Sivakasi.`
      : `Looking for a reliable ${typeLower}? ${name} is ${profile.intro[1]}${sizeText}, packed carefully and delivered to your door.`,
    `You get ${specs.packContents}, and it gives ${effect}.`,
    profile.bestFor,
    `Safety tip: ${profile.tip}`,
    v === 0
      ? 'Add it to your estimate or tap “Buy now on WhatsApp” and we will confirm stock, transport and delivery by phone.'
      : 'Order it with the rest of your Diwali list on the price list page, or message us on WhatsApp to buy it directly.',
  ]

  const faqs = [
    { question: `What do I get in one pack of ${name}?`, answer: `One quantity is ${specs.packContents}.` },
    { question: `Is ${name} safe for kids?`, answer: ageAnswer[profile.age] },
    { question: `How should I light ${name}?`, answer: profile.tip },
    {
      question: `How do I buy ${name} online?`,
      answer: 'Add it to your cart and send the estimate, or tap “Buy now on WhatsApp”. We call you to confirm stock, transport charges and payment before dispatch.',
    },
  ]

  return {
    name,
    productType,
    slugBase: `${seoWords(input.name)} ${needsType ? productType : ''}`.trim(),
    size: specs.size,
    shots: specs.shots,
    packContents: specs.packContents,
    effect,
    noiseLevel: profile.noise,
    ageGroup: profile.age,
    description: sentences.join(' '),
    faqs,
    altText: `${name}${needsType ? ` ${typeLower}` : ''}, ${specs.packContents}`,
  }
}
