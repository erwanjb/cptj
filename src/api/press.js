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

  	const pressAPI =(ap)=>{
  		ap.get("/press",(req,res)=>{
  			const q = "SELECT * FROM press ORDER BY date";
  			connection.query(q,(e,r,f)=>{
  				if(e) throw e;
  				else{
  					res.send(r);
  				}
  			});
  		});
  		ap.post("/press/addPress",(req,res)=>{
  			const date =req.body.u.date;
  			const press =req.body.u.press;
        const titre =req.body.u.titre;
        const lienSource = req.body.u.lienSource;
        const lienInt = req.body.u.lienInt;
  			const q = "SELECT * FROM press WHERE date='"+date+"'";
  			connection.query(q,(e,r,f)=>{
  				if(e) throw e;
  				else{
  					if (r.length==1){
  						res.send("NO");
  					}else{
              const q2= "INSERT INTO press (press, titre, date, lien_source, lien_int) VALUES ('"+press+"', '"+titre+"', '"+date+"', '"+lienSource+"', '"+lienInt+"')";
  						connection.query(q2,(e2,r2,f2)=>{
  							if(e2) throw e2;
  							else{
  								res.send("OK");
  							}
  						});
  					}
  				}
  			});
  		});
      ap.post("/press/supPress",(req,res)=>{
        const date = req.body.u;
        const q = "SELECT * FROM press WHERE date='"+date+"'";
        connection.query(q,(e,r,f)=>{
          if(e) throw e;
          else{
            if (r.length==0){
              res.send("NO");
            }else{
              const q2= "DELETE FROM press WHERE date='"+date+"'";
              connection.query(q2,(e2,r2,f2)=>{
                if(e2) throw e2;
                else{
                  res.send("OK");
                }
              });
            }
          }
        });
      });
  	};

  	return pressAPI(app);
};