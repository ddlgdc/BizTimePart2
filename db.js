/** Database setup for BizTime. */

const { Client } = require('pg');

const client = new Client({
    user: 'diego', 
    host: 'localhost', 
    database: 'BizTimePartTwo',
    password: '011601',
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = client;