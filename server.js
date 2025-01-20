const express = require('express');
const route = require('./route/todolist');
require('dotenv').config();
require('./config/database');

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use('/', route);

app.listen(port, () => {
    console.log('API Terkoneksi ke Server localhost dengan port ' + port);
});