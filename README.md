# Event Planner API

Dit project is een **database-driven REST API** gebouwd met **Node.js en Express**.
De API laat toe om **events** en **locations** te beheren (CRUD), inclusief validatie,
zoeken, paginatie en extra endpoints zoals upcoming en past events.

Het project werd gemaakt in het kader van het vak **Backend Web Development**.

## Technologieën

- Node.js (v20+)
- Express
- SQLite (via better-sqlite3)
- Joi (validatie)
- Nodemon (development)


## Installatie & opstarten

Volg deze stappen om het project lokaal te laten werken:

### 1. Clone de repository
git clone https://github.com/EmDev16/event-planner
cd project2-event/event-planner

### 2. Installeer dependencies
npm install

### 3. Database initialiseren
npm run init-db

### 4. Start de server
npm run dev

De server draait standaard op:
http://localhost:3000

## API Endpoints

### Events (`/api/events`)
- GET `/api/events?limit=&offset=` – lijst van events (paginatie verplicht)
- GET `/api/events/:id` – detail van één event
- GET `/api/events/search?q=` – zoeken op titel of beschrijving
- GET `/api/events/upcoming` – toekomstige events
- GET `/api/events/past` – voorbije events
- POST `/api/events` – nieuw event aanmaken
- PUT `/api/events/:id` – event updaten
- DELETE `/api/events/:id` – event verwijderen

### Locations (`/api/locations`)
- GET `/api/locations?limit=&offset=` – lijst van locaties
- GET `/api/locations/:id` – detail van één locatie
- GET `/api/locations/search?city=` – zoeken op stad
- POST `/api/locations` – nieuwe locatie
- PUT `/api/locations/:id` – locatie updaten
- DELETE `/api/locations/:id` – locatie verwijderen

## Validatie

De API gebruikt **Joi** voor server-side validatie.

### Events
- `title` moet minstens 3 karakters bevatten
- `start_date` en `end_date` zijn verplicht
- `end_date` moet later zijn dan `start_date`
- `capacity` moet een positief geheel getal zijn
- `capacity` mag niet groter zijn dan `location.max_capacity`

### Locations
- Alle velden zijn verplicht
- `city` mag geen cijfers bevatten
- `max_capacity` moet een positief geheel getal zijn

## Belangrijke informatie

- Dit project is een **API-only backend** (geen frontend applicatie).
- De root (`/`) toont een HTML-pagina met documentatie van alle endpoints.
- De database is een lokale SQLite database.
- De map `node_modules` is toegevoegd aan `.gitignore`.

## Bronnen

- Express documentatie  
  https://expressjs.com/

- better-sqlite3  
  https://github.com/WiseLibs/better-sqlite3

- Joi validatie  
  https://joi.dev/
