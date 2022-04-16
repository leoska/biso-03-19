const { MongoClient } = require('mongodb');
const { mongo } = require('../settings.json');

/**
 * Получение нового коннекта
 * 
 * @returns {MongoClient}
 */
function getMongoClient() {
    const host = mongo.host || 'mongodb';
    const port = mongo.port || 27017;
    const db = mongo.db || 'test';

    return new MongoClient(`mongodb://${host}:${port}/${db}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

let mongoClient = getMongoClient();
let connected = false;

process.once('exit', async () => {
    if (connected) 
        await mongoClient.close();
});

/**
 * Получение чата из монги
 * 
 * @async
 * @returns {Promise<Array<Object>>}
 */
async function getChat() {
    if (!connected)
        throw new Error(`[MongoDb] Something went wrong: Connection is not initialized!`);

    return await mongoClient.db(mongo.db || 'test').collection('chat').find().toArray();
}

/**
 * Запись нового сообщения в монгу
 * 
 * @async
 * @param {Object} message
 * @returns {Promise<void>}
 */
async function writeMessage(message) {
    if (!connected)
        throw new Error(`[MongoDb] Something went wrong: Connection is not initialized!`);

    await mongoClient.db(mongo.db || 'test').collection('chat').insert(message);
}

/**
 * Инициализация подключения
 * 
 * @async
 * @returns {Promise<void>}
 */
async function init() {
    if (!connected)
        await mongoClient.connect();

    connected = true;
}

module.exports = {
    getChat,
    writeMessage,
    init
};