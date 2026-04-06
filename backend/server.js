import express from 'express';
import cors from 'cors';

// Initialize the server
const app = express();
const PORT = 5000;

// Middleware (The security guard and the translator)
app.use(cors()); // Allows your React app to talk to this server
app.use(express.json()); // Allows the server to understand JSON data

// A basic route to test if it is working
app.get('/', (req, res) => {
    res.send('DISHcovery AI Backend is successfully running!');
});

// A sample API endpoint for your desserts
app.get('/api/desserts', (req, res) => {
    const sampleDesserts = [
        { id: 1, name: "Matcha Mille Crepe", origin: "Japan" },
        { id: 2, name: "Tiramisu", origin: "Italy" },
        { id: 3, name: "Chocolate Cake", origin: "USA" }
    ];
    res.json(sampleDesserts);
});

// Turn the server on
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});