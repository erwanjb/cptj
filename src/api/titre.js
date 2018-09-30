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

  	const titreAPI =(ap)=>{
  		ap.post("/titre",(req,res)=>{
  			const page = req.body.u.page;
        const q = "SELECT * FROM titre WHERE page='"+page+"'";
        connection.query(q,(e,r,f)=>{
          if(e) throw e;
          else{
            res.send(r[0].titre);
          }
        });
  		});
  		ap.post("/titre/modifTitre",(req,res)=>{
        if(req.session && req.session.adminConnected){
          const page = req.body.u.page;
          const titre = req.body.u.titre;
          const q = "UPDATE titre SET titre='"+titre+"' WHERE page='"+page+"'";
          connection.query(q,(e,r,f)=>{
            if(e) throw e;
            else{
              res.send("OK");
            }
          });
        }else{
          res.send("ER");
        }
  		});
  	};
  	return titreAPI(app);
 };