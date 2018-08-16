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