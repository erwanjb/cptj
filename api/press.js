module.exports = (app) => {

	const connection = require('./connection');

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
        if(req.session && req.session.adminConnected){
    			const date =req.body.u.date;
    			const press =req.body.u.press;
          const titre =req.body.u.titre;
          const lienSource = req.body.u.lienSource;
          const lienInt = req.body.u.lienInt;
    			const q = "SELECT * FROM press WHERE titre='"+titre+"'";
    			connection.query(q,(e,r,f)=>{
    				if(e) throw e;
    				else{
    					if (r.length==1){
    						res.send("NO");
    					}else{
                const q2= "INSERT INTO press (press, titre, date, lien_source, lien_int) VALUES ('"+press+"', '"+titre+"', '"+date+"', "+((lienSource) ? "'" + lienSource + "'" : "NULL")+", "+((lienInt) ? "'" + lienInt + "'" : "NULL") +")";
                connection.query(q2,(e2,r2,f2)=>{
    							if(e2) throw e2;
    							else{
    								res.send("OK");
    							}
    						});
    					}
    				}
    			});
        }else{
          res.send("ER");
        }
  		});
      ap.post("/press/supPress",(req,res)=>{
        if(req.session && req.session.adminConnected){
          const titre = req.body.u;
          const q = "SELECT * FROM press WHERE titre='"+titre+"'";
          connection.query(q,(e,r,f)=>{
            if(e) throw e;
            else{
              if (r.length==0){
                res.send("NO");
              }else{
                const q2= "DELETE FROM press WHERE titre='"+titre+"'";
                connection.query(q2,(e2,r2,f2)=>{
                  if(e2) throw e2;
                  else{
                    res.send("OK");
                  }
                });
              }
            }
          });
        }else{
          res.send("ER");
        }
      });
      ap.post("/press/modifPress",(req,res)=>{
        let status = {};
        if(req.session && req.session.adminConnected){
          const titre = req.body.u;
          const q = "SELECT * FROM press WHERE titre='"+titre+"'";
          connection.query(q,(e,r,f)=>{
            if(e) throw e;
            else{
              if (r.length==0){
                status.status="NO";
                res.send(status);
              }else{
                status.status="OK";
                status.press ={
                  date: r[0].date,
                  press: r[0].press,
                  lienInt: r[0].lien_int,
                  lienSource: r[0].lien_source
                }
                res.send(status);
              }
            }
          });
        }else{
          status.status="ER";
          res.send(status);
        }
      });
      ap.post("/press/modifPressBis",(req,res)=>{
        if(req.session && req.session.adminConnected){
          const titre =req.body.u.titre;
          const press = req.body.u.press;
          console.log(press);
          let q = "";
          if(press.date){
            q += "UPDATE press SET date='"+press.date+"' WHERE titre='"+titre+"' ";
          }
          if(press.press){
            const sql = "UPDATE press SET press='"+press.press+"' WHERE titre='"+titre+"' ";
            q += (q) ? "\; " + sql : sql;
          }
          if(press.lienSource){
            const sql = "UPDATE press SET lien_source='"+press.lienSource+"' WHERE titre='"+titre+"' ";
            q += (q) ? "\; " + sql : sql;
          }
          if(press.lienInt){
            const sql = "UPDATE press SET lien_int='"+press.lienInt+"' WHERE titre='"+titre+"' ";
            q += (q) ? "\; " + sql : sql;
          }
          if(titre){
            const sql = "UPDATE press SET titre='"+press.titre+"' WHERE titre='"+titre+"' ";
            q += (q) ? "\; " + sql : sql;
          }
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

  	return pressAPI(app);
};