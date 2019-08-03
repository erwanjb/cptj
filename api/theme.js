module.exports = (app) => {

	const connection = require('./connection');
    const mysql = require('mysql')
	const themesAPI = (ap) =>{
        ap.get("/themes", (req,res)=>{
            const q = "SELECT type FROM categorie";
            connection.query(q,(error,results,fields)=>{
                if(error) throw error;
                else{
                    let nbTab =[];
                    let tabTotal = [];
                    let sections={};
                    let categorie = [];
                    let tab = [];
                    let nb=5;
                    for(let i=0;i<results.length;i++){
                        categorie.push(results[i].type.replace(/'/gi,"\\'"));
                    }
                    sections.categorie=categorie;
                    for(let i = 0;i<categorie.length;i++){
                        let qTot = "SELECT * FROM join_vid_cat JOIN video ON join_vid_cat.id_video=video.id JOIN categorie ON join_vid_cat.id_categorie=categorie.id WHERE type="+mysql.escape(categorie[i])+" ORDER BY date DESC";
                        connection.query(qTot,(eTot,rTot,fTot)=>{
                            if(eTot) throw eTot;
                            else {
                                tabTotal.push(rTot)
                                let q2 = "SELECT * FROM join_vid_cat JOIN video ON join_vid_cat.id_video=video.id JOIN categorie ON join_vid_cat.id_categorie=categorie.id WHERE type="+mysql.escape(categorie[i])+" ORDER BY date DESC LIMIT 0, "+nb;
                                connection.query(q2,(e,r,f)=>{
                                    if(e) throw e;
                                    else{
                                        tab.push(r);
                                        let q3 ="SELECT * FROM join_vid_cat JOIN video ON join_vid_cat.id_video=video.id JOIN categorie ON join_vid_cat.id_categorie=categorie.id WHERE categorie.type="+mysql.escape(categorie[i])+" ORDER BY date DESC LIMIT "+nb+", 1";
                                        connection.query(q3,(e2,r2,f2)=>{
                                            if(e2) throw e2;
                                            else{
                                                if(r2.length==1){
                                                    nbTab[i]=nb;
                                                }
                                                if(i==categorie.length-1){
                                                    sections.nb = nbTab;
                                                    sections.tab=tab;
                                                    sections.tabTotal = tabTotal;
                                                    res.send(sections);
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        })
                    }
                    
                }
            })
        });

        ap.get("/themes/allVideo", (req,res)=>{
            if(req.session && req.session.adminConnected){
                const q = "SELECT * FROM video ORDER BY date DESC";
                connection.query(q,(error,results,fields)=>{
                    if(error) throw error;
                    else{
                        res.send(results)
                    }
                });
            }
        });

        ap.post('/themes/adCatVid', (req,res) => {
            if(req.session && req.session.adminConnected){
                const arr = req.body.arr
                for (let i = 0; i < arr.length; i++) {
                    const elem = arr[i]
                    if (elem.check) {
                        const sql = "INSERT INTO join_vid_cat (id_video, id_categorie) VALUES (" + mysql.escape(elem.vid) + ', (SELECT id FROM categorie WHERE type=' + mysql.escape(elem.cat) + '))'
                        connection.query(sql, (err) => {
                            if (err) throw err
                            if(i == arr.length - 1) {
                                res.send({status: 'OK'})
                            }
                        })
                    }
                    if(!elem.check) {
                        const sql = 'DELETE FROM join_vid_cat WHERE id_video=' + mysql.escape(elem.vid) + ' AND id_categorie=(SELECT id FROM categorie WHERE type=' + mysql.escape(elem.cat) + ')'
                        connection.query(sql, (err) => {
                            if (err) throw err
                            if(i == arr.length - 1) {
                                res.send({status: 'OK'})
                            }
                        })
                    }
                }
            } else {
                res.send({status: 'ER'})
            }
        })

        ap.get("/themes/themesBis",(req,res)=>{
            let tab=[];
            const q="SELECT video,date FROM join_vid_cat RIGHT JOIN video ON join_vid_cat.id_video=video.id WHERE join_vid_cat.id IS NULL";
            connection.query(q,(e,r,f)=>{
                if (e) throw e;
                else{
                    tab=r;
                    res.send(tab);
                }
            });
        });
        // 
        ap.post("/themes/addCategorie",(req, res)=>{
            let status={};
                if(req.session && req.session.adminConnected){
                const catBis=req.body.u.cat;
                let cat ="";
                for(let j=0;j<catBis.length;j++){
                    if(catBis[j]==" "){
                        cat+="_";
                    }else{
                        cat+=catBis[j];                    }
                }
                const q="SELECT * FROM categorie WHERE type="+mysql.escape(cat);
                connection.query(q,(e,r,f)=>{
                    if (e) throw e;
                    else{
                        if (r.length==1){
                            status.status="NO";
                            res.send(status);
                        }else{
                            const q2="INSERT INTO categorie (type) VALUE ("+mysql.escape(cat)+")";
                            connection.query(q2, (e2,r2,f2)=>{
                                if (e2) throw e2;
                                else{
                                    status.status="OK";
                                    res.send(status);
                                }
                            });
                        }
                    }
                });
            }else{
                status.status="ER";
                res.send(status);
            }
        });
        ap.post("/themes/supCategorie",(req, res)=>{
            let status={};
            if(req.session && req.session.adminConnected){
                const catBis=req.body.u.cat;
                let cat ="";
                for(let j=0;j<catBis.length;j++){
                    if(catBis[j]==" "){
                        cat+="_";
                    }else{
                        cat+=catBis[j];                    }
                }
                const q="SELECT * FROM categorie WHERE type="+mysql.escape(cat);
                connection.query(q,(e,r,f)=>{
                    if (e) throw e;
                    else{
                        if(r.length==0){
                            status.status="NO";
                            res.send(status);
                        }else{
                            const q2="DELETE FROM join_vid_cat WHERE id_categorie=(SELECT id FROM categorie WHERE type="+mysql.escape(cat)+")";
                            connection.query(q2,(e2,r2,f2)=>{
                                if (e2) throw e2;
                                else{
                                    const q3="DELETE FROM categorie WHERE type="+mysql.escape(cat);
                                    connection.query(q3, (e3,r3,f3)=>{
                                        if (e3) throw e3;
                                        else{
                                            status.status="OK";
                                            res.send(status);
                                        }
                                    })
                                }
                            });
                        }
                    }
                });
            }else{
                status.status="ER";
                res.send(status);
            }  
        });

        ap.post("/themes/supVideo",(req,res)=>{
            let status = {};
            if(req.session && req.session.adminConnected){
                let i = 0;
                let j;
                for(i;i<req.body.u.video.length-4;i++){
                    if(req.body.u.video.substring(i,i+5)=="src=\""){
                        break;
                    }
                }
                for(j=i+5;j<req.body.u.video.length;j++){
                    if(req.body.u.video.substring(j,j+1)=="\""){
                        break;
                    }
                }
                let video = req.body.u.video.substring(i+5,j);
                video = video.slice(30)
                const q = "SELECT * FROM video WHERE video="+mysql.escape(video);
                connection.query(q,(e,r,f)=>{
                    if(e) throw e;
                    else{
                        if (r.length==0){
                            status.status="NO";
                            res.send(status);
                        }else{
                            const q2 ="DELETE FROM join_vid_cat WHERE id_video=(SELECT id FROM video WHERE video="+mysql.escape(video)+")";
                            connection.query(q2,(e2,r2,f2)=>{
                                if (e2) throw e2;
                                else{
                                    const q3="DELETE FROM video WHERE video="+mysql.escape(video);
                                    connection.query(q3,(e3,r3,f3)=>{
                                        if(e3) throw e3;
                                        else{
                                            status.status="OK";
                                            res.send(status);
                                        }
                                    })
                                }
                            });         
                        }
                    }   
                });
            }else{
                status.status="ER";
                res.send(status);
            }
        });

        ap.post("/themes/addMore",(req,res)=>{
            const categorie = req.body.u.cat;
            const nb = req.body.u.nb;
            const q = "SELECT video.video, video.titre FROM join_vid_cat JOIN video ON join_vid_cat.id_video=video.id JOIN categorie ON join_vid_cat.id_categorie=categorie.id WHERE type="+mysql.escape(categorie)+" ORDER BY date DESC LIMIT "+nb+", 5";
            connection.query(q,(e,r,f)=>{
                if(e) throw e;
                else{
                    let sections={};
                    sections.tab=r;
                    const q2="SELECT video.video, video.titre FROM join_vid_cat JOIN video ON join_vid_cat.id_video=video.id JOIN categorie ON join_vid_cat.id_categorie=categorie.id WHERE type="+mysql.escape(categorie)+" ORDER BY date DESC LIMIT "+(parseInt(nb)+5)+", 1";
                    connection.query(q2,(e2,r2,f2)=>{
                        if(e2) throw e2;
                        else{
                            if(r2.length==1){
                                sections.nb=parseInt(nb)+5;
                            }
                            res.send(sections);
                        }
                    });
                }
            });
        });
        
	};
	return themesAPI(app);
};
