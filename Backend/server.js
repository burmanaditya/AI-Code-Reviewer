const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const app = require('./src/app');

const port = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'Frontend', 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'Frontend', 'dist', 'index.html'));
    });
}

app.get("/", (req, res) => {
    res.send("Welcome to the API");
});

if (process.env.VERCEL !== "1") {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

module.exports = app;
