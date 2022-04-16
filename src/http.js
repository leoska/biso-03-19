const express = require('express');
const { getChat, writeMessage } = require('./mongo');
const { http } = require('../settings.json');
const port = http.port || 25665;

let app;

/**
 * Инициализация http-server'а
 * 
 * @async
 * @returns {Promise<void>}
 */
async function init() {
    return await new Promise((resolve, reject) => {
        try {
            app = express();
            app.use(express.json());
    
            app.get('/getChat', async (req, res) => {
                res.json(await getChat());
            });
    
            app.post('/sendMessage', async (req, res) => {
                const data = req.body;
    
                data.stamp = Date.now();
                data.type = 'user';

                await writeMessage(data);
                res.json({response: true});
            });
    
            app.listen(port, () => {
                console.log(`Example app listening on port ${port}`);
                resolve();
            });
        } catch(e) {
            console.error(e.stack);
            reject(e);
        }
    });
}

module.exports = { app, init };