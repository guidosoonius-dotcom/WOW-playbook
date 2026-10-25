# Sjablonen

Kopieer een sjabloon naar de juiste map, geef het bestand de naam van het `id` en vul de velden in.
Mappen die met `_` beginnen worden niet in het playbook opgenomen.

| Sjabloon | Kopiëren naar |
|---|---|
| `rol.md` | `content/rollen/<id>.md` |
| `event.md` | `content/events/<id>.md` |
| `dilemma.md` | `content/dilemmas/<id>.md` |
| `laag.md` | `content/lagen/<id>.md` |
| `pagina.md` | `content/paginas/<id>.md` (alleen bestaande pagina's) |
| `begrip.yaml` | toevoegen aan `content/data/begrippen.yaml` |
| `besluit.yaml` | toevoegen aan `content/data/beslismatrix.yaml` |

Controleer daarna met `npm run content:check`.
