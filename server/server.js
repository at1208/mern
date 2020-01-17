require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const authRoute = require('./routes/auth');


app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))






app.use('/', authRoute);
// const env = process.env.NODE_ENV;
// console.log(env)

const Port = process.env.PORT || 8080;
app.listen(Port, () => console.log(`Listening to ${Port}`));
