---
mode: agent
description: Zet een bestaand document (deck, notitie, visiestuk) om naar playbook-content
---
Zet het onderstaande brondocument om naar content voor het playbook, volgens `.github/copilot-instructions.md` en de sjablonen in `content/_sjablonen/`.

Brondocument: ${input:bron:Plak de tekst van het document}

Werkwijze:
1. Bepaal eerst welke onderdelen bij welk contenttype horen (rol, event, begrip, besluit, pagina, dilemma) en noem ze kort.
2. Werk bestaande bestanden bij in plaats van dubbele te maken.
3. Zet alles op `status: concept`.
4. Draai `npm run content:check` en los meldingen op.
5. Geef een kort overzicht van wat je hebt toegevoegd of gewijzigd, en wat je niet kon plaatsen.
