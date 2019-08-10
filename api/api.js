const express = require("express");
const cors = require("cors");
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser =require('cookie-parser');
const https = require('https');
const fs = require('fs');
const history = require('connect-history-api-fallback')
const xss = require('xss')
const CronJob = require('cron').CronJob;
const getCron = require('./apiYoutube')

const app = express();
const port = 443;
const CryptoJS = require("crypto-js");

const job = new CronJob('0 34 15 * * *', getCron);
job.start();
app.use(history())
app.enable('trust proxy');

// permettre les appels AJAX cross-origins (CORS...)
app.use(cors({
  credentials: true,
  origin: [/*'https://cachepastajoie.fr','https://www.cachepastajoie.fr','http://localhost:8080', 'http://localhost'*/]
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: process.env.SECRET,
	saveUninitialized: false,
	resave: false
}));
app.use('/', express.static(__dirname + '/../dist'))
app.use((req, res, next) =>{
	if(req.url.match(new RegExp('/themes/'))){
		for(const input in req.body.u){
			req.body.u[input] = xss(req.body.u[input], {
				whiteList: {
					iframe: ['src']
				},
				stripIgnoreTag: true
			})
		}
	} else {
		for(const input in req.body.u){
			req.body.u[input] = xss(req.body.u[input], {
				whiteList: {
					br: []
				},
				stripIgnoreTag: true
			})
		}
	}
	next()
})

// const accueil = require("./accueil")(app);
const portail = require("./portail")(app);
const theme = require("./theme")(app);
const chrono = require("./chronologique")(app);
const actu = require("./actualite")(app);
const apropos = require("./apropos")(app);
// const press = require("./press")(app); 
const reseau = require("./reseau")(app);
const titre = require("./titre")(app);
const projet = require('./projet')(app);

/* const options = {
   key: fs.readFileSync('/etc/letsencrypt/live/cachepastajoie.fr/privkey.pem'),
   cert: fs.readFileSync('/etc/letsencrypt/live/cachepastajoie.fr/cert.pem'),
   ca: fs.readFileSync('/etc/letsencrypt/live/cachepastajoie.fr/chain.pem')
}

https.createServer(options, app).listen(port) */

require("greenlock-express")
    .create({
        email: "wawan.jb@gmail.com", // The email address of the ACME user / hosting provider
        agreeTos: true, // You must accept the ToS as the host which handles the certs
        configDir: "~/acme/", // Writable directory where certs will be saved
        communityMember: true, // Join the community to get notified of important updates
        telemetry: true, // Contribute telemetry data to the project
 
        // Using your express app:
        // simply export it as-is, then include it here
        app: app
 
        //, debug: true
    })
    .listen(443);