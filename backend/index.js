const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const mongoose = require('mongoose');
require('dotenv/config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use('/', router);

// Mongo setup
const dbOptions = { useNewUrlParser:true, useUnifiedTopology:true };
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Database connected.'))
.catch(err => console.log(err));

// Vercel setup
app.use(cors({
    origin: 'https://swu-command-center.vercel.app',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
  }));

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});