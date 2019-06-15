<template lang="html">
    <div id="main_repress">
    	<h2 v-if="titre">{{ titre }}</h2>
    	<div v-if="$session.exists()">
    		<button @click="showTitre()">change titre</button>
    		<form @submit.prevent v-if="bool2" id="titre">
    			<input type="text" v-model="titreBis">
    			<button @click="modifTitre()">click</button>
    		</form>
    	</div>
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
    			<input type="text" v-model="pressBis"><br>
    			<button @click="suppress()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>modifier un élément d'une revue de presse</p>
    			<input type="text" v-model="pressBisBis.titre">
    			<button @click="modifPress()">click</button>
    			<div v-if="bool">
    				<p>quel(s) élément(s) de la revue de press voudriez vous changer ?</p>
    				<label for="titre">titre</label><input type="checkbox" v-model="choix[0]" value="titre" id="titre">
    				<div v-if="choix[0]">
    					<p>le titre de la revue de press est: {{ pressBisBis.titre }}</p>
						<input type="text" v-model="pressBisBisBis.titre" placeholder="change titre">
    				</div>
    				<hr>
    				<label for="press">revue de presse</label><input type="checkbox" v-model="choix[1]" value="press" id="press">
    				<div v-if="choix[1]">
    					<textarea v-model="pressBisBisBis.press" placeholder="change revue de presse"></textarea>
    				</div>
    				<hr>
    				<label for="date">date</label><input type="checkbox" v-model="choix[2]" value="date" id="date">
    				<div v-if="choix[2]">
    					<p>la  date de la revue de presse est: {{ pressBisBis.date }}</p>
						<input type="date" v-model="pressBisBisBis.date" placeholder="jj/mm/aaaa">
    				</div>
    				<hr>
    				<label for="lien">lien</label><input type="checkbox" v-model="choix[3]" value="lien" id="lien">
    				<div v-if="choix[3]">
    					<div v-if="pressBisBis.lienSource">
    						<p>la source du lien est: {{ pressBisBis.lienSource }}</p>
    						<p>l'intilulé du lien est: {{ pressBisBis.lienInt }}</p>
    					</div>
    					<p v-else>pas de lien pour cette revue de presse, en ajouter?</p>
    					<input type="text" v-model="pressBisBisBis.lienSource" placeholder="change source du lien">
						<input type="text" v-model="pressBisBisBis.lienInt" placeholder="change intitulé du lien">
    				</div>
    				<hr>
    				<button @click="modifPressBis()">modifier</button>
    			</div>
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
			pressBisBis:{
				press:null,
				titre:null,
				date:null,
				lienSource:null,
				lienInt:null
			},
			pressBisBisBis:{
				press:null,
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
									lienInt: (this.press.lienInt) ? this.press.lienInt.replace(/'/gi,"\\'"):null
								}
							}
						})
						.then(res=>{
							if (res.data=="NO") {
								this.message="il y a déjà une revue de presse à ce titre";
							}else if(res.data=="ER"){
								this.message="vous n'avez pas d'autorisation, connectez vous";
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
							u:this.pressBis.replace(/'/gi,"\\'")
						}
					})
					.then(res=>{
						if (res.data=="NO") {
							this.message="il n'y a pas de revue de presse à ce titre";
						}else if(res.data=="ER"){
							this.message="vous n'avez pas d'autorisation, connectez vous";
						}else{
							this.message="la revue de presse a été supprimé";
						}
					});
				}else{
					this.message="veuillez saisir les champs";
				}
			}
		},
		modifPress(){
			if(this.$session.exists()){
				if(this.pressBisBis.titre!=null){
					axios({
						method:"post",
						url:"/press/modifPress",
						data:{
							u:this.pressBisBis.titre.replace(/'/gi,"\\'")
						}
					})
					.then(res=>{
						if (res.data.status=="NO") {
							this.message="il n'y a pas de revue de presse à ce titre";
							this.bool=false;
						}else if(res.data.status=="ER"){
							this.message="vous n'avez pas d'autorisation, connectez vous";
							this.bool=false;
						}else{
							this.message="vous pouvez modifier la revue de presse";
							this.pressBisBis.date=res.data.press.date;
							this.pressBisBis.press=res.data.press.press;
							this.pressBisBis.lienSource=res.data.press.lienSource;
							this.pressBisBis.lienInt=res.data.press.lienInt;
							this.bool=true;
						}
					});
				}else{
					this.message="veuillez rentrer un titre existant";
				}
			}
		},
		modifPressBis(){
			if(this.$session.exists()){
				if(this.pressBisBisBis.titre==null && this.pressBisBisBis.press==null && this.pressBisBisBis.date==null && this.pressBisBisBis.lienInt==null && this.pressBisBisBis.lienSource==null){
					this.message="veuillez renseigner au moins un champ à modifier"
				}else{
					if(this.pressBisBis.lienSource==null && this.pressBisBis.lienInt==null && (this.pressBisBisBis.lienSource!=null || this.pressBisBisBis.lienInt!=null)){
						if(this.pressBisBisBis.lienSource == null || this.pressBisBisBis.lienInt == null){
							this.message="veuiller rentrer un intitulé et un source pour le lien";
							return;
						}
					}
					if(this.pressBisBisBis.lienSource !== null && this.pressBisBisBis.lienSource.substring(0,4)!=="http"){
						this.message=="veuillez mettre un lien http(s) pour la source";
						return;
					}
					axios({
						method:"post",
						url:"/press/modifPressBis",
						data:{
							u:{
								press:{
									press:(this.pressBisBisBis.press) ? this.nl2br(this.pressBisBisBis.press).replace(/'/gi,"\\'") : null,
									titre:(this.pressBisBisBis.titre) ? this.pressBisBisBis.titre.replace(/'/gi,"\\'") : null,
									date:this.pressBisBisBis.date,
									lienSource:this.pressBisBisBis.lienSource,
									lienInt:(this.pressBisBisBis.lienInt) ? this.pressBisBisBis.lienInt.replace(/'/gi,"\\'") : null
								},
								titre: this.pressBisBis.titre
							}
						}
					})
					.then(res=>{
						if(res.data=="OK"){
							this.message="la revue de presse a été modifié";
						}else if(res.data=="ER"){
							this.message="vous n'avez pas d'autorisation, veuillez vous connecter"
						}
						this.bool=false;
					});
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
							page:"press",
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
			method:"get",
			url:"/press"
		})
		.then(res=>{
			this.tab=res.data;
		});
		axios({
			method:"post",
			url:"/titre",
			data:{
				u:{
					page:"press"
				}
			}
		})
		.then(res=>{
			this.titre=res.data;
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