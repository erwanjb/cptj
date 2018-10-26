<template lang="html">
    <div id="main_contact">
    	<h2>{{titre}}</h2>
    	<div v-if="$session.exists()">
    		<button @click="showTitre()">change titre</button>
    		<form @submit.prevent v-if="bool" id="titre">
    			<input type="text" v-model="titreBis">
    			<button @click="modifTitre()">click</button>
    		</form>
    	</div>
    	<p>{{message}}</p>
    	<form action="https://formspree.io/cptjcontact@gmail.com" method="post">
			<input type="email" id="email" name="email"placeholder="Mail"><br>
			<input type="text" id="nom" name="nom" placeholder="Prénom ou Pseudo"><br>
			<textarea id="text" cols="60" rows="10" name="text" placeholder="Message"></textarea><br>
			<input type="submit" value="Envoyer">
		</form>
  	</div>
</template>

<script>

import axios from "axios";
export default {
	data (){
		return{
			titre:null,
			titreBis:null,
			bool:false,
			message:null,
		}
	},
	methods:{
		nl2br (str, is_xhtml) {   
    		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
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
							page:"contact",
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
	},
	mounted(){
		axios({
			method:"post",
			url:"/titre",
			data:{
				u:{
					page:"contact"
				}
			}
		})
		.then(res=>{
			this.titre=res.data;
		});
	},
}
</script>

<style lang="scss" scoped>
input{
	width: 300px;
	padding-left: 5px;
	height: 30px;
}
textarea{
	padding-left:5px;
}
form{
	display:flex;
	flex-direction:column;
	align-items:center;
}
</style>
