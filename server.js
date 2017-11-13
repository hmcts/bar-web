const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('./config/default.json')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// enable the dist folder to be accessed statically 
app.use(express.static('dist'))
 
// parse application/json
app.use(bodyParser.json())

// set port for the application
app.set('port', (config.bar.port) ? config.bar.port : process.env.PORT)

// allow access origin
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
})

// make all routes available via this imported module
app.use('/', require('./express/app'))

// fallback to this route (so that Angular will handle all routing) 
app.get('**', (req, res) => {
	let distDirectory = path.join(__dirname, 'dist')
	return res.sendFile(distDirectory + '/index.html')
})

// initialize the express app on the designated port
app.listen(app.get('port'), () => {
	console.log(`Listening on port ${app.get('port')}`)
})
