const express = require('express');
const path = require('path');
require('dotenv').config();
const app = require('./src/app');

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'Frontend', 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'Frontend', 'dist', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
