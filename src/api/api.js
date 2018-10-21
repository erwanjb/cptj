const express = require("express");
const cors = require("cors");
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser =require('cookie-parser');

const app = express();
const port = 8080;
const CryptoJS = require("crypto-js");

app.set('trust proxy', 1);

// permettre les appels AJAX cross-origins (CORS...)
app.use(cors({
  credentials: true,
  origin: ['https://test-ejb.ovh','https://www.test-ejb.ovh']
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: "Shh, its a secret!",
	saveUninitialized: false,
	resave: false
}));

// ## CORS middleware
// 
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs


app.get('/', function(req, res){
	if (req.session.toto){
		req.session.toto++;
	}else{
		req.session.toto=1;
	}
	res.send("toto vaut:" + req.session.toto);
	console.log(req.session);
});


const accueil = require("./accueil")(app);
const portail = require("./portail")(app);
const theme = require("./theme")(app);
const chrono = require("./chronologique")(app);
const actu = require("./actualite")(app);
const apropos = require("./apropos")(app);
const press = require("./press")(app); 
const reseau = require("./reseau")(app);
const titre = require("./titre")(app);

app.listen(port);

console.log(port);
