<template lang="html">
    <div id="main_actualite">
    	<h2>Actualités</h2>
    	<div id="admin" v-if="$session.exists()">
    		<form @submit.prevent class="envoie">
    			<p>ajouter une actualité</p>
    			<textarea v-model="actu.actu" cols="40" rows="6"></textarea><br>
    			<label for="titre">titre</label><input id="titre" type="text" v-model="actu.titre"><br>
    			<label for="date">date</label><input id="date" type="date" v-model="actu.date"><br>
    			<label for="lienSource">source du lien</label><input id="lienSource" type="text" v-model="actu.lienSource"><br>
    			<label for="lienInt">intitulé du lien</label><input id="lienInt" type="text" v-model="actu.lienInt"><br>
    			<button @click="addActu()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>supprimer une actualité</p>
    			<input type="date" v-model="actuBis"><br>
    			<button @click="supActu()">click</button>
    		</form>
    		<p id="message">{{message}}</p>
    	</div>
    	<div id="main_actu">
    		<section v-for="t in tab" class="actualite">
    			<h3 class="titre">{{t.titre}} :</h3>
    			<div class="actu">
	    			<p v-html="t.actualite"></p>
	    			<span v-if="t.lien_source&&t.lien_int"><a :href="t.lien_source">{{t.lien_int}}</a></span>
	    		</div>
    		</section>
    	</div>
  	</div>
</template>

<script>
import axios from "axios";
export default {
	data(){
		return{
			tab:[],
			actu:{
				actu:null,
				titre:null,
				date:null,
				lienSource:null,
				lienInt:null
			},
			actuBis:null,
			message:null
		}
	},
	methods:{
		nl2br (str, is_xhtml) {   
    		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
		},
		addActu(){
			if(this.$session.exists()){
				if (this.actu.actu!=null&&this.actu.date!=null&&this.actu.titre!=null){
					if(this.actu.lienSource==null||this.actu.lienSource.substring(0,4)=="http"){
						axios({
							method:"post",
							url:"/actualite/addActu",
							data:{
								u:{
									actu:this.nl2br(this.actu.actu).replace(/'/gi,"\\'"),
									titre:this.actu.titre.replace(/'/gi,"\\'"),
									date:this.actu.date,
									lienSource:this.actu.lienSource,
									lienInt:this.actu.lienInt.replace(/'/gi,"\\'")
								}
							}
						})
						.then(res=>{
							if (res.data=="NO") {
								this.message="il y a déjà une actualité à cette date";
							}else{
								this.message="l'actualité a été ajouté";
							}
						});
					}else{
						this.message="veuiller rentrer un lien http(s) pour la source";
					}
				}else{
					this.message="veuillez saisir les champs";
				}
			}
		},
		supActu(){
			if(this.$session.exists()){
				if(this.actuBis!=null){
					axios({
						method:"post",
						url:"/actualite/supActu",
						data:{
							u:this.actuBis
						}
					})
					.then(res=>{
						if (res.data=="NO") {
							this.message="il n'y a pas d'actu à cette date";
						}else{
							this.message="l'actualité a été supprimé";
						}
					});
				}else{
					this.message="veuillez saisir les champs";
				}
			}
		}
	},
	mounted(){
		axios({
			method:"get",
			url:"/actualite"
		})
		.then(res=>{
			this.tab=res.data;
		});
	}
}
</script>

<style lang="scss" scoped>
.actualite{
	margin-left:30%;
	display:flex;
	margin-bottom:100px;
}
.titre{
	margin-right:50px;		
}
.actu{
	margin:auto;
	text-align:left;
}
@media screen and (max-width:500px){
	.actualite{
		display:block;
		margin-left:0;
	}
	.actualite span{
		display:block;
	}
	.actu{
		margin-left:20px;
	}
}
</style>