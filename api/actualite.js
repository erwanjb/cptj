module.exports = (app) => {
  const mysql = require('mysql')
	const connection = require('./connection');

  	const actuAPI =(ap)=>{
  		ap.get("/actualite",(req,res)=>{
  			const q = "SELECT * FROM actualites ORDER BY date";
  			connection.query(q,(e,r,f)=>{
  				if(e) throw e;
  				else{
  					res.send(r);
  				}
  			});
  		});
  		ap.post("/actualite/addActu",(req,res)=>{
        if(req.session && req.session.adminConnected){
          const date =req.body.u.date;
          const actu =req.body.u.actu;
          const titre = req.body.u.titre;
          const lienSource = req.body.u.lienSource;
          const lienInt = req.body.u.lienInt;
          const q = "SELECT * FROM actualites WHERE titre="+mysql.escape(titre);
          connection.query(q,(e,r,f)=>{
           if(e) throw e;
            else{
              if (r.length==1){
                res.send("NO");
              }else{
                const q2= "INSERT INTO actualites (actualite, titre, date, lien_source, lien_int) VALUES ("+mysql.escape(actu)+", "+mysql.escape(titre)+", "+mysql.escape(date)+", "+((lienSource) ? mysql.escape(lienSource) : "NULL")+", "+((lienInt) ? mysql.escape(lienInt) : "NULL") +")";
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
      ap.post("/actualite/supActu",(req,res)=>{
        if(req.session && req.session.adminConnected){
          const titre = req.body.u;
          const q = "SELECT * FROM actualites WHERE titre="+mysql.escape(titre);
          connection.query(q,(e,r,f)=>{
            if(e) throw e;
            else{
              if (r.length==0){
                res.send("NO");
              }else{
                const q2= "DELETE FROM actualites WHERE titre="+mysql.escape(titre);
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
      ap.post("/actu/modifActu",(req,res)=>{
        let status = {};
        if(req.session && req.session.adminConnected){
          const titre = req.body.u;
          const q = "SELECT * FROM actualites WHERE titre="+mysql.escape(titre);
          connection.query(q,(e,r,f)=>{
            if(e) throw e;
            else{
              if (r.length==0){
                status.status="NO";
                res.send(status);
              }else{
                status.status="OK";
                status.actu ={
                  date: r[0].date,
                  actu: r[0].actu,
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
      ap.post("/actu/modifActuBis",(req,res)=>{
        if(req.session && req.session.adminConnected){
          const titre =req.body.u.titre;
          const actu = req.body.u.actu;
          console.log(actu);
          let q = "";
          if(actu.date){
            q += "UPDATE actualites SET date="+mysql.escape(actu.date)+" WHERE titre="+mysql.escape(titre);
          }
          if(actu.actu){
            const sql = "UPDATE actualites SET actualite="+mysql.escape(actu.actu)+" WHERE titre="+mysql.escape(titre);
            q += (q) ? "\; " + sql : sql;
          }
          if(actu.lienSource){
            const sql = "UPDATE actualites SET lien_source="+mysql.escape(actu.lienSource)+" WHERE titre="+mysql.escape(titre);
            q += (q) ? "\; " + sql : sql;
          }
          if(actu.lienInt){
            const sql = "UPDATE actualites SET lien_int="+mysql.escape(actu.lienInt)+" WHERE titre="+mysql.escape(titre);
            q += (q) ? "\; " + sql : sql;
          }
          if(titre){
            const sql = "UPDATE actualites SET titre="+mysql.escape(actu.titre)+" WHERE titre="+mysql.escape(titre);
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

  	return actuAPI(app);
};