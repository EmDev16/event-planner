import express from 'express';
import eventsRoutes from './routes/events.js';
import locationsRoutes from './routes/locations.js';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(express.json());

app.use('/api/events', eventsRoutes);
app.use('/api/locations', locationsRoutes);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


