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

  const reseauAPI = (ap)=>{
    ap.get("/reseau", (req,res)=>{
      const q = "SELECT * FROM reseau";
      connection.query(q, (error, results, fields) => {
        if (error) throw error;
        else{
          res.send(results);
        }
      });
    });

    ap.post("/reseau/changeRes",(req,res)=>{
      if(req.session && req.session.adminConnected){
        const reseau = req.body.u.res;
        const follow = req.body.u.follow;
        const q = "UPDATE reseau SET follow='"+follow+"' WHERE reseau='"+reseau+"'";
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
  return reseauAPI(app);
};