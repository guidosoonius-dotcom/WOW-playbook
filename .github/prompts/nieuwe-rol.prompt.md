---
mode: agent
description: Voeg een rol toe of werk een rolkaart bij vanuit een rolbeschrijving
---
Maak of werk een rolkaart bij in `content/rollen/` volgens `content/_sjablonen/rol.md` en `.github/copilot-instructions.md`.

Bron (plak hier de rolbeschrijving, bijv. uit Word of een HR-profiel): ${input:bron:Plak de rolbeschrijving}

- Vat samen in de velden van het sjabloon; neem geen namen van personen over.
- Vul `niet_meer` met wat deze rol in de nieuwe werkwijze níet meer doet.
- Koppel `events` en `werkt_samen_met` alleen aan bestaande id's.
- Overweeg of de rol ook in `content/data/beslismatrix.yaml` en `content/data/routes.yaml` thuishoort.
- Draai daarna `npm run content:check`.
