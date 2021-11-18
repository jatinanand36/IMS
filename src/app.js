const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config');
const passport = require('passport');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fileUpload = require('express-fileupload');
const errorHandler = require('./utils/error');
const { log } = require('../locale/messages');
const { HTTP_CODES } = require('../constants/constants');

const accountRoutes = require('./routes/accountRoutes');

const app = express();

const APP_URL = config.get('APP_URL');
app.disable("x-powered-by");
app.use(cors({
    "origin": APP_URL,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": HTTP_CODES.NOCONTENT
}));
app.use(bodyParser.json());

app.use(fileUpload());

app.use(passport.initialize());
app.use(passport.session())
require('./authorization/passport')(passport);

//ROUTES
app.use('/v1/ims/account', accountRoutes);

app.all('*', (req, res) => {
    res.status(HTTP_CODES.NOTFOUND).send(`${log.error.CantfindMessages} ${req.originalUrl} ${log.error.serverText}`);
});

//Error
app.use(errorHandler);

module.exports = app;