# Sitemap — Playbook Digitaal Operating Model

> Status: concept v0.1 · generiek uitgewerkt, organisatiespecifieke content volgt later
> Basis: SAFe als uitgangspunt, met ruimte voor eigen invulling en terminologie

## Ontwerpprincipes achter de structuur

1. **Drie sporen, één anker.** Alles hangt aan de interactieve *modelkaart*. De navigatie volgt de drie lagen
   uit de sparsessie: **Begrijpen → Vinden → Doen**, met **Naslag** als vangnet.
2. **Rol als filter, niet als silo.** De gekozen rol bepaalt de volgorde en de accenten ("jouw top 5"). Alle content blijft voor iedereen bereikbaar.
3. **Elke pagina heeft drie diepten:** *kern* (1 zin) → *samenvatting* (30 sec) → *verdieping* (uitklapbaar).
4. **Eigen woorden boven SAFe-jargon.** Waar we een SAFe-term gebruiken tonen we de originele term erbij, plus hoe wíj het doen.
5. **Max. 3 klikken** van de startpagina naar elk onderwerp. Elke pagina heeft een deep link (`#/rollen/product-owner`).

---

## Structuur op hoofdlijnen

```
Start
├── BEGRIJPEN
│   ├── 1. Waarom we kantelen
│   └── 2. Het model
├── VINDEN
│   ├── 3. Rollen
│   ├── 4. Ritme
│   └── 5. Sturen & financieren
├── DOEN
│   ├── 6. Werkwijzen & toolkit
│   ├── 7. Aan de slag
│   └── 8. De transitie
└── NASLAG
    └── 9. Woordenlijst · FAQ · Zoeken · Wat is nieuw
```

Hoofdnavigatie (desktop): `Waarom · Model · Rollen · Ritme · Sturen · Toolkit · Aan de slag` + zoekicoon (⌘K) + rolwissel.
Mobiel: onderbalk met `Start · Model · Mijn route · Zoeken`.

---

## Volledige sitemap

### 0. Start `#/`
| Blok | Inhoud | Interactie |
|---|---|---|
| Hero | Belofte in één zin + korte animatie *van project naar product* | Scroll-animatie |
| **Kies je rol** | 7 rolkaarten (zie §3) | Keuze wordt lokaal onthouden en is altijd te wijzigen |
| Jouw top 5 | Persoonlijke route op basis van de rol | Voortgangsindicator |
| Modelkaart-teaser | Mini-versie van de kaart | Klik → §2 |
| Wat is nieuw | Laatste 3 wijzigingen | Link naar changelog |
| Snelle ingangen | "Wie beslist wat?", "Ons ritme", "Woordenlijst" | — |

### 1. Waarom we kantelen `#/waarom`
| Pagina | Doel | Visual / interactie |
|---|---|---|
| 1.1 Het verhaal | Waarom nu, wat willen we bereiken, wat het oplevert voor collega's, klanten en de divisie | Scrollverhaal (scrollytelling) |
| 1.2 **Van project naar product** | De kernverschuiving, per dimensie | **Van→Naar-slider** (financiering, sturing, team, planning, succes, eigenaarschap) |
| 1.3 Wat verandert er (niet) | Geruststelling: wat blijft hetzelfde | Twee kolommen *verandert / blijft* |
| 1.4 Mythes & feiten | Weerstand en misverstanden adresseren | Flipkaarten |
| 1.5 Onze principes | De lean-agile principes in eigen woorden (SAFe-principes als basis) | Principekaarten met voorbeeld |

### 2. Het model `#/model`
| Pagina | Doel | Visual / interactie |
|---|---|---|
| 2.0 **Modelkaart** | Het hele operating model in één beeld | **Zoombare kaart**: Portfolio → Waardestromen → Productgroepen (ART) → Productteams |
| 2.1 Portfolio | Strategie, epics, budgetten op het hoogste niveau | Laag-pagina |
| 2.2 Waardestromen | Hoe waarde naar klant en collega stroomt; operationele vs. digitale waardestroom | Stroomdiagram |
| 2.3 Productgroepen *(SAFe: Agile Release Train)* | Teams van teams rond een waardestroom | Laag-pagina + teamopstelling |
| 2.4 Productteams | Samenstelling, autonomie, verantwoordelijkheid | Teamanatomie-visual |
| 2.5 Wat is een product? | Productdefinitie, producttypen, productportfolio | Beslisboom "is dit een product?" |
| 2.6 Hoe de divisies aansluiten | Rol van divisies en digital leads in het model | Kaart met divisies als laag |

### 3. Rollen `#/rollen`
| Pagina | SAFe-basis | Notitie |
|---|---|---|
| 3.0 Rollenoverzicht | — | Alle rollen op de modelkaart gepositioneerd |
| 3.1 Digital Lead (divisie) | Business Owner / Epic Owner (deels) | Primaire doelgroep |
| 3.2 Product Manager | Product Management | Productgroepniveau |
| 3.3 Product Owner | Product Owner | Teamniveau |
| 3.4 Team Coach / Scrum Master | Scrum Master / Team Coach | |
| 3.5 Productgroep-coach | Release Train Engineer (RTE) | Eigen naam nader te bepalen |
| 3.6 Architect | System / Enterprise Architect | |
| 3.7 Teamlid | Agile Team member | Ontwikkelaar, data, UX, test, ops, … |
| 3.8 Business stakeholder | Business Owner / klant | Vanuit de operatie van de divisie |
| 3.9 **Wie beslist wat?** | — | **Interactieve beslismatrix** (filter op rol of besluit) |
| 3.10 Samenwerking tussen rollen | — | Interactiediagram: klik op een rol en zie de verbindingen |

### 4. Ritme `#/ritme`
| Pagina | Doel | Visual / interactie |
|---|---|---|
| 4.0 **Ritme-wiel** | Alle cadansen in één beeld: iteratie (2 wk) · planningsinterval (kwartaal) · portfolio | **Concentrisch wiel**, klik op een event |
| 4.1 Iteratieplanning | Event-pagina | |
| 4.2 Daily stand-up | Event-pagina | |
| 4.3 Iteratie-review | Event-pagina | |
| 4.4 Retrospective | Event-pagina | |
| 4.5 Backlog refinement | Event-pagina | |
| 4.6 **PI-planning** *(kwartaalplanning)* | Event-pagina, uitgebreid | Agenda-tijdlijn over 2 dagen |
| 4.7 Systeemdemo | Event-pagina | |
| 4.8 Inspect & Adapt | Event-pagina | |
| 4.9 Portfolio-sync / strategisch overleg | Event-pagina | |
| 4.10 Mijn agenda | Welke events zijn er voor jouw rol, met tijdsbesteding | Gefilterde kalender + "uren per kwartaal" |

### 5. Sturen & financieren `#/sturen`
| Pagina | Doel | Visual / interactie |
|---|---|---|
| 5.1 Van projectbudget naar productbudget | Lean budgets, guardrails | Vergelijkingsvisual |
| 5.2 Epics & de portfolio-kanban | Hoe een groot idee door het systeem gaat | **Interactieve kanban** (stap voor stap) |
| 5.3 Prioriteren | WSJF / Cost of Delay | **WSJF-rekenhulp** |
| 5.4 Doelen stellen: OKR's | Van strategie naar teamdoel | Doelenboom (strategie → OKR → PI-doel → iteratie) |
| 5.5 Meten wat telt | Flowmetrics, uitkomsten in plaats van output | Metrics-kaarten met "goed / valkuil" |
| 5.6 Governance & guardrails | Waar ligt de grens van autonomie | Guardrail-visual |

### 6. Werkwijzen & toolkit `#/toolkit`
| Pagina | Type |
|---|---|
| 6.1 Backlogs (portfolio, productgroep, team) | Artefact |
| 6.2 Epic, feature, story: het verschil | Artefact + vergelijkingsvisual |
| 6.3 User stories schrijven | Artefact + checklist |
| 6.4 Definition of Ready / Done | Artefact + invulbaar template |
| 6.5 Productvisie & roadmap | Artefact + canvas |
| 6.6 PI-doelen | Artefact + template |
| 6.7 Teamcharter | Canvas |
| 6.8 Programmabord / afhankelijkheden | Artefact |
| 6.9 **Alle templates** | Overzicht, filterbaar, met invullen, printen en exporteren |

### 7. Aan de slag `#/doen`
| Pagina | Doel | Interactie |
|---|---|---|
| 7.1 **Mijn route** | Persoonlijk leerpad per rol | Checklist met voortgang |
| 7.2 Je eerste 30 dagen | Praktische startchecklist per rol | Afvinkbaar, exporteerbaar |
| 7.3 **Dilemma's: wat doe jij?** | Praktijksituaties met keuzes en feedback | Dilemmakaarten, filter op rol en thema |
| 7.4 **Teamscan** | Volwassenheid van het team meten | Vragenlijst → radardiagram, export voor de retro |
| 7.5 Workshopmodus | Playbook gebruiken in sessies | Presentatiemodus (schermvullend, pijltjestoetsen) |

### 8. De transitie `#/transitie`
| Pagina | Doel | Visual |
|---|---|---|
| 8.1 Transitie-roadmap | Golven, mijlpalen, waar staan we | Tijdlijn met "je bent hier" |
| 8.2 Wat betekent het voor mij, en wanneer? | Per rol: wat verandert wanneer | Rol × tijd-matrix |
| 8.3 Ondersteuning | Coaches, community's, trainingen, contact | Contactkaarten |

### 9. Naslag `#/naslag`
| Pagina | Interactie |
|---|---|
| 9.1 Woordenlijst | Alfabetisch + "SAFe-term → onze term"; begrippen verschijnen ook als hover-uitleg in alle teksten |
| 9.2 Veelgestelde vragen | Filterbaar op rol en thema |
| 9.3 Zoeken | ⌘K-overlay, doorzoekt alle content |
| 9.4 Wat is nieuw | Changelog per versie |
| 9.5 Over dit playbook | Eigenaar, hoe feedback geven, versie |

---

## Persoonlijke routes ("jouw top 5")

Voorstel voor de eerste versie, nog te toetsen.

| Rol | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| **Digital Lead** | Van project naar product (1.2) | Modelkaart (2.0) | Wie beslist wat? (3.9) | Productbudget (5.1) | OKR's (5.4) |
| **Product Manager** | Wat is een product? (2.5) | Rolkaart PM (3.2) | PI-planning (4.6) | Prioriteren/WSJF (5.3) | Productvisie & roadmap (6.5) |
| **Product Owner** | Rolkaart PO (3.3) | Ritme-wiel (4.0) | Epic/feature/story (6.2) | User stories (6.3) | Dilemma's PO (7.3) |
| **Team Coach** | Rolkaart (3.4) | Ritme-wiel (4.0) | Retrospective (4.4) | Teamscan (7.4) | Workshopmodus (7.5) |
| **Architect** | Rolkaart (3.6) | Modelkaart (2.0) | PI-planning (4.6) | Guardrails (5.6) | Backlogs (6.1) |
| **Teamlid** | Het verhaal (1.1) | Productteams (2.4) | Mijn agenda (4.10) | Definition of Done (6.4) | Eerste 30 dagen (7.2) |
| **Business stakeholder** | Van project naar product (1.2) | Wie beslist wat? (3.9) | Systeemdemo (4.7) | Epics & kanban (5.2) | Mythes & feiten (1.4) |

---

## Signature-interacties (de "wow"-momenten)

De interacties waar we de meeste ontwerp- en bouwtijd in steken:

1. **Modelkaart** (2.0): het anker van het hele playbook.
2. **Van→Naar-slider** (1.2): maakt de verandering voelbaar.
3. **Ritme-wiel** (4.0): maakt de cadans in één beeld duidelijk.
4. **Beslismatrix** (3.9): neemt de grootste onzekerheid weg.
5. **Dilemma's** (7.3): laat mensen het oefenen in plaats van alleen lezen.

De overige pagina's gebruiken een vaste set herbruikbare componenten (zie contentmodel).
