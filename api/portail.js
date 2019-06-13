module.exports = (app) => {

	const CryptoJS = require("crypto-js");
    const mysql = require('mysql')
  	const connection = require('./connection');

	const portailAPI = (ap) =>{
		ap.post("/portail", (req,res)=>{
            var encrypted = CryptoJS.SHA256(req.body.u.password).toString();
            console.log(encrypted)
            const r = "SELECT * FROM connexion WHERE identifiant="+mysql.escape(req.body.u.identifiant);
			connection.query(r, (error, results, fields) => {
        		if (error) throw error;
        		else{
        			if(results[0].motdepasse === encrypted){
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