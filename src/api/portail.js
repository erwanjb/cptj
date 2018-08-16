module.exports = (app) => {

	const mysql = require('mysql');
	const CryptoJS = require("crypto-js");

  	const connection = mysql.createConnection({
    	host     : 'localhost',
    	user     : 'root',
    	password : 'terminator',
    	database : 'cptj',
        port     : 3306
  	});
  	connection.connect();

	const portailAPI = (ap) =>{
		ap.post("/portail", (req,res)=>{
			const r ="SELECT * FROM connexion WHERE identifiant='"+req.body.u.identifiant+"' AND motdepasse='"+CryptoJS.MD5(req.body.u.password).toString()+"'";
			connection.query(r, (error, results, fields) => {
        		if (error) throw error;
        		else{
        			if(results.length==1){
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
	};
	return portailAPI(app);
};