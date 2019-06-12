module.exports = (app) => {

	const CryptoJS = require("crypto-js");
    const mysql = require('mysql')
  	const connection = require('./connection');

	const portailAPI = (ap) =>{
		ap.post("/portail", (req,res)=>{
            var password = 'teyfdsiu';
            var encrypted = CryptoJS.AES.encrypt(req.body.u.password, password).toString();
            var decrypted  = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);
            const r = "SELECT * FROM connexion WHERE identifiant="+mysql.escape(req.body.u.identifiant);
			connection.query(r, (error, results, fields) => {
        		if (error) throw error;
        		else{
        			if(CryptoJS.AES.decrypt(results[0].motdepasse, password).toString(CryptoJS.enc.Utf8) === decrypted){
        				req.session.adminConnected=true;
                        const loged = {
                            token:true
                        };
						res.send(loged);
        			}else{
        				res.send(false);
        			}
        		}
        	});
		});
        ap.get("/portail",(req,res)=>{
            if(req.session.adminConnected){
                res.send(req.session.adminConnected);
            }else{
                res.send("not found");
            }
        });
        ap.post('/deco', (req, res)=>{
            req.session.destroy()
            res.send('OK')
        })
	};
	return portailAPI(app);
};