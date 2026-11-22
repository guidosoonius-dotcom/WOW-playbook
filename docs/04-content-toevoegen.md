# Content toevoegen — met of zonder Copilot

Alle inhoud van het playbook staat in `content/` als tekstbestanden (Markdown met YAML-kopje). Je hoeft dus geen code te kunnen.
Er zijn vier routes. Bij alle drie geldt: **de build controleert de content**. Zie je een rode melding, dan staat erin wat er mis is.

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

## Route 2 — Copilot Cowork (aanbevolen voor redacteuren zonder ontwikkeltools)

Cowork in Microsoft 365 Copilot werkt met de skill **Playbook-redacteur**. Die kent alle contenttypen, sjablonen, geldige rollen,
events en pagina's, de regels van de contentcontrole en de toon van het playbook.

**Installeren (eenmalig):**
1. Download de skill: in het playbook op *Over dit playbook* → **Download de skill (SKILL.md)**, of uit de repo:
   [`cowork/playbook-redacteur/SKILL.md`](../cowork/playbook-redacteur/SKILL.md).
2. Open Cowork en voeg de skill toe via *Aanpassen* → *Skills*. Of zet het bestand in je OneDrive, in de map
   `Documenten/Cowork/skills/playbook-redacteur/SKILL.md`. Maak die map zelf aan als hij er niet is.
   Cowork vindt eigen skills bij het begin van een nieuwe sessie.

**Gebruiken:**
- *"Maak van deze notitie een dilemma voor het playbook."* (voeg het Word-bestand of de tekst toe)
- *"Zet deze rolbeschrijving om naar een rolkaart."*
- *"Werk de PI-planningskit bij met deze agenda."* Cowork vraagt dan om de huidige tekst van het bestand
  (op GitHub: open het bestand en kies *Raw*).

Cowork levert de bestanden, controleert ze met de checklist uit de skill en legt uit hoe je ze indient (zoals in route 3, stap 3 en 4).

> De skill is gebaseerd op een playbook-versie. Bij een nieuwe versie (met bijvoorbeeld nieuwe rollen of werkvormen)
> download je de nieuwe skill en vervang je de oude.

## Route 3 — Microsoft 365 Copilot Chat, zonder Cowork

Handig als je bronmateriaal in Word, PowerPoint of Teams staat en je geen Cowork hebt.

1. Kopieer de prompt: in het playbook op *Over dit playbook* → **Kopieer de prompt**, of uit
   [`docs/m365-copilot-prompt.md`](m365-copilot-prompt.md). Die prompt wordt automatisch gemaakt uit de content en is dus actueel.
2. Plak hem in Copilot Chat (in Word, Teams of de Microsoft 365-app) en voeg je bron toe.
3. Ga in de browser naar de repo op GitHub, open de juiste map (bijv. `content/dilemmas/`), kies **Add file → Create new file**,
   geef het bestand de naam van het `id` met `.md` erachter, en plak de tekst.
4. Kies **Propose changes**. Er komt een pull request; de automatische controle laat binnen een paar minuten zien of alles klopt.

> Begrippen of besluiten toevoegen? Die komen onderaan `content/data/begrippen.yaml` of `content/data/beslismatrix.yaml`,
> volgens [`content/_sjablonen/begrip.yaml`](../content/_sjablonen/begrip.yaml) en [`besluit.yaml`](../content/_sjablonen/besluit.yaml).

## Route 4 — Met de hand

Kopieer een sjabloon uit [`content/_sjablonen/`](../content/_sjablonen/) naar de juiste map, vul het in, en draai `npm run content:check`
(of laat de GitHub-controle het doen).

## Route 5 — Direct in het HTML-bestand (redactiemodus)

Voor kleine tekstwijzigingen: een tikfout, een betere zin, een aangescherpte kern. Er is niets voor nodig behalve het playbook zelf.

1. Open het playbook en klik onderaan op **Teksten redigeren** (of op *Over dit playbook* → *Zet de redactiemodus aan*).
2. Klik op een tekst en pas hem aan. **Enter** bewaart, **Esc** annuleert. Staat dezelfde tekst op meer plekken (bijvoorbeeld
   de kern van een rol), dan verandert hij overal. Wijzigingen worden tussentijds in de browser bewaard.
3. Kies **Opslaan als HTML-bestand**. Je krijgt een nieuw, zelfstandig playbook-bestand met je wijzigingen erin. Zet dat op
   SharePoint in plaats van het oude. Iemand anders kan in dat bestand gewoon verder redigeren.
4. Kies **Exporteren → Wijzigingenbestand** en stuur het JSON-bestand naar de beheerder (of kies *Kopieer als tekst* en plak
   het in Copilot met de skill Playbook-redacteur).

Wat kan wel en niet: alle teksten uit de content (titels, kernen, samenvattingen, lopende tekst, opties van dilemma's, begrippen)
zijn te wijzigen. Knoppen, menu's en vaste teksten in de code niet; nieuwe onderdelen toevoegen gaat via route 1 tot 4.

**Voor de beheerder: wijzigingen terugzetten in de bron.** Zonder deze stap is de wijziging weg zodra er een nieuwe versie uit
de repository op SharePoint komt.

```bash
npm run redactie -- playbook-wijzigingen-2026-11-22.json --proef   # eerst kijken wat er verandert
npm run redactie -- playbook-wijzigingen-2026-11-22.json           # verwerken
npm run content:check
```

Het script zoekt de oude tekst in het bronbestand en vervangt hem; bij lopende tekst alleen het gewijzigde stuk, zodat de opmaak
blijft staan. Wat het niet kan vinden (omdat de bron intussen veranderd is), meldt het met oud en nieuw, zodat je het met de
hand kunt doen. Komt er een nieuwe versie op SharePoint terwijl iemand nog in een oud bestand redigeert, dan worden wijzigingen
waarvan de oorspronkelijke tekst niet meer klopt overgeslagen en gemeld onder *Wijzigingen*.

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

---

## Beheer: skill, prompt en nieuwe versies

- **De Cowork-skill en de Copilot-prompt worden gemaakt uit de content.** Na een wijziging in rollen, events, uitleg of werkvormen
  draai je `npm run skill`. De contentcontrole waarschuwt als je dat vergeet. De GitHub-controle maakt bij elke build een actuele
  versie en zet die klaar als download (*copilot-skill-playbook-redacteur*), naast het playbook zelf. Ook de download op
  *Over dit playbook* is altijd actueel.
- **Een nieuwe versie uitbrengen:**
  1. Voeg een regel toe aan `content/data/changelog.yaml` met het nieuwe versienummer.
  2. Neem de pull request over in `main`. GitHub bouwt het playbook.
  3. Download het playbook (*samen-digitaal-playbook*) bij de laatste build onder *Actions* en vervang het bestand op SharePoint.
  4. Laat redacteuren met Cowork de nieuwe skill downloaden.

