const express = require('express');
require('dotenv').config();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

const db = new sqlite3.Database(path.join(__dirname, 'subscriptions.db'));

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS subscriptions (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
  db.run(`CREATE TABLE IF NOT EXISTS infographic_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

const InfographicService = require('./services/infographicService.cjs');

app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  const stmt = db.prepare("INSERT OR IGNORE INTO subscriptions (email) VALUES (?)");
  stmt.run(email, function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error saving subscription.' });
    }
    res.status(200).json({ message: 'Successfully subscribed!' });
  });
  stmt.finalize();
});

app.post('/api/infographic/generate', async (req, res) => {
  try {
    const { eventName } = req.body;
    const service = new InfographicService();

    // 0. Get History
    const postedEvents = await new Promise((resolve, reject) => {
      db.all('SELECT event_name FROM infographic_history', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(r => r.event_name));
      });
    });

    // 1. Discover (or use specific event)
    const events = await service.discoverEvents(postedEvents, eventName);
    if (!events || events.length === 0) throw new Error("No new events found.");

    const selectedEvent = events[0];

    // 2. Research
    const researchData = await service.researchEvent(selectedEvent.name);

    // 3. Generate
    const content = await service.generateInfographic(researchData);

    // 4. Save History
    db.run('INSERT INTO infographic_history (event_name) VALUES (?)', [selectedEvent.name]);

    res.json({ event: researchData, infographic: content });
  } catch (error) {
    console.error("Infographic generation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Handle SPA routing: serve index.html for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});