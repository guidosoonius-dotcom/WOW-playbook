# Samen Digitaal · Playbook

Interactief playbook voor het digitale operating model van Facilicom Groep: van project- naar productgericht werken, gebaseerd op SAFe.
De build levert **één zelfstandig HTML-bestand** op (`dist/samen-digitaal-playbook.html`), zonder externe verbindingen.
Je kunt het via het intranet delen of lokaal openen.

## Snel starten

```bash
npm install
npm run dev      # lokale ontwikkelserver met live herladen
npm run build    # bouwt dist/samen-digitaal-playbook.html
npm run check    # svelte-check
npm run smoke    # rooktest in Chromium op het gebouwde bestand (vereist Playwright)
npm run content:check   # alleen de content controleren (snel)
```

## Content beheren

Alle inhoud staat in [`content/`](content/), los van de code. Zie [`docs/02-contentmodel.md`](docs/02-contentmodel.md) voor alle velden.
**Content toevoegen met GitHub Copilot, Microsoft 365 Copilot of met de hand:** zie [`docs/04-content-toevoegen.md`](docs/04-content-toevoegen.md).
Sjablonen staan in [`content/_sjablonen/`](content/_sjablonen/).

| Map / bestand | Wat |
|---|---|
| `content/lagen/` | De vier lagen van het model (portfolio, waardestroom, productgroep, productteam) |
| `content/rollen/` | Rolkaarten |
| `content/events/` | Overleggen en ceremonies |
| `content/explainers/` | Teksten van de stapsgewijze explainers (de animatie zelf staat in `src/components/explainers/`) |
| `content/paginas/` | Verhalende pagina's (Waarom, Model, Ritme, Sturen, Over) |
| `content/data/begrippen.yaml` | Woordenlijst; begrippen krijgen automatisch een hover-uitleg in lopende tekst |
| `content/data/verschuivingen.yaml` | De van→naar-schuifregelaar |
| `content/data/routes.yaml` | "Jouw route" per rol |
| `content/dilemmas/` | Dilemmakaarten ("Wat doe jij?") |
| `content/data/beslismatrix.yaml` | Wie beslist wat? |
| `content/data/teamscan.yaml` | Stellingen en duiding van de teamscan |
| `content/data/transitie.yaml` | Fasen van de transitie |
| `content/data/changelog.yaml` | "Wat is er nieuw" |

Elk `.md`-bestand heeft YAML-frontmatter met o.a. `id`, `titel`, `kern` (max. 140 tekens), `status` en `eigenaar`; daaronder optioneel Markdown.
**De build valideert de content**: ontbrekende verplichte velden, onbekende verwijzingen (bijv. een rol die niet bestaat) of een te lange kern laten de build falen met een duidelijke melding.

## Techniek

- **Svelte 5 + Vite 7**, gebundeld tot één bestand met `vite-plugin-singlefile`; het lettertype (Plus Jakarta Sans) is ingebed.
- **Hash-routing** (`#/rollen/product-owner`), zodat deep links ook werken vanaf het intranet of als lokaal bestand.
- **Content-plugin** ([`build/content-plugin.js`](build/content-plugin.js)) leest, valideert en verrijkt de content tijdens de build.
- **Explainers**: [`src/components/Explainer.svelte`](src/components/Explainer.svelte) is de stappenspeler (afspelen, pauze, stappen, presentatiemodus); elke scène is een hairline-SVG in `src/components/explainers/`.
- Rolkeuze, thema en voortgang worden alleen in de eigen browser bewaard (`localStorage`); zonder opslag werkt alles gewoon.
- Respecteert *minder beweging* en donkere modus van het systeem.

## Automatische controle

Bij elke pull request en push naar `main` bouwt en test GitHub Actions het playbook ([`.github/workflows/playbook.yml`](.github/workflows/playbook.yml)).
Het resultaat staat als download (*artifact*) bij de run.

## Documentatie

- [`docs/01-sitemap.md`](docs/01-sitemap.md) — sitemap en routes per rol
- [`docs/02-contentmodel.md`](docs/02-contentmodel.md) — contentmodel
- [`docs/03-merk-en-toon.md`](docs/03-merk-en-toon.md) — merk en toon
- [`docs/04-content-toevoegen.md`](docs/04-content-toevoegen.md) — content toevoegen, ook met Copilot
