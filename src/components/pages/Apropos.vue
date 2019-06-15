<template lang="html">
    <div id="main_apropos">
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
	    	<p id="message">{{message}}</p>
    	</div>
    	<div id="apropos" v-html="apropos"></div>
  	</div>
</template>

<script>
import axios from "axios";
export default {
	data(){
		return{
			apropos:null,
			aproposBis:null,
			message:null,
			titre:null,
			titreBis:null,
			bool:false,
		}
	},
	mounted(){
		axios({
			method:"get",
			url:"/apropos"
		})
		.then(res=>{
			this.apropos=res.data;
		});
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
	methods:{
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
							u:this.nl2br(this.aproposBis).replace(/'/gi,"\\'")
						}
					})
					.then(res=>{
						if (res.data=="OK") {
							this.message="le à propos a été changé";
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
							titre:this.nl2br(this.titreBis).replace(/'/gi,"\\'"),
						}
					}
				})
				.then(res=>{
					if(res.data=="OK"){
						this.message="le titre a été modifié";
					}else if(res.data=="ER"){
						this.message="vous n''avez pas les droits, connectez vous";
					}
				});
			}
		},
	}
}
</script>

<style lang="scss" scoped>
</style>