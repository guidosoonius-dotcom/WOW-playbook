---
mode: agent
description: Maak een nieuw dilemma voor de dilemmakaarten
---
Maak een nieuw dilemma in `content/dilemmas/` op basis van het sjabloon `content/_sjablonen/dilemma.md` en de regels in `.github/copilot-instructions.md`.

Onderwerp of situatie: ${input:situatie:Beschrijf de situatie of het thema}
Voor welke rol: ${input:rol:Bijv. product-owner}

- Schrijf een herkenbare situatie uit de praktijk van een facilitaire divisie.
- Geef 3 opties: één sterke keuze (`beste`), één die kan maar risico's heeft (`kan`) en één valkuil.
- Laat `verwijst_naar` wijzen naar bestaande pagina's die helpen.
- Draai daarna `npm run content:check`.
