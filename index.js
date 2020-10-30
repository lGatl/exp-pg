const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {customerRoute, carRoute, orderRoute} = require('./routes');

require('events').EventEmitter.defaultMaxListeners = 15;

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())


app.use('/', customerRoute);
app.use('/', carRoute);
app.use('/', orderRoute);

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening`)
})
