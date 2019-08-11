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

var Greenlock = require('greenlock-express')

var greenlock = Greenlock.create({
	// Let's Encrypt v2 is ACME draft 11
	version: "draft-11",

	server: "https://acme-v02.api.letsencrypt.org/directory",
	// Note: If at first you don't succeed, stop and switch to staging
	// https://acme-staging-v02.api.letsencrypt.org/directory

	// You MUST change this to a valid email address
	email: "wawan.jb@gmail.com",

	// You MUST NOT build clients that accept the ToS without asking the user
	agreeTos: true,

	// You MUST change these to valid domains
	// NOTE: all domains will validated and listed on the certificate
	approvedDomains: ["cachepastajoie.fr", "www.cachepastajoie.fr"],

	// You MUST have access to write to directory where certs are saved
	// ex: /home/foouser/acme/etc
	configDir: "~/acme/",

	// Get notified of important updates and help me make greenlock better
	communityMember: true

	//, debug: true
});

// spdy is a drop-in replacement for the https API
var spdyOptions = Object.assign({}, greenlock.tlsOptions);
spdyOptions.spdy = { protocols: ["h2", "http/1.1"], plain: false };
var server = require("spdy").createServer(spdyOptions, app)

server.listen(port)