const express = require("express");
const cors = require("cors");
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser =require('cookie-parser');
const https = require('https');
const fs = require('fs');
const history = require('connect-history-api-fallback')
const xss = require('xss')

const app = express();
const port = 9999;
const CryptoJS = require("crypto-js");

app.use(history())
app.set('trust proxy', 1);

// permettre les appels AJAX cross-origins (CORS...)
app.use(cors({
  credentials: true,
  origin: [/*'https://cachepastajoie.fr','https://www.cachepastajoie.fr',*/'http://localhost:8080', 'http://localhost']
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: "Shh, its a secret!",
	saveUninitialized: false,
	resave: false
}));
app.use('/', express.static(__dirname + '/../dist'))
app.use((req, res, next) =>{
	for(const input in req.body.u){
		req.body.u[input] = xss(req.body.u[input], {
			whiteList: {
				br: []
			},
			stripIgnoreTag: true
		})
	}
	next()
})

// ## CORS middleware
// 
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs


// app.get('/', function(req, res){
// 	if (req.session.toto){
// 		req.session.toto++;
// 	}else{
// 		req.session.toto=1;
// 	}
// 	res.send("toto vaut:" + req.session.toto);
// 	console.log(req.session);
// });


const accueil = require("./accueil")(app);
const portail = require("./portail")(app);
const theme = require("./theme")(app);
const chrono = require("./chronologique")(app);
const actu = require("./actualite")(app);
const apropos = require("./apropos")(app);
const press = require("./press")(app); 
const reseau = require("./reseau")(app);
const titre = require("./titre")(app);

// Redirect from http port 80 to https
//var http = require('http');
	
//http.createServer(function (req, res) {
//	console.log('toto')
//    res.writeHead(301, { "Location": "https://cachepastajoie.fr:" + port});
//    res.end();
//}).listen(80)

// const options = {
//    key: fs.readFileSync('/etc/letsencrypt/live/cachepastajoie.fr/privkey.pem'),
//    cert: fs.readFileSync('/etc/letsencrypt/live/cachepastajoie.fr/cert.pem'),
//    ca: fs.readFileSync('/etc/letsencrypt/live/cachepastajoie.fr/chain.pem')
// }

// https.createServer(options, app).listen(port)

app.listen(port)