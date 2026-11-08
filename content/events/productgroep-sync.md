---
id: productgroep-sync
type: event
volgorde: 7
titel: Productgroep-sync
cadans: iteratie
laag: productgroep
kern: Eén keer per week stemmen de teams van een productgroep af over voortgang, afhankelijkheden en blokkades.
samenvatting: >
  Waar de daily het team bij elkaar houdt, houdt de productgroep-sync de teams bij elkaar. Coaches en
  Product Owners kijken samen naar het programmabord: ligt de productgroep op koers voor de PI-doelen, en
  wachten teams op elkaar?
wanneer: Elke week, op een vaste dag
duur: 30 tot 60 minuten
doel: Afhankelijkheden en blokkades tussen teams vroeg zien en oplossen.
deelnemers:
  - { rol: productgroep-coach, verplicht: true }
  - { rol: team-coach, verplicht: true }
  - { rol: product-owner, verplicht: true }
  - { rol: product-manager, verplicht: false }
  - { rol: architect, verplicht: false }
input: [Het programmabord, Blokkades uit de teams]
output: [Afspraken over afhankelijkheden, Blokkades met een eigenaar, Bijgewerkt programmabord]
goed_als:
  - Teams zien elkaars afhankelijkheden voordat ze een probleem worden
  - Elke blokkade gaat de deur uit met een naam en een datum
  - Het blijft kort; uitzoekwerk gebeurt na de sync
valkuilen:
  - Het wordt een statusoverleg waarin elk team zijn lijstje voorleest
  - Alleen de coaches komen, en de Product Owners horen het pas later
  - Blokkades worden genoteerd maar niet opgepakt
safe:
  term: ART Sync (Coach Sync en PO Sync)
  afwijking: Wij combineren de Coach Sync en de PO Sync in één wekelijkse bijeenkomst.
status: concept
eigenaar: Programmateam Samen Digitaal
bijgewerkt: 2026-11-07
---
