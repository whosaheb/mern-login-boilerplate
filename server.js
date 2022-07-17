const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const allRoutes = require('./src/routers'); // import routes

/********** initializing apps  *********/
const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8000;

/******************  Database connection **************/
const dbUrl = process.env.DB;
mongoose.connect(dbUrl, {maxPoolSize: 10})
        .then(()=>{
            console.log(`database connection`);
            // load damin user data;
            require('./src/helper/adminLoader');
        })
        .catch((err)=>{
            console.log(`error occure when connecting to DB`);
        })

/********** Aplly Middlewares  *********/
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
// app.use(morgan('combined'))
app.use(allRoutes);


/************** run the server  *********/
app.listen(PORT, () => {
    console.log(`You are listening at http://${HOST}:${PORT}`)
})