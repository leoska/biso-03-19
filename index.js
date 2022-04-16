const express = require('express');
const port = 25665;

const app = express();
const chat = [];

app.use(express.json());

app.get('/getChat', (req, res) => {
    res.json(chat);
});

app.post('/sendMessage', (req, res) => {
    const data = req.body;

    data.stamp = Date.now();
    data.type = 'user';

    chat.push(data);
    res.json({response: true});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});