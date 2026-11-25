// De vier blokken van het playbook, zoals de Way of Working ze indeelt. Het menu, de blokletters boven de pagina's en
// de startpagina gebruiken dit. Een pagina hoort bij één blok.
export const BLOKKEN = [
  {
    id: 'A',
    titel: 'Richting',
    kern: 'Waarom we het doen en waar we ons aan houden',
    items: [
      { pad: 'waarom', titel: 'Waarom we kantelen', kern: 'Het veranderverhaal' },
      { pad: 'uitgangspunten', titel: 'Uitgangspunten', kern: 'Tien afspraken waar alles op rust', nieuw: true },
      { pad: 'model', titel: 'Het model', kern: 'Vier lagen, één stroom van waarde' },
      { pad: 'transitie', titel: 'De transitie', kern: 'De roadmap naar de nieuwe manier van werken' }
    ]
  },
  {
    id: 'B',
    titel: 'Organiseren',
    kern: 'Hoe we werk en teams inrichten',
    items: [
      { pad: 'manieren', titel: 'Manieren van werken', kern: 'Vast team of project, met de run eronder', nieuw: true },
      { pad: 'teams', titel: 'Teams en teaminrichting', kern: 'Blijvende en tijdelijke teams', nieuw: true },
      { pad: 'uitleg/waardestroom', titel: 'Waardestromen', kern: 'Van behoefte tot resultaat' },
      { pad: 'rollen', titel: 'Rollen', kern: 'Rollen in het team en eromheen, in zes groepen' },
      { pad: 'spelregels', titel: 'Spelregels', kern: 'De minimumstandaard voor de hele Groep', nieuw: true }
    ],
    promo: { titel: 'Welke vorm past bij jouw initiatief?', tekst: 'Een paar vragen, en je hebt een eerste richting: vast team of project.', knop: 'Open de keuzehulp', pad: 'manieren/keuzehulp' }
  },
  {
    id: 'C',
    titel: 'Besturen',
    kern: 'Hoe we kiezen, beslissen en samenwerken',
    items: [
      { pad: 'portfolio', titel: 'Portfolio en routes', kern: 'Van idee naar uitvoering', nieuw: true },
      { pad: 'beslissen', titel: 'Wie beslist wat?', kern: 'De beslismatrix en de mandaten' },
      { pad: 'ritme', titel: 'Ritme', kern: 'Elf events, van dagstart tot portfolio-sync' },
      { pad: 'implementatie', titel: 'Implementatie', kern: 'Teams trainen en opschalen', volgt: true },
      { pad: 'samenwerking', titel: 'Samenwerking en demarcatie', kern: 'Groep, divisie en bedrijfsonderdeel', volgt: true }
    ]
  },
  {
    id: 'D',
    titel: 'Ondersteunen',
    kern: 'Wat je nodig hebt om het te doen en te verbeteren',
    items: [
      { pad: 'doen/gereedschap', titel: 'Gereedschapskist', kern: 'Werkvormen om samen in te vullen' },
      { pad: 'hulpmiddelen', titel: 'Hulpmiddelen en systemen', kern: 'De systemen die al het werk ondersteunen', nieuw: true },
      { pad: 'templates', titel: 'Templates', kern: 'Documenten om in te vullen', nieuw: true },
      { pad: 'sturen', titel: 'Sturen en financieren', kern: 'Van strategie naar waarde, en de financiering' },
      { pad: 'verbeteren', titel: 'Continu verbeteren', kern: 'Ook de Way of Working blijft in beweging', nieuw: true },
      { pad: 'doen/dilemmas', titel: "Dilemma's", kern: 'Oefen met herkenbare situaties' },
      { pad: 'doen/teamscan', titel: 'Teamscan', kern: 'Hoe staat jullie team ervoor?' },
      { pad: 'uitleg', titel: 'Uitgelegd', kern: 'De bouwstenen en de praktijk' }
    ]
  }
];

// Eerste deel van de route → blok.
const BLOK_VAN = {
  waarom: 'A', uitgangspunten: 'A', model: 'A', transitie: 'A',
  manieren: 'B', teams: 'B', rollen: 'B', spelregels: 'B',
  portfolio: 'C', beslissen: 'C', ritme: 'C', implementatie: 'C', samenwerking: 'C',
  sturen: 'D', doen: 'D', uitleg: 'D', hulpmiddelen: 'D', templates: 'D', verbeteren: 'D'
};

export function blokVoorRoute(parts) {
  const [a, b] = parts;
  if (a === 'blok') return VERHAAL.includes(b) ? b : null;
  if (a === 'uitleg' && b === 'waardestroom') return 'B';
  return BLOK_VAN[a ?? ''] ?? null;
}
export const blokById = (id) => BLOKKEN.find((b) => b.id === id);

// Hoort deze pagina (route als tekst) bij dit menu-item? Ook onderliggende pagina's tellen mee, zoals rollen/product-owner.
export function itemActief(item, pad) {
  if (pad === item.pad) return true;
  if (item.pad === 'uitleg') return pad.startsWith('uitleg') && pad !== 'uitleg/waardestroom';
  if (item.pad === 'doen/gereedschap') return pad.startsWith('doen/gereedschap');
  return pad.startsWith(item.pad + '/');
}

// De pagina's van een blok die als één lang verhaal te lezen zijn.
export const VERHAAL = ['A', 'B'];

// Plek van een pagina in zijn blok, met de vorige en volgende pagina (de volgende kan in het volgende blok staan).
export function plekInBlok(pad) {
  const blok = BLOKKEN.find((b) => b.items.some((i) => itemActief(i, pad)));
  if (!blok) return null;
  const nr = blok.items.findIndex((i) => itemActief(i, pad));
  const volgendBlok = BLOKKEN[BLOKKEN.indexOf(blok) + 1] ?? null;
  return {
    blok,
    nr,
    totaal: blok.items.length,
    vorige: nr > 0 ? blok.items[nr - 1] : null,
    volgende: nr < blok.items.length - 1 ? blok.items[nr + 1] : null,
    volgendBlok: nr === blok.items.length - 1 ? volgendBlok : null
  };
}
