module.exports = (app) => {

	const mysql = require('mysql');

  	const connection = mysql.createConnection({
    	host     : 'localhost',
    	user     : 'root',
    	password : 'terminator',
    	database : 'cptj'
  	});
  	connection.connect();

	const chronoAPI = (ap) =>{
        ap.get("/chrono", (req,res)=>{
            const nb = 10;
            const q = "SELECT * FROM video ORDER BY date DESC LIMIT 0, "+nb;
            connection.query(q,(error,results,fields)=>{
                if(error) throw error;
                else{
                    let sections = {
                        donnees:results
                    };
                    const q2 = "SELECT * FROM video ORDER BY date DESC LIMIT "+nb+", 1";
                    connection.query(q2,(e,r,f)=>{
                        if(e) throw e;
                        else{
                            if(r.length==1){
                                sections.nb=nb;
                                res.send(sections);
                            }else{
                                res.send(sections);
                            }
                        }
                    });
                }
            });
        });

        ap.post("/chrono/addMore",(req,res)=>{
            const nb = req.body.nb;
            const q = "SELECT * FROM video ORDER BY date DESC LIMIT "+nb+", 10";
            connection.query(q,(e,r,f)=>{
                if(e) throw e;
                else{
                    let sections = {
                        donnees: r
                    };
                    const q2 = "SELECT * FROM video ORDER BY date DESC LIMIT "+(parseInt(nb)+10)+", 1";
                    connection.query(q2,(e2,r2,f2)=>{
                        if(e2) throw e2;
                        else{
                            if (r2.length==1) {
                                sections.nb=(parseInt(nb)+10);
                                res.send(sections);
                            }else{
                                res.send(sections);
                            }
                        }
                    });
                }
            });
        });
	};
	return chronoAPI(app);
};