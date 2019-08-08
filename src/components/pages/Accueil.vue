<template lang="html">
    <div id="main_accueil">
    	<h2 v-if="titre">{{titre}}</h2>
    	<div v-if="$session.exists()">
    		<button @click="showTitre()">change titre</button>
    		<form @submit.prevent v-if="bool" id="titre">
    			<input type="text" v-model="titreBis">
    			<button @click="modifTitre()">click</button>
    		</form>
    	</div>
    	<div id="admin" v-if="$session.exists()">
    		<form @submit.prevent class="envoie">
    			<p>pour modifier le à propos</p>
	    		<textarea v-model="aproposBis" cols="40" rows="10"></textarea>
	    		<button @click="modifApropos()">click</button>
	    	</form>
	    	<form @submit.prevent class="envoie">
    			<p>ajouter un logo</p>
	    		<input type="file" @change="changeLogo($event)">
	    		<br>
	    		<input type="text" placeholder="titre du logo" v-model="newLogo.titre">
	    		<br>
	    		<input type="number" placeholder="largeur du logo" v-model="newLogo.width">
	    		<br>
	    		<input type="number" placeholder="hauteur du logo" v-model="newLogo.height">
	    		<br>
	    		<button @click="addLogo()">click</button>
	    	</form>
	    	<form @submit.prevent class="envoie">
    			<p>supprimer un logo</p>
	    		<input type="text" v-model="logobis" placeholder="titre du logo">
	    		<button @click="deleteLogo()">click</button>
	    	</form>
	    	<form @submit.prevent class="envoie">
    			<p>modifier un/des élément(s) d'un logo</p>
    			<input type="text" v-model="logobisbis.titre">
    			<button @click="modifLogo()">click</button>
    			<div v-if="bool2">
    				<p>quel(s) élément(s) du logo voudriez vous changer ?</p>
    				<label for="titre">titre</label><input type="checkbox" v-model="choix[0]" value="titre" id="titre">
    				<div v-if="choix[0]">
    					<p>le titre de l'actualité est: {{ logobisbis.titre }}</p>
						<input type="text" v-model="logobisbisbis.titre" placeholder="change titre">
    				</div>
    				<hr>
    				<label for="width">largeur</label><input type="checkbox" v-model="choix[1]" value="width" id="width">
    				<div v-if="choix[1]">
    					<p>la largeur  du logo est: {{ logobisbis.width }}</p>
    					<input type="number" v-model="logobisbisbis.width" placeholder="change largeur du logo">
    				</div>
    				<hr>
    				<label for="height">hauteur</label><input type="checkbox" v-model="choix[2]" value="height" id="height">
    				<div v-if="choix[2]">
    					<p>la hauteur du logo est: {{ logobisbis.height }}</p>
						<input type="number" v-model="logobisbisbis.height" placeholder="change hauteur du logo">
    				</div>
    				<hr>
    				<button @click="modifLogoBis()">modifier</button>
    			</div>
    		</form>
	    	<p id="message">{{message}}</p>
    	</div>
    	<div id="apropos" v-html="apropos"></div>
    	<p>Ils me soutiennent :</p>
    	<div class="content-logo">
    		<div v-for="(l, i) in logo" class="logo">
    			<img :src="'./logo/'+l.url" :width="l.width" :height="l.height"/>
    			<span>{{l.titre}}<span>
    		</div>
    	</div>
  	</div>
</template>

<script>
import axios from "axios";
export default {
	computed: {
		apropos(){
			return this.$store.state.apropos
		},
		logo(){
			return this.$store.state.logo
		}
	},
	data(){
		return{
			logobisbis: {
				titre: null,
				width: null,
				height: null
			},
			logobisbisbis: {
				titre: null,
				width: null,
				height: null
			},
			logobis:null,
			newLogo:{
				logo: null,
				titre: null,
				width: null,
				height: null
			},
			aproposBis:null,
			message:null,
			titre:null,
			titreBis:null,
			bool:false,
			bool2: false,
			choix: [false, false, false]
		}
	},
	mounted(){
		if(!this.apropos){
			this.$store.dispatch('importApropos')
		}
		if(!this.logo.length) {
			this.$store.dispatch('importLogo')
		}
		this.getTitre()
	},
	methods:{
		modifLogoBis(){
			if(this.$session.exists()){
				if(!this.logobisbisbis.titre && !this.logobisbisbis.width && !this.logobisbisbis.height){
					this.message="veuillez renseigner au moins un champ à modifier"
				}else{
					if(((this.choix[0] && this.logobisbisbis.titre) || (!this.choix[0] && !this.logobisbisbis.titre)) && ((this.choix[1] && this.logobisbisbis.width) || (!this.choix[1] && !this.logobisbisbis.width)) && ((this.choix[2] && this.logobisbisbis.height) || (!this.choix[2] && !this.logobisbisbis.height))){
						axios({
							method:"post",
							url:"/accueil/modifLogoBis",
							data:{
								u:{
									titre:(this.logobisbisbis.titre) ? this.logobisbisbis.titre : null,
									width:(this.logobisbisbis.width) ? this.logobisbisbis.width : null,
									height:(this.logobisbisbis.height) ? this.logobisbisbis.height : null,
									oldTitre: this.logobisbis.titre
								}
							}
						})
						.then(res=>{
							if(res.data=="OK"){
								this.message="l'actualité a été modifié";
								this.$store.dispatch('importLogo')
								this.logobisbisbis.titre=null
								this.logobisbisbis.width=null
								this.logobisbisbis.height=null
								this.choix[0]= null
								this.choix[1]= null
								this.choix[2]= null
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
		modifLogo(){
			if(this.$session.exists()){
				if(this.logobisbis.titre){
					axios({
						method:"post",
						url:"/accueil/modifLogo",
						data:{
							u:{
								titre: this.logobisbis.titre
							}
						}
					})
					.then(res=>{
						if (res.data.status=="NO") {
							this.message="il n'y a pas d'actualité à ce titre";
							this.bool2=false;
						}else if(res.data.status=="ER"){
							this.message="vous n'avez pas les droits, connectez vous";
							this.bool2=false;
						}else{
							this.message="vous pouvez modifier l'actualité";
							this.logobisbis.width=res.data.logo.width;
							this.logobisbis.height=res.data.logo.height;
							this.bool2=true;
						}
					});
				}else{
					this.message="veuillez rentrer un titre existant";
				}
			}
		},
		deleteLogo(){
			if(this.$session.exists()){
				if(this.logobis){
					axios({
						method: 'post',
						url: '/accueil/deleteLogo',
						data: {
							u: {
								titre: this.logobis
							}
						}
					})
					.then(res => {
						if (res.data === 'OK') {
							this.message = 'le logo a été supprimé'
							this.$store.dispatch('importLogo')
						} else if(res.data ==="ER"){
							this.message="vous n'avez pas les droits, connectez vous";
						} else {
							this.message = 'aucun logo à ce titre'
						}
					})
				} else {
					this.message = 'veuiller renseigner un titre'
				}
			}
		},
		changeLogo(e){
        	this.newLogo.logo = e.target.files[0]
		},
		addLogo(){
			if(this.$session.exists()){
				if(this.newLogo.logo && this.newLogo.titre && this.newLogo.width && this.newLogo.height) {
					const typeFile = this.newLogo.logo.type
					if (typeFile.match('image')) {
						axios({
				          url: '/accueil/verifTitreLogo',
				          method: 'post',
				          data: {
				          	u : {
				          		titre: this.newLogo.titre
				          	}
				          }
				        })
				        .then(res => {
				        	if(res.data === 'OK') {
				        		var formData = new FormData();
						        formData.append("logo", this.newLogo.logo, this.newLogo.logo.name);
						        axios({
						          url: '/accueil/upload',
						          method: 'post',
						          data: formData
						        }).then(res2=>{
						        	if (res2.data.status === 'OK') {
						        		axios({
						        			url: 'accueil/addLogo',
						        			method: 'post',
						        			data: {
						        				u : {
						        					url: this.newLogo.logo.name,
						        					titre: this.newLogo.titre,
						        					width: this.newLogo.width,
						        					height: this.newLogo.height
						        				}
						        			}
						        		}).then(res3 => {
						        			if (res3.data === 'OK') {
						        				this.message = 'le logo a été ajouté'
						        				this.$store.dispatch('importLogo')
						        			} else {
						        				this.message = "veuillez vous connecter, vous n'avez pas d'autorisation"
						        			}
						        		})
						        	} else {
						        		this.message = res2.data.message
						        	}
						        })
				        	} else {
				        		this.message = 'ce titre existe déjà pour un autre logo'
				        	}
				        })
					} else {
						this.message = 'veuillez choisir une image et pas autre chose'
					}
				} else {
					this.message = 'veuillez remplir tous les champs et choisir une image'
				}
			}
		},
		getTitre(){
			axios({
				method:"post",
				url:"/titre",
				data:{
					u:{
						page:"apropos"
					}
				}
			})
			.then(res=>{
				this.titre=res.data;
			});
		},
		nl2br (str, is_xhtml) {   
    		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
		},
		modifApropos(){
			if(this.$session.exists()){
				if(this.aproposBis!=null){
					axios({
						method:"post",
						url:"/apropos/modifApropos",
						data:{
							u:{
								apropos: this.nl2br(this.aproposBis)
							}
						}
					})
					.then(res=>{
						if (res.data=="OK") {
							this.message="le à propos a été changé";
							this.$store.dispatch('importApropos')
						}else if(res.data=="ER"){
							this.message="veuillez vous connecter, vous n'avez pas d'autorisation";
						}
					});
				}else{
					this.message="veuillez saisir les champs";
				}
			}
		},
		showTitre(){
			this.bool=!this.bool;
		},
		modifTitre(){
			if(this.$session.exists()){
				axios({
					method:"post",
					url:"/titre/modifTitre",
					data:{
						u:{
							page:"apropos",
							titre:this.nl2br(this.titreBis),
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
	}
}
</script>

<style lang="scss" scoped>
.content-logo{
	display: flex;
	justify-content: space-around;
	align-items: center;
	flex-wrap: wrap;
	width: 60%;
	margin: 0 auto;
}
p{
	text-align:center;
	margin-top: 50px;
}
#apropos{
	width: 60%;
	margin: 0 auto;
}
.logo{
	display: flex;
	flex-direction: column;
	align-items: center;
}
@media screen and (max-width:800px) { 
	#apropos{
		width: 90%;
	}
	.content-logo{
		width: 90%;
	}
}
</style>