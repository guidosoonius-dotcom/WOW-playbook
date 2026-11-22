---
# Werkvorm in de gereedschapskist (content/gereedschap/<id>.md).
# Een NIEUWE werkvorm om in te vullen vraagt om een eigen onderdeel in de code (src/components/gereedschap/).
# Zonder dat onderdeel zet je beschikbaar op false: de werkvorm staat dan als "Volgt binnenkort" in het overzicht.
# Bestaande werkvormen pas je wel zonder code aan: hun teksten, voorbeelden, criteria, retro's en agenda staan hier.
id: voorbeeld-werkvorm             # kleine letters en streepjes; gelijk aan de bestandsnaam
type: werkvorm
titel: Voorbeeldwerkvorm
categorie: plannen                 # overstappen | starten | plannen | sturen | verbeteren
niveau: team                       # team | productgroep | portfolio
icoon: doel                        # zie src/lib/iconen.js
volgorde: 9                        # plek binnen de categorie
duur: 30 min
wanneer: Wanneer gebruik je deze werkvorm?
wie: [product-owner, teamlid]      # rol-id's
kern: Eén zin over wat de werkvorm oplevert (max. 140 tekens).
beschikbaar: false                 # true alleen als er een onderdeel in de code voor is
bij: [ritme/refinement]            # optioneel: pagina's waar de werkvorm wordt getoond
status: concept
eigenaar: Programmateam Samen Digitaal
bijgewerkt: 2026-01-01
---
"Zo werkt het": korte uitleg in Markdown, die naast de werkvorm staat.
