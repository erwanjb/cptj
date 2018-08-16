<template lang="html">
    <div id="main_repress">
    	<h2>Revue de Presse</h2>
    	<div id="admin" v-if="$session.exists()">
    		<form @submit.prevent class="envoie">
    			<p>ajouter une revue de presse</p>
    			<textarea v-model="press.press" cols="40" rows="6"></textarea><br>
    			<label for="titre">titre</label><input id="titre" type="text" v-model="press.titre"><br>
    			<label for="date">date</label><input id="date" type="date" v-model="press.date"><br>
    			<label for="lienSource">source du lien</label><input id="lienSource" type="text" v-model="press.lienSource"><br>
    			<label for="lienInt">intitulé du lien</label><input id="lienInt" type="text" v-model="press.lienInt"><br>
    			<button @click="addpress()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>supprimer une revue de presse</p>
    			<input type="date" v-model="pressBis"><br>
    			<button @click="suppress()">click</button>
    		</form>
    		<p id="message">{{message}}</p>
    	</div>
    	<div id="main_press">
    		<section v-for="t in tab" class="repress">
    			<h3 class="titre">{{t.titre}} :</h3>
    			<div class="press">
	    			<p v-html="t.press"></p>
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
			press:{
				press:null,
				titre:null,
				date:null,
				lienSource:null,
				lienInt:null
			},
			pressBis:null,
			message:null
		}
	},
	methods:{
		nl2br (str, is_xhtml) {   
    		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
		},
		addpress(){
			if(this.$session.exists()){
				if (this.press.press!=null&&this.press.date!=null&&this.press.titre!=null){
					if(this.press.lienSource==null||this.press.lienSource.substring(0,4)=="http"){
						axios({
							method:"post",
							url:"/press/addPress",
							data:{
								u:{
									press:this.nl2br(this.press.press).replace(/'/gi,"\\'"),
									titre:this.press.titre.replace(/'/gi,"\\'"),
									date:this.press.date,
									lienSource:this.press.lienSource,
									lienInt:this.press.lienInt.replace(/'/gi,"\\'")
								}
							}
						})
						.then(res=>{
							if (res.data=="NO") {
								this.message="il y a déjà une revue de presse à cette date";
							}else{
								this.message="la revue de presse a été ajouté";
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
		suppress(){
			if(this.$session.exists()){
				if(this.pressBis!=null){
					axios({
						method:"post",
						url:"/press/supPress",
						data:{
							u:this.pressBis
						}
					})
					.then(res=>{
						if (res.data=="NO") {
							this.message="il n'y a pas de revue de presse à cette date";
						}else{
							this.message="la revue de presse a été supprimé";
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
			url:"/press"
		})
		.then(res=>{
			this.tab=res.data;
		});
	}
}
</script>

<style lang="scss" scoped>
.repress{
	margin-left:30%;
	display:flex;
	margin-bottom:100px;
}
.titre{
	margin-right:50px;		
}
.press{
	margin:auto;
	text-align:left;
}
@media screen and (max-width:500px){
	.press{
		display:block;
		margin-left:0;
	}
	.press span{
		display:block;
	}
	.press{
		margin-left:20px;
	}
}
</style>