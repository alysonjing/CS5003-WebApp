/**
 * Variable Declaration
 * @constant
 */
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const request = require("request");
var path = require('path');
var session = require("express-session");

const PORT = 3000;
var forumRouter = require("./routes/forum");
var weatherRouter = require("./routes/weather");

/**
 * Calling constructor for Express App
 * @constructor
 */
var app = express();

/**
 * Controller for getWeather. Called from the Route
 * @inheritDoc
 */
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//Creating a session middleware
app.use(session({
    key: 'user_random',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use("/", weatherRouter);
app.use("/forum", forumRouter);

app.listen(PORT, () => {
    console.log(`Server is up on Port ${PORT}`);
});


module.exports = app;
