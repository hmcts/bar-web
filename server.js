const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('config');
const PORT = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// enable the dist folder to be accessed statically
app.use(express.static('dist'));

// parse application/json
app.use(bodyParser.json());

// allow access origin
app.use((req, res, next) => {
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next()
});

// make all routes available via this imported module
app.use(require('./express/app'));

// fallback to this route (so that Angular will handle all routing)
app.get('**', (req, res) => {
	let distDirectory = path.join(__dirname, 'dist');
	return res.sendFile(distDirectory + '/index.html');
});

// initialize the express app on the designated port
app.listen(PORT, () => console.log(`Connected to port ${PORT}`));
