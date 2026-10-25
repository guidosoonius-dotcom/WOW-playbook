---
id: product-owner
type: rol
volgorde: 3
titel: Product Owner
niveau_label: Productteam
laag: productteam
kern: Jij zorgt dat je team altijd werkt aan het meest waardevolle.
samenvatting: >
  Als Product Owner ben je de stem van de gebruiker in het team. Je beheert de teambacklog, maakt keuzes
  in wat eerst komt en accepteert het werk van het team.
in_een_zin: Jij zorgt dat het team altijd werkt aan het meest waardevolle.
verantwoordelijkheden:
  - Beheert en ordent de teambacklog
  - Schrijft en verfijnt user stories samen met het team
  - Accepteert opgeleverd werk
  - Is aanspreekpunt voor de operatie van de divisie
niet_meer:
  - Je stuurt niet op uren of taken van teamleden
  - Je schrijft geen volledig functioneel ontwerp vooraf
werkt_samen_met:
  - { rol: product-manager, waarover: features en prioriteiten in de productgroep }
  - { rol: team-coach, waarover: het ritme en de verbetering van het team }
  - { rol: business-stakeholder, waarover: behoeften en feedback uit de praktijk }
events:
  - { event: iteratieplanning, rol_in_event: brengt de prioriteiten in }
  - { event: refinement, rol_in_event: licht stories toe en ordent de backlog }
  - { event: iteratie-review, rol_in_event: haalt feedback op bij stakeholders }
  - { event: pi-planning, rol_in_event: vertaalt features naar teamdoelen }
safe:
  term: Product Owner
  afwijking: Bij ons is de PO ook het vaste aanspreekpunt voor de operatie van de divisie.
tijdsbesteding:
  - { activiteit: Backlog en refinement, procent: 35 }
  - { activiteit: Stakeholders en gebruikers, procent: 30 }
  - { activiteit: Met het team, procent: 25 }
  - { activiteit: Overig, procent: 10 }
status: concept
eigenaar: Programmateam Samen Digitaal
bijgewerkt: 2026-10-25
---
## Een week als Product Owner

Je begint de iteratie met de planning, waarin je de prioriteiten inbrengt. Daarna ben je veel bij gebruikers
en stakeholders om te begrijpen wat er nodig is, en werk je met het team stories uit in de refinement.
Aan het eind van de iteratie laat het team in de review zien wat er af is, en haal jij de feedback op.
