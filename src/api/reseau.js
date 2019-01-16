module.exports = (app) => {

  const connection = require('./connection');

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