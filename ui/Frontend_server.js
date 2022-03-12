require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.static('public'));

const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT;
const env = { UI_API_ENDPOINT };

app.get('/env.js', (_, res) => {
    res.send(`window.ENV = ${JSON.stringify(env)}`);
});

const port = process.env.UI_SERVER_PORT;

app.listen(port, () => {
    console.log(`UI started on port ${port}`);
});