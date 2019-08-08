module.exports = (app) => {

const connection = require('./connection');
const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const sameName = fs.readdirSync('./dist/logo').find(curentFile => curentFile === file.originalname)
        if (sameName) {
            return cb(new Error(`Il existe déja une image du même nom dans la base`))
        }
        return cb(null, 'dist/logo')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage }).single('logo')

const mysql = require('mysql')
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

      ap.post('/accueil/upload', function (req, res, next) {
        if(req.session && req.session.adminConnected){
          upload(req, res, function (err) {
            if (err) {
              res.send({
                message: err.message,
                status: 'ER'
              })
            } else {
              res.send({
                message: `votre enregistrement c'est bien passé`,
                status: 'OK'
              })
            }
          })
        } else {
          res.send({
            message: "vous n'avez pas les droits, connectez vous",
            status: 'ER'
          })
        }
      })

      ap.get('/accueil/logo', (req,res) => {
        const sql = 'SELECT * FROM logo'
        connection.query(sql, (e,r,f) => {
          if (e) throw e;
          else {
            res.send(r)
          }
        })
      })

      ap.post('/accueil/verifTitreLogo', (req, res) => {
        const sql = 'SELECT * FROM logo WHERE titre=' + mysql.escape(req.body.u.titre)
        connection.query(sql, (e,r,f) => {
          if (e) throw e;
          else {
            if(!r.length) {
              res.send('OK')
            } else {
              res.send('ER')
            }
          }
        })
      })

      ap.post('/accueil/addLogo', (req, res) => {
        if(req.session && req.session.adminConnected){
          const logo = req.body.u
          const sql = `INSERT INTO logo (titre, url, width, height) VALUES (${mysql.escape(logo.titre)}, ${mysql.escape(logo.url)}, ${mysql.escape(logo.width)}, ${mysql.escape(logo.height)})` 
          connection.query(sql, (e,r,f) => {
            if (e) throw e;
            else {
              res.send('OK')
            }
          })
        } else {
          res.send('ER')
        }
      })

      ap.post('/accueil/deleteLogo', (req, res) => {
        if(req.session && req.session.adminConnected){
          const verif = 'SELECT url FROM logo WHERE titre=' + mysql.escape(req.body.u.titre)
          connection.query(verif, (e,r,f) => {
            if (e) throw e;
            else {
              if(r.length) {
                const url = r[0].url
                const sql = 'DELETE FROM logo WHERE titre=' + mysql.escape(req.body.u.titre)
                connection.query(sql, (e2,r2,f2) => {
                  if (e2) throw e2;
                  else {
                    file = './dist/logo/' + url
                    fs.unlinkSync(file)
                    res.send('OK')
                  }
                })
              } else {
                res.send('NO')
              }
            }
          })
        } else {
          res.send('ER')
        }
      })

      ap.post('/accueil/modifLogo', (req, res) => {
        if(req.session && req.session.adminConnected){
          const verif = 'SELECT * FROM logo WHERE titre=' + mysql.escape(req.body.u.titre)
          connection.query(verif, (e,r,f) => {
            if (e) throw e;
            else {
              if(r.length) {
                res.send({
                  status: 'OK', 
                  logo: {
                    width: r[0].width,
                    height: r[0].height
                  }
                })
              } else {
                res.send({status: 'NO'})
              }
            } 
          })
        } else {
          res.send({status: 'ER'})
        }
      })

  		ap.post("/apropos/modifApropos",(req,res)=>{
        if(req.session && req.session.adminConnected){
    			const apropos = req.body.u.apropos;
    			const q= "DELETE FROM apropos";
    			connection.query(q,(e,r,f)=>{
    				if (e) throw e;
    				else{
    					const q2 = "INSERT INTO apropos (apropos) VALUE ("+mysql.escape(apropos)+")";
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

      ap.post("/accueil/modifLogoBis",(req,res)=>{
        if(req.session && req.session.adminConnected){
          const titre =req.body.u.oldTitre;
          const logo = req.body.u;
          if(logo.titre){
            const sql = 'SELECT titre FROM logo WHERE titre='+mysql.escape(logo.titre)
            connection.query(sql, (error, result, field)=>{
              if(error) throw error;
              else{
                if(result.length){
                  res.send('NO')
                } else {
                  let q = "";
                  if(logo.width){
                    q += "UPDATE logo SET width="+mysql.escape(logo.width)+" WHERE titre="+mysql.escape(titre);
                  }
                  if(logo.height){
                    const sql = "UPDATE logo SET height="+mysql.escape(logo.height)+" WHERE titre="+mysql.escape(titre);
                    q += (q) ? "\; " + sql : sql;
                  }
                  if(logo.titre){
                    const sql = "UPDATE logo SET titre="+mysql.escape(logo.titre)+" WHERE titre="+mysql.escape(titre);
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
            if(logo.width){
              q += "UPDATE logo SET width="+mysql.escape(logo.width)+" WHERE titre="+mysql.escape(titre);
            }
            if(logo.height){
              const sql = "UPDATE logo SET height="+mysql.escape(logo.height)+" WHERE titre="+mysql.escape(titre);
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

  	};
  	return aproposAPI(app);
 };