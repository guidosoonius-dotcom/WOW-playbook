---
id: epics-features-stories
type: uitleg
volgorde: 3
titel: Epics, features en stories
kern: Drie maten werk. Een epic is groot en strategisch, een feature past in een kwartaal, een story in twee weken.
samenvatting: >
  Werk wordt steeds kleiner gemaakt naarmate het dichter bij de uitvoering komt. Een epic wordt opgeknipt
  in features, en een feature in stories. Zo blijft groot werk behapbaar en lever je elke twee weken iets op.
safe:
  term: Epic, Feature, Story
niveaus:
  - naam: Epic
    laag: portfolio
    horizon: Meerdere kwartalen
    eigenaar: Digital Leads (portfolio), uitgewerkt door een epic owner
    wat: Een groot initiatief met een eigen lean business case en een MVP als eerste stap.
    backlog: Portfoliobacklog
  - naam: Feature
    laag: productgroep
    horizon: Past binnen één kwartaal (planningsinterval)
    eigenaar: Product Manager
    wat: Een stuk functionaliteit met een duidelijke waarde voor de gebruiker, gepland in de PI-planning.
    backlog: Backlog van de productgroep
  - naam: Story
    laag: productteam
    horizon: Past binnen één iteratie (twee weken)
    eigenaar: Product Owner
    wat: Een klein stuk werk vanuit de gebruiker, met acceptatiecriteria, dat één team afmaakt.
    backlog: Teambacklog
voorbeeld:
  epic: Digitale werkbon voor schoonmakers
  epic_hypothese: Als schoonmakers hun werkbon op hun telefoon hebben, kunnen ze afwijkingen direct melden en krijgen klanten sneller inzicht in de kwaliteit.
  features:
    - naam: Werkbon op de telefoon
      stories:
        - Als schoonmaker wil ik mijn taken van vandaag zien, zodat ik weet wat ik moet doen.
        - Als schoonmaker wil ik een taak afvinken, zodat de leidinggevende ziet dat het klaar is.
    - naam: Afwijking melden met foto
      stories:
        - Als schoonmaker wil ik een foto maken van een afwijking, zodat ik niet hoef uit te leggen wat er aan de hand is.
        - Als leidinggevende wil ik een melding krijgen bij een afwijking, zodat ik snel kan handelen.
    - naam: Kwaliteitsrapport voor de klant
      stories:
        - Als klant wil ik per week zien welke taken zijn uitgevoerd, zodat ik vertrouwen heb in de dienst.
status: concept
eigenaar: Programmateam Samen Digitaal
bijgewerkt: 2026-11-07
---
## Hoe verhouden ze zich tot elkaar?

Een **epic** beschrijft een grote verandering met een hypothese: wat verwachten we dat het oplevert? Na
goedkeuring in de portfoliokanban wordt de epic opgeknipt in **features**. De Product Manager plant die
features in de PI-planning, samen met de teams. Elk team knipt zijn deel daarna op in **stories** en
werkt die af in iteraties van twee weken.

Andersom werkt het ook: stories tellen op tot een feature, features tot een epic. Zo kun je op elk niveau
zien hoe ver een initiatief is, en of de hypothese uitkomt.

## Een goede story

Een goede story is klein genoeg voor één iteratie, beschrijft waarde voor een gebruiker en heeft
acceptatiecriteria: wanneer is het goed? Een bekende vorm is: *Als [gebruiker] wil ik [iets], zodat
[waarde]*.

## Enablers

Niet al het werk levert direct iets zichtbaars op voor een gebruiker. Werk aan architectuur,
infrastructuur of onderzoek heet een **enabler**. Enablers bestaan op elk niveau (epic, feature, story)
en worden net zo gepland en geprioriteerd als ander werk.

*Het voorbeeld op deze pagina is een illustratie.*
