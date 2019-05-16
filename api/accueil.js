module.exports = (app) => {

	const connection = require('./connection');

  	const accueilAPI =(ap)=>{
      ap.get("/accueil",(req,res)=>{
        const q = "SELECT video FROM video ORDER BY date DESC LIMIT 0, 1";
        connection.query(q,(error,results,fields)=>{
          if (error) throw error;
          else{
            res.send(results[0].video);
          }
        });
      });
    };
    return accueilAPI(app);
};