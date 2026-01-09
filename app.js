import express from 'express';
import locationsRouter from './routes/locations.js';
import eventsRouter from './routes/events.js';

const app = express();

app.use(express.json());

app.use('/api/locations', locationsRouter);
app.use('/api/events', eventsRouter);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
