module.exports = (app) => {

	const mysql = require('mysql');

  	const connection = mysql.createConnection({
    	host     : 'localhost',
    	user     : 'root',
    	password : 'terminator',
    	database : 'cptj',
      port     : 3306
  	});
  	connection.connect();

  	const aproposAPI =(ap)=>{
  		ap.get("/apropos",(req,res)=>{
  			const q = "SELECT apropos FROM apropos";
  			connection.query(q,(e,r,f)=>{
  				if (e) throw e;
  				else{
  					res.send(r[0].apropos);
  				}
  			});
  		});
  		ap.post("/apropos/modifApropos",(req,res)=>{
  			const apropos = req.body.u;
  			const q= "DELETE FROM apropos";
  			connection.query(q,(e,r,f)=>{
  				if (e) throw e;
  				else{
  					const q2 = "INSERT INTO apropos (apropos) VALUE ('"+apropos+"')";
  					connection.query(q2, (e2,r2,f2)=>{
  						if (e2) throw e2;
  						else{
  							res.send("OK");
  						}
  					});
  				}
  			});
  		});
  	};
  	return aproposAPI(app);
 };