//=======Application entry=========

//Imports
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
//Import all routes
const {customerRoute, carRoute, orderRoute, userRoute} = require('./routes');

//allow more listeners
require('events').EventEmitter.defaultMaxListeners = 15;

const app = express()

//Prepare bodyParser to get params in requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

//Routes Activation
app.use('/', customerRoute);
app.use('/', carRoute);
app.use('/', orderRoute);
app.use('/', userRoute);

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening`)
})
