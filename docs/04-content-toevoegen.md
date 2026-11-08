# Content toevoegen — met of zonder Copilot

Alle inhoud van het playbook staat in `content/` als tekstbestanden (Markdown met YAML-kopje). Je hoeft dus geen code te kunnen.
Er zijn drie routes. Bij alle drie geldt: **de build controleert de content**. Zie je een rode melding, dan staat erin wat er mis is.

---

## Route 1 — GitHub Copilot in VS Code (aanbevolen voor wie met de repo werkt)

Copilot leest automatisch [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) met alle regels: taal, toon, velden en geldige verwijzingen.
Daarnaast zijn er kant-en-klare opdrachten (prompt-bestanden) in [`.github/prompts/`](../.github/prompts/):

| Opdracht in Copilot Chat | Wat het doet |
|---|---|
| `/nieuw-dilemma` | Maakt een dilemmakaart op basis van een situatie |
| `/nieuwe-rol` | Zet een rolbeschrijving (bijv. uit Word) om naar een rolkaart |
| `/nieuw-begrip` | Voegt begrippen toe aan de woordenlijst |
| `/document-omzetten` | Verdeelt een bestaand document (deck, notitie) over de juiste contentbestanden |

Werkwijze:
1. Open de repo in VS Code met Copilot (agent-modus).
2. Typ bijvoorbeeld `/document-omzetten` en plak de tekst van je bron.
3. Copilot maakt of wijzigt de bestanden en draait `npm run content:check`.
4. Controleer de wijzigingen, commit, en open een pull request. De GitHub-controle bouwt het playbook en zet het als download klaar.

## Route 2 — Microsoft 365 Copilot (of een andere chat-assistent), zonder ontwikkeltools

Handig als je bronmateriaal in Word, PowerPoint of Teams staat. Copilot maakt de tekst, jij plakt die in GitHub.

1. Open Copilot in Word of Teams en gebruik de prompt hieronder. Voeg je bron toe (bestand, of geplakte tekst).
2. Copilot levert één of meer blokken tekst die beginnen met `---`.
3. Ga in de browser naar de repo op GitHub, open de juiste map (bijv. `content/dilemmas/`), kies **Add file → Create new file**,
   geef het bestand de naam van het `id` met `.md` erachter, en plak de tekst.
4. Kies **Propose changes**. Er komt een pull request; de automatische controle laat binnen een paar minuten zien of alles klopt.

### Prompt voor Microsoft 365 Copilot

```text
Je bent redacteur van het playbook "Samen Digitaal" van Facilicom Groep over ons nieuwe digitale operating model
(productgericht werken, gebaseerd op SAFe). Zet de bron die ik aanlever om naar playbook-content.

Regels:
- Nederlands, je/jij-vorm, nuchter en concreet. Geen namen van personen of klanten. Verzin geen cijfers of data.
- Lever elk item als één Markdown-bestand met YAML-kopje tussen --- en ---. Zet boven elk bestand de bestandsnaam.
- Verplichte velden in elk bestand: id (kleine letters-met-streepjes, gelijk aan de bestandsnaam), type, titel,
  kern (max. 140 tekens), status: concept, eigenaar: Programmateam Samen Digitaal, bijgewerkt (datum van vandaag, JJJJ-MM-DD).
- Toegestane types en extra velden:
  • rol (map content/rollen/): volgorde, niveau_label (Divisie/Productgroep/Productteam), laag, samenvatting, in_een_zin,
    verantwoordelijkheden (lijst), niet_meer (lijst), werkt_samen_met (lijst van {rol, waarover}),
    events (lijst van {event, rol_in_event}), safe {term, afwijking}
  • event (map content/events/): volgorde, cadans (dagelijks/iteratie/kwartaal/portfolio), laag, samenvatting, wanneer, duur,
    doel, deelnemers (lijst van {rol, verplicht: true/false}), input, output, goed_als, valkuilen, facilitatietips
  • dilemma (map content/dilemmas/): situatie, vraag, opties (2–4, elk {tekst, kwaliteit: beste/kan/valkuil, feedback},
    precies één "beste"), leerpunt, verwijst_naar (lijst van pagina's), rollen (lijst), thema
- Lagen: portfolio, waardestroom, productgroep, productteam.
- Rollen: digital-lead, product-manager, product-owner, team-coach, architect, teamlid, business-stakeholder.
- Events: daily, iteratieplanning, refinement, iteratie-review, retrospective, systeemdemo, pi-planning, inspect-adapt, portfolio-sync.
- Pagina's voor verwijst_naar: waarom, model, rollen, ritme, sturen, beslissen, doen, doen/dilemmas, doen/teamscan,
  transitie, woordenlijst, rollen/<rol>, ritme/<event>.
- Gebruik alleen de rollen, events en pagina's uit deze lijsten. Past iets nergens, noem het dan apart aan het eind.

Begin met een korte lijst van de bestanden die je gaat maken, en lever daarna de bestanden.
```

> Tip: wil je begrippen of besluiten toevoegen, vraag Copilot dan om een YAML-lijst volgens
> [`content/_sjablonen/begrip.yaml`](../content/_sjablonen/begrip.yaml) of [`besluit.yaml`](../content/_sjablonen/besluit.yaml)
> en voeg die onderaan `content/data/begrippen.yaml` of `content/data/beslismatrix.yaml` toe.

## Route 3 — Met de hand

Kopieer een sjabloon uit [`content/_sjablonen/`](../content/_sjablonen/) naar de juiste map, vul het in, en draai `npm run content:check`
(of laat de GitHub-controle het doen).

---

## Van concept naar vastgesteld

Nieuwe content staat altijd op `status: concept` en krijgt in het playbook een label "Concept".
Is de inhoud afgestemd, zet de eigenaar hem op `review` of `vastgesteld`. Voeg bij grotere wijzigingen een regel toe aan
`content/data/changelog.yaml`, zodat lezers op "Over dit playbook" zien wat er nieuw is.

## Wat de controle afvangt

- ontbrekende verplichte velden of een te lange `kern`;
- verwijzingen naar rollen, events, lagen of pagina's die niet bestaan;
- een dilemma zonder (of met meer dan één) "beste" optie;
- een besluit in de beslismatrix zonder precies één beslisser (`B`);
- fouten in de YAML-opmaak (met regelnummer).
