module.exports = (app) => {

	const connection = require('./connection');

	const themesAPI = (ap) =>{
        ap.get("/themes", (req,res)=>{
            const q = "SELECT type FROM categorie";
            connection.query(q,(error,results,fields)=>{
                if(error) throw error;
                else{
                    let nbTab =[];
                    let sections={};
                    let categorie = [];
                    let tab = [];
                    let nb=5;
                    for(let i=0;i<results.length;i++){
                        categorie.push(results[i].type.replace(/'/gi,"\\'"));
                    }
                    sections.categorie=categorie;
                    for(let i = 0;i<categorie.length;i++){
                        let q2 = "SELECT * FROM join_vid_cat JOIN video ON join_vid_cat.id_video=video.id JOIN categorie ON join_vid_cat.id_categorie=categorie.id WHERE type='"+categorie[i]+"' ORDER BY date DESC LIMIT 0, "+nb;
                        connection.query(q2,(e,r,f)=>{
                            if(e) throw e;
                            else{
                                tab.push(r);
                                let q3 ="SELECT * FROM join_vid_cat JOIN video ON join_vid_cat.id_video=video.id JOIN categorie ON join_vid_cat.id_categorie=categorie.id WHERE categorie.type='"+categorie[i]+"' ORDER BY date DESC LIMIT "+nb+", 1";
                                connection.query(q3,(e2,r2,f2)=>{
                                    if(e2) throw e2;
                                    else{
                                        if(r2.length==1){
                                            nbTab[i]=nb;
                                        }
                                        if(i==categorie.length-1){
                                            sections.nb = nbTab;
                                            sections.tab=tab;
                                            res.send(sections);
                                        }
                                    }
                                });
                            }
                        });
                    }
                    
                }
            });
        });
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
        ap.post("/themes/addVideo",(req,res)=>{
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
                const video = req.body.u.video.substring(i+5,j);
                const q = "SELECT video FROM video WHERE video='"+video+"'";
                connection.query(q,(error,results,fields)=>{
                    if(error) throw error;
                    else{    
                        if(results.length==1){
                            status.status="NO";
                            res.send(status);
                        }else{
                            const q2="INSERT INTO video (video, titre, date) VALUES ('"+video+"', '"+req.body.u.titre+"', '"+req.body.u.date+"')";
                            connection.query(q2, (e,r,f)=>{
                                if (e) throw e;
                                else{
                                    let q3= '';
                                    for (let i=0;i<req.body.u.categorie.length;i++){
                                        const sql="INSERT INTO join_vid_cat (id_video, id_categorie) SELECT video.id, categorie.id FROM video JOIN categorie WHERE video.video='"+video+"' AND categorie.type='"+req.body.u.categorie[i]+"'";
                                        q3 += q3 ? ' \; ' + sql : sql;
                                    }
                                    connection.query(q3,(e2,r2,f2)=>{
                                        if (e2) throw e2;
                                        else{
                                            status.status="OK";
                                            res.send(status);
                                        }
                                    });
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
                for(i;i<req.body.u.length-4;i++){
                    if(req.body.u.substring(i,i+5)=="src=\""){
                        break;
                    }
                }
                for(j=i+5;j<req.body.u.length;j++){
                    if(req.body.u.substring(j,j+1)=="\""){
                        break;
                    }
                }
                const video = req.body.u.substring(i+5,j);
                const q = "SELECT * FROM video WHERE video='"+video+"'";
                connection.query(q,(e,r,f)=>{
                    if(e) throw e;
                    else{
                        if (r.length==0){
                            status.status="NO";
                            res.send(status);
                        }else{
                            const q2 ="DELETE FROM join_vid_cat WHERE id_video=(SELECT id FROM video WHERE video='"+video+"')";
                            connection.query(q2,(e2,r2,f2)=>{
                                if (e2) throw e2;
                                else{
                                    const q3="DELETE FROM video WHERE video='"+video+"'";
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
        ap.post("/themes/addCategorie",(req, res)=>{
            let status={};
                if(req.session && req.session.adminConnected){
                const catBis=req.body.u;
                let cat ="";
                for(let j=0;j<catBis.length;j++){
                    if(catBis[j]==" "){
                        cat+="_";
                    }else{
                        cat+=catBis[j];                    }
                }
                const q="SELECT * FROM categorie WHERE type='"+cat+"'";
                connection.query(q,(e,r,f)=>{
                    if (e) throw e;
                    else{
                        if (r.length==1){
                            status.status="NO";
                            res.send(status);
                        }else{
                            const q2="INSERT INTO categorie (type) VALUE ('"+cat+"')";
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
                const catBis=req.body.u;
                let cat ="";
                for(let j=0;j<catBis.length;j++){
                    if(catBis[j]==" "){
                        cat+="_";
                    }else{
                        cat+=catBis[j];                    }
                }
                const q="SELECT * FROM categorie WHERE type='"+cat+"'";
                connection.query(q,(e,r,f)=>{
                    if (e) throw e;
                    else{
                        if(r.length==0){
                            status.status="NO";
                            res.send(status);
                        }else{
                            const q2="DELETE FROM join_vid_cat WHERE id_categorie=(SELECT id FROM categorie WHERE type='"+cat+"')";
                            connection.query(q2,(e2,r2,f2)=>{
                                if (e2) throw e2;
                                else{
                                    const q3="DELETE FROM categorie WHERE type='"+cat+"'";
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
        ap.post("/themes/addMore",(req,res)=>{
            const categorie = req.body.u.cat;
            const nb = req.body.u.nb;
            const q = "SELECT video.video, video.titre FROM join_vid_cat JOIN video ON join_vid_cat.id_video=video.id JOIN categorie ON join_vid_cat.id_categorie=categorie.id WHERE type='"+categorie+"' ORDER BY date DESC LIMIT "+nb+", 5";
            connection.query(q,(e,r,f)=>{
                if(e) throw e;
                else{
                    let sections={};
                    sections.tab=r;
                    const q2="SELECT video.video, video.titre FROM join_vid_cat JOIN video ON join_vid_cat.id_video=video.id JOIN categorie ON join_vid_cat.id_categorie=categorie.id WHERE type='"+categorie+"' ORDER BY date DESC LIMIT "+(parseInt(nb)+5)+", 1";
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
        ap.post("/themes/modifVideo",(req,res)=>{
            let status = {};
            if(req.session && req.session.adminConnected){
                let i = 0;
                let j;
                for(i;i<req.body.u.length-4;i++){
                    if(req.body.u.substring(i,i+5)=="src=\""){
                        break;
                    }
                }
                for(j=i+5;j<req.body.u.length;j++){
                    if(req.body.u.substring(j,j+1)=="\""){
                        break;
                    }
                }
                const video = req.body.u.substring(i+5,j);
                const q = "SELECT * FROM video WHERE video='"+video+"'";
                connection.query(q,(e,r,f)=>{
                    if(e) throw e;
                    else{
                        console.log(r);
                        if (r.length==0) {
                            status.status="NO";
                            res.send(status);
                        }else{
                            let videoBis= {
                                date: r[0].date,
                                titre: r[0].titre
                            }
                            const q2 = "SELECT type FROM join_vid_cat JOIN video ON join_vid_cat.id_video=video.id JOIN categorie ON join_vid_cat.id_categorie=categorie.id WHERE video='"+video+"'"
                            connection.query(q2,(e2,r2,f2)=>{
                                if (e2) throw e2;
                                else{
                                    const cat = [];
                                    for (var i = 0; i < r2.length; i++) {
                                        cat.push(r2[i].type)
                                    }
                                    videoBis.categorie = cat;
                                    status.status="OK";
                                    status.video=videoBis;
                                    res.send(status);
                                    console.log(cat, r2)
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
        ap.post("/themes/modifVideoBis",(req,res)=>{
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
                const video = req.body.u.video.substring(i+5,j);
                const date = req.body.u.date;
                let q ="";
                if(date){
                    q += "UPDATE video SET date='"+date+"' WHERE video='"+video+"' ";
                }
                const titre = req.body.u.titre;
                if(titre){
                    const sql = "UPDATE video SET titre='"+titre+"' WHERE video='"+video+"' ";
                    q += (q) ? "\; " + sql : sql;
                }
                const categorie = req.body.u.categorie;
                if(categorie.length){
                    const sql = "DELETE FROM join_vid_cat WHERE id_video=(SELECT id FROM video WHERE video='"+video+"') ";
                    q += (q) ? "\; " + sql : sql;
                    for (let k = 0; k < categorie.length; k++){
                        q += "\; INSERT INTO join_vid_cat (id_video, id_categorie) SELECT video.id, categorie.id FROM video JOIN categorie WHERE video.video='"+video+"' AND categorie.type='"+categorie[k]+"' ";
                    } 
                }
                console.log(q)
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
	return themesAPI(app);
};
