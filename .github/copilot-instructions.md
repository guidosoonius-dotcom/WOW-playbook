# Instructies voor Copilot — Samen Digitaal playbook

Dit project is het interactieve playbook "Samen Digitaal" van Facilicom Groep. Het bouwt tot één HTML-bestand.
De meeste wijzigingen zijn **content**: Markdown met YAML-frontmatter in `content/`. Raak bij een contentvraag de code in `src/` niet aan.

## Taal en toon
- Altijd Nederlands. Spreek de lezer aan met *je/jij*.
- Nuchter en concreet, zonder hype of buzzwords. Korte zinnen.
- Leg SAFe-termen uit in eigen woorden; de originele term hoort in het veld `safe.term`.
- Gebruik herkenbare voorbeelden uit facilitaire dienstverlening (schoonmaak, beveiliging, catering, vastgoed), zonder namen van echte klanten of collega's.
- Verzin geen cijfers, data of feiten. Gebruik een placeholder als `[periode volgt]` als iets onbekend is.

## Contenttypen en mappen
| Type | Map | Sjabloon |
|---|---|---|
| `rol` | `content/rollen/` | `content/_sjablonen/rol.md` |
| `event` | `content/events/` | `content/_sjablonen/event.md` |
| `dilemma` | `content/dilemmas/` | `content/_sjablonen/dilemma.md` |
| `laag` | `content/lagen/` | `content/_sjablonen/laag.md` |
| `pagina` | `content/paginas/` | `content/_sjablonen/pagina.md` |
| `explainer` | `content/explainers/` | alleen teksten; de animatie staat in `src/components/explainers/` |
| begrippen | `content/data/begrippen.yaml` | `content/_sjablonen/begrip.yaml` |
| beslismatrix | `content/data/beslismatrix.yaml` | `content/_sjablonen/besluit.yaml` |
| routes per rol | `content/data/routes.yaml` | |
| van→naar | `content/data/verschuivingen.yaml` | |
| teamscan | `content/data/teamscan.yaml` | |
| transitie | `content/data/transitie.yaml` | |

Volg altijd het sjabloon. Het volledige contentmodel staat in `docs/02-contentmodel.md`.

## Regels die de build afdwingt
- Verplicht in elk `.md`-bestand: `id`, `type`, `titel`, `kern`, `status`, `eigenaar`, `bijgewerkt`.
- `id` = bestandsnaam zonder `.md`, kleine letters en streepjes.
- `kern` is maximaal 140 tekens; de uitleg van een begrip maximaal 220.
- `status` is `concept`, `review` of `vastgesteld`. Nieuwe content is altijd `concept`.
- Verwijzingen naar rollen, events, lagen en pagina's moeten bestaan (zie de bestandsnamen in de mappen).
- Dilemma: 2–4 opties, precies één met `kwaliteit: beste`; de rest `kan` of `valkuil`.
- Beslismatrix: per besluit precies één rol met code `B`; codes zijn `B`, `A`, `U`, `I`.
- Rol-id's: digital-lead, product-manager, product-owner, team-coach, architect, teamlid, business-stakeholder.
- Event-id's: daily, iteratieplanning, refinement, iteratie-review, retrospective, systeemdemo, pi-planning, inspect-adapt, portfolio-sync.
- Pagina-routes voor `verwijst_naar` en `routes.yaml`: waarom, model, rollen, ritme, sturen, beslissen, doen, doen/dilemmas, doen/teamscan, transitie, woordenlijst, over, `rollen/<rol-id>`, `ritme/<event-id>`.

## Controleren
Voer na elke wijziging `npm run content:check` uit en los alle meldingen op. Zet `bijgewerkt` op de datum van vandaag.
