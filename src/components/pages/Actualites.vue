<template lang="html">
    <div id="main_actualite">
    	<h2 v-if="titre">{{titre}}</h2>
    	<div v-if="$session.exists()">
    		<button @click="showTitre()">change titre</button>
    		<form @submit.prevent v-if="bool2" id="titre">
    			<input type="text" v-model="titreBis">
    			<button @click="modifTitre()">click</button>
    		</form>
    	</div>
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
    			<input type="text" v-model="actuBis" placeholder="titre"><br>
    			<button @click="supActu()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>modifier un élément d'une atualité</p>
    			<input type="text" v-model="actuBisBis.titre">
    			<button @click="modifActu()">click</button>
    			<div v-if="bool">
    				<p>quel(s) élément(s) de la revue de actu voudriez vous changer ?</p>
    				<label for="titre">titre</label><input type="checkbox" v-model="choix[0]" value="titre" id="titre">
    				<div v-if="choix[0]">
    					<p>le titre de l'actualité est: {{ actuBisBis.titre }}</p>
						<input type="text" v-model="actuBisBisBis.titre" placeholder="change titre">
    				</div>
    				<hr>
    				<label for="actu">actualité</label><input type="checkbox" v-model="choix[1]" value="actu" id="actu">
    				<div v-if="choix[1]">
    					<textarea v-model="actuBisBisBis.actu" placeholder="change revue de actue"></textarea>
    				</div>
    				<hr>
    				<label for="date">date</label><input type="checkbox" v-model="choix[2]" value="date" id="date">
    				<div v-if="choix[2]">
    					<p>la  date de l'actualité est: {{ actuBisBis.date }}</p>
						<input type="date" v-model="actuBisBisBis.date" placeholder="jj/mm/aaaa">
    				</div>
    				<hr>
    				<label for="lien">lien</label><input type="checkbox" v-model="choix[3]" value="lien" id="lien">
    				<div v-if="choix[3]">
    					<div v-if="actuBisBis.lienSource">
    						<p>la source du lien est: {{ actuBisBis.lienSource }}</p>
    						<p>l'intilulé du lien est: {{ actuBisBis.lienInt }}</p>
    					</div>
    					<p v-else>pas de lien pour cette actualité, en ajouter?</p>
    					<input type="text" v-model="actuBisBisBis.lienSource" placeholder="change source du lien">
						<input type="text" v-model="actuBisBisBis.lienInt" placeholder="change intitulé du lien">
    				</div>
    				<hr>
    				<button @click="modifActuBis()">modifier</button>
    			</div>
    		</form>
    		<p id="message">{{message}}</p>
    	</div>
    	<div id="main_actu">
    		<section v-for="t in tab" class="actualite">
    			<h3 class="titre">{{t.titre}}</h3>
    			<div class="actu">
	    			<p v-html="t.actualite"></p>
	    			<span v-if="t.lien_source && t.lien_int"><a :href="t.lien_source">{{t.lien_int}}</a></span>
	    		</div>
    		</section>
    	</div>
  	</div>
</template>

<script>
import axios from "axios";
export default {
	computed: {
		tab(){
			return this.$store.state.tabA
		}
	},
	data(){
		return{
			actu:{
				actu:null,
				titre:null,
				date:null,
				lienSource:null,
				lienInt:null
			},
			actuBis:null,
			actuBisBis:{
				actu:null,
				titre:null,
				date:null,
				lienSource:null,
				lienInt:null
			},
			actuBisBisBis:{
				actu:null,
				titre:null,
				date:null,
				lienSource:null,
				lienInt:null
			},
			message:null,
			choix:[null,null,null,null],
			bool:false,
			titre:null,
			titreBis:null,
			bool2:false,
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
									lienInt:(this.actu.lienInt) ? this.actu.lienInt.replace(/'/gi,"\\'") : null
								}
							}
						})
						.then(res=>{
							if (res.data=="NO") {
								this.message="il y a déjà une actualité à ce titre";
							}else if(res.data=="ER"){
								this.message="vous n'avez pas les droits, connectez vous";
							}else{
								this.message="l'actualité a été ajouté";
								this.$store.dispatch('importActu')
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
							u:{
								actu: this.actuBis.replace(/'/gi,"\\'")
							}
						}
					})
					.then(res=>{
						if (res.data=="NO") {
							this.message="il n'y a pas d'actu à ce titre";
						}else if(res.data=="ER"){
							this.message="vous n'avez pas les droits, connectez vous";
						}else{
							this.message="l'actualité a été supprimé";
							this.$store.dispatch('importActu')
						}
					});
				}else{
					this.message="veuillez saisir les champs";
				}
			}
		},
		modifActu(){
			if(this.$session.exists()){
				if(this.actuBisBis.titre!=null){
					axios({
						method:"post",
						url:"/actu/modifActu",
						data:{
							u:{
								titre: this.actuBisBis.titre
							}
						}
					})
					.then(res=>{
						if (res.data.status=="NO") {
							this.message="il n'y a pas d'actualité à ce titre";
							this.bool=false;
						}else if(res.data.status=="ER"){
							this.message="vous n'avez pas les droits, connectez vous";
							this.bool=false;
						}else{
							this.message="vous pouvez modifier l'actualité";
							this.actuBisBis.date=res.data.actu.date;
							this.actuBisBis.actu=res.data.actu.actu;
							this.actuBisBis.lienSource=res.data.actu.lienSource;
							this.actuBisBis.lienInt=res.data.actu.lienInt;
							this.bool=true;
						}
					});
				}else{
					this.message="veuillez rentrer un titre existant";
				}
			}
		},
		modifActuBis(){
			if(this.$session.exists()){
				if(this.actuBisBisBis.titre==null && this.actuBisBisBis.actu==null && this.actuBisBisBis.date==null && this.actuBisBisBis.lienInt==null && this.actuBisBisBis.lienSource==null){
					this.message="veuillez renseigner au moins un champ à modifier"
				}else{
					if(((this.choix[0] && this.actuBisBisBis.titre) || (!this.choix[0] && !this.actuBisBisBis.titre)) && ((this.choix[1] && this.actuBisBisBis.actu) || (!this.choix[1] && !this.actuBisBisBis.actu)) && ((this.choix[2] && this.actuBisBisBis.date) || (!this.choix[2] && !this.actuBisBisBis.date)) && ((this.choix[3] && this.actuBisBisBis.lienSource && this.actuBisBis.lienInt) || (!this.choix[3] && !this.actuBisBisBis.lienSource && !this.actuBisBis.lienInt))){
						if(this.choix[3] && (this.actuBisBisBis.lienSource!=null || this.actuBisBisBis.lienInt!=null)){
							if(this.actuBisBisBis.lienSource == null || this.actuBisBisBis.lienInt == null){
								this.message="veuiller rentrer un intitulé et un source pour le lien";
								return;
							}
						}
						if(this.actuBisBisBis.lienSource!= null && this.actuBisBisBis.lienSource.substring(0,4)!=="http"){
							this.message=="veuillez mettre un lien http(s) pour la source";
							return;
						}
						axios({
							method:"post",
							url:"/actu/modifActuBis",
							data:{
								u:{
									actu:(this.actuBisBisBis.actu) ? this.nl2br(this.actuBisBisBis.actu).replace(/'/gi,"\\'") : null,
									newTitre:(this.actuBisBisBis.titre) ? this.actuBisBisBis.titre.replace(/'/gi,"\\'") : null,
									date:this.actuBisBisBis.date,
									lienSource:this.actuBisBisBis.lienSource,
									lienInt:(this.actuBisBisBis.lienInt) ? this.actuBisBisBis.lienInt.replace(/'/gi,"\\'") : null,
									oldTitre: this.actuBisBis.titre
								}
							}
						})
						.then(res=>{
							if(res.data=="OK"){
								this.message="l'actualité a été modifié";
								this.$store.dispatch('importActu')
								this.actuBisBisBis.actu=null
								this.actuBisBisBis.titre=null
								this.actuBisBisBis.date=null
								this.actuBisBisBis.lienSource=null
								this.actuBisBisBis.lienInt=null
								this.choix[0]= null
								this.choix[1]= null
								this.choix[2]= null
								this.choix[3]= null
							}else if(res.data=="ER"){
								this.message="vous n'avez pas les droits, connectez vous";
							} else if(res.data=='NO'){
								this.message= "le nouveau titre existe déjà dans la base de donnés, choisisser un autre"
							}
							this.bool=false;
						});
					} else {
						this.message = "veuillez renseigner le ou les champ(s) que vous voulez modifier"
					}
				}
			}
		},
		showTitre(){
			this.bool2=!this.bool2;
		},
		modifTitre(){
			if(this.$session.exists()){
				axios({
					method:"post",
					url:"/titre/modifTitre",
					data:{
						u:{
							page:"actualites",
							titre:this.nl2br(this.titreBis).replace(/'/gi,"\\'"),
						}
					}
				})
				.then(res=>{
					if(res.data=="OK"){
						this.message="le titre a été modifié";
						this.getTitre()
					}else if(res.data=="ER"){
						this.message="vous n'avez pas les droits, connectez vous";
					}
				});
			}
		},
		getTitre(){
			axios({
				method:"post",
				url:"/titre",
				data:{
					u:{
						page:"actualites"
					}
				}
			})
			.then(res=>{
				this.titre=res.data;
			});
		}
	},
	mounted(){
		if(!this.tab.length){
			this.$store.dispatch('importActu')
		}
		this.getTitre()
	}
}
</script>

<style lang="scss" scoped>
$color:#ED6E13;
.actualite{
	display:flex;
	margin-bottom:50px;
	border: 1px solid lightgrey;
	border-radius: 20px;
}
.titre{
	width: 40%;
	border-right: 1px solid lightgrey;	
}
.actu{
	padding-left: 50px;
	text-align:left;
}
@media screen and (max-width:500px){
	.actualite{
		display:block;
		padding-left:0;
		width: 100%;	
	}
	.actualite span{
		display:block;
	}
	.actu{
		padding-left:20px;
	}
	.titre{
		width: 100%;
	}
}
</style>