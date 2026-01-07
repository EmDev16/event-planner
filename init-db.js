import db from "./db.js";

db.exec(`
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS locations;
`);

//Tabellen creëren
db.exec(`
    CREATE TABLE locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    max_capacity INTEGER NOT NULL
    );
`);

db.exec(`
    CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    location_id INTEGER,
    capacity INTEGER NOT NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id)
    );
`);


//Samples
const insertLocation = db.prepare(`
    INSERT INTO locations (name, address, city, max_capacity)
    VALUES (?, ?, ?, ?)
`);

const location1 = insertLocation.run(
    "Conference Center", "123 Main St", "Metropolis", 500);
const location2 = insertLocation.run(
    "Grand Hall", "456 Elm St", "Gotham", 300);


const insertEvent = db.prepare(`
    INSERT INTO events (title, description, start_date, end_date, location_id, capacity)
    VALUES (?, ?, ?, ?, ?, ?)
`);

insertEvent.run(
    "Tech Conference", "A conference about the latest in tech.", "2024-09-01",
     "2024-09-03", location1.lastInsertRowid, 400);
insertEvent.run(
    "Art Expo", "An exhibition showcasing modern art.", "2024-10-15",
     "2024-10-20", location2.lastInsertRowid, 250);

console.log("Database succesvol geïnitialiseerd.");