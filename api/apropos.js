module.exports = (app) => {

const connection = require('./connection');

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
        if(req.session && req.session.adminConnected){
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
        }else{
          res.send("ER");
        }
  		});
  	};
  	return aproposAPI(app);
 };