module.exports = (app) => {
  const mysql = require('mysql')
	const connection = require('./connection');

	const projetAPI =(ap)=>{
		ap.get('/projet', (req, res) => {
			const sql = 'SELECT * FROM projet ORDER BY date';
			connection.query(sql,(e,r,f)=>{
				if(e) throw e;
				else{
					for(let i = 0; i < r.length; i++) {
						const sql2 = 'SELECT * FROM projet INNER JOIN soutien ON projet.id=soutien.id_projet INNER JOIN ip ON soutien.id_ip=ip.id WHERE projet.titre='+mysql.escape(r[i].titre)
						connection.query(sql2,(e2,r2,f2)=>{
							if (e2) throw e2;
							else{
								r[i].soutien = r2.length;
								if (i == r.length -1) {
									res.send(r)
								}
							}
						})
					}
				}
			});
		})
		ap.post('/projet/addSoutien', (req, res) => {
			const ip = req.connection.remoteAddress
			const sql = 'SELECT * FROM ip WHERE ip='+mysql.escape(ip)
			connection.query(sql, (e,r,f) => {
				if(e) throw e;
				else {
					if (r.length === 0) {
						const sql2 = 'INSERT INTO ip (ip) VALUES (' + mysql.escape(ip) + ')';
						connection.query(sql2, (e2,r2,f2) => {
							if(e2) throw e2;
							else {
								const sql3 = 'INSERT INTO soutien (id_projet, id_ip) VALUES (' + mysql.escape(req.body.u.id_projet) + ', (SELECT id FROM ip WHERE ip=' + mysql.escape(ip) + '))'
								connection.query(sql3, (e3,r3,f3) => {
									if (e3) throw e3;
									else {
										res.send('OK')
									}
								})
							}
						})
					} else {
						const sql2 = 'SELECT * FROM soutien WHERE id_projet=' + mysql.escape(req.body.u.id_projet) + ' AND id_ip=(SELECT id FROM ip WHERE ip=' + mysql.escape(ip) + ')'
						connection.query(sql2, (e2,r2,f2) => {
							if(e2) throw e2;
							else {
								if(r2.length === 0) {
									const sql3 = 'INSERT INTO soutien (id_projet, id_ip) VALUES (' + mysql.escape(req.body.u.id_projet) + ', (SELECT id FROM ip WHERE ip=' + mysql.escape(ip) + '))'
									connection.query(sql3, (e3,r3,f3) => {
										if (e3) throw e3;
										else {
											res.send('OK')
										}
									})
								} else {
									res.send('NO')
								}
							}
						})
					}	
				}
			})
		})

    ap.post("/projet/addProjet",(req,res)=>{
      if(req.session && req.session.adminConnected){
        const date =req.body.u.date;
        const proj =req.body.u.proj;
        const titre = req.body.u.titre;
        const lienSource = req.body.u.lienSource;
        const lienInt = req.body.u.lienInt;
        const q = "SELECT * FROM projet WHERE titre="+mysql.escape(titre);
        connection.query(q,(e,r,f)=>{
         if(e) throw e;
          else{
            if (r.length==1){
              res.send("NO");
            }else{
              const q2= "INSERT INTO projet (description, titre, date, lien_source, lien_int) VALUES ("+mysql.escape(proj)+", "+mysql.escape(titre)+", "+mysql.escape(date)+", "+((lienSource) ? mysql.escape(lienSource) : "NULL")+", "+((lienInt) ? mysql.escape(lienInt) : "NULL") +")";
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
    ap.post("/projet/supProjet",(req,res)=>{
      if(req.session && req.session.adminConnected){
        const titre = req.body.u.proj;
        const q = "SELECT * FROM projet WHERE titre="+mysql.escape(titre);
        connection.query(q,(e,r,f)=>{
          if(e) throw e;
          else{
            if (r.length==0){
              res.send("NO");
            }else{
              const q2= "DELETE FROM projet WHERE titre="+mysql.escape(titre);
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
    ap.post("/projet/modifProjet",(req,res)=>{
      let status = {};
      if(req.session && req.session.adminConnected){
        const titre = req.body.u.titre;
        const q = "SELECT * FROM projet WHERE titre="+mysql.escape(titre);
        connection.query(q,(e,r,f)=>{
          if(e) throw e;
          else{
            if (r.length==0){
              status.status="NO";
              res.send(status);
            }else{
              status.status="OK";
              status.proj ={
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
    ap.post("/projet/modifProjetBis",(req,res)=>{
      if(req.session && req.session.adminConnected){
        const titre =req.body.u.oldTitre;
        const proj = req.body.u;
        if(proj.newTitre){
          const sql = 'SELECT titre FROM projet WHERE titre='+mysql.escape(proj.newTitre)
          connection.query(sql, (error, result, field)=>{
            if(error) throw error;
            else{
              if(result.length){
                res.send('NO')
              } else {
                let q = "";
                if(proj.date){
                  q += "UPDATE projet SET date="+mysql.escape(proj.date)+" WHERE titre="+mysql.escape(titre);
                }
                if(proj.proj){
                  const sql = "UPDATE projet SET description="+mysql.escape(proj.proj)+" WHERE titre="+mysql.escape(titre);
                  q += (q) ? "\; " + sql : sql;
                }
                if(proj.lienSource){
                  const sql = "UPDATE projet SET lien_source="+mysql.escape(proj.lienSource)+" WHERE titre="+mysql.escape(titre);
                  q += (q) ? "\; " + sql : sql;
                }
                if(proj.lienInt){
                  const sql = "UPDATE projet SET lien_int="+mysql.escape(proj.lienInt)+" WHERE titre="+mysql.escape(titre);
                  q += (q) ? "\; " + sql : sql;
                }
                if(proj.newTitre){
                  const sql = "UPDATE projet SET titre="+mysql.escape(proj.newTitre)+" WHERE titre="+mysql.escape(titre);
                  q += (q) ? "\; " + sql : sql;
                }
                connection.query(q,(e,r,f)=>{
                  if(e) throw e;
                  else{
                    res.send("OK");
                  }
                });
              }
            }
          })
        } else {
          let q = "";
          if(proj.date){
            q += "UPDATE projet SET date="+mysql.escape(proj.date)+" WHERE titre="+mysql.escape(titre);
          }
          if(proj.proj){
            const sql = "UPDATE projet SET description="+mysql.escape(proj.proj)+" WHERE titre="+mysql.escape(titre);
            q += (q) ? "\; " + sql : sql;
          }
          if(proj.lienSource){
            const sql = "UPDATE projet SET lien_source="+mysql.escape(proj.lienSource)+" WHERE titre="+mysql.escape(titre);
            q += (q) ? "\; " + sql : sql;
          }
          if(proj.lienInt){
            const sql = "UPDATE projet SET lien_int="+mysql.escape(proj.lienInt)+" WHERE titre="+mysql.escape(titre);
            q += (q) ? "\; " + sql : sql;
          }
          if(proj.newTitre){
            const sql = "UPDATE projet SET titre="+mysql.escape(proj.newTitre)+" WHERE titre="+mysql.escape(titre);
            q += (q) ? "\; " + sql : sql;
          }
          connection.query(q,(e,r,f)=>{
            if(e) throw e;
            else{
              res.send("OK");
            }
          });
        }
      }else{
        res.send("ER");
      }
    });
	}
	return projetAPI(app);
}