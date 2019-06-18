<template>
	<div id='main_project'>
		<h2 v-if="titre">{{titre}}</h2>
		<div v-if="$session.exists()">
			<button @click="showTitre()">change titre</button>
			<form @submit.prevent v-if="bool2" id="titre">
				<input type="text" v-model="titreBis">
				<button @click="modifTitre()">click</button>
			</form>
			<div id="admin" v-if="$session.exists()">
			</div>
		</div>
		<div id="admin" v-if="$session.exists()">
    		<form @submit.prevent class="envoie">
    			<p>ajouter un projet</p>
    			<textarea v-model="proj.proj" cols="40" rows="6"></textarea><br>
    			<label for="titre">titre</label><input id="titre" type="text" v-model="proj.titre"><br>
    			<label for="date">date</label><input id="date" type="date" v-model="proj.date"><br>
    			<label for="lienSource">source du lien</label><input id="lienSource" type="text" v-model="proj.lienSource"><br>
    			<label for="lienInt">intitulé du lien</label><input id="lienInt" type="text" v-model="proj.lienInt"><br>
    			<button @click="addProj()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>supprimer un projet</p>
    			<input type="text" v-model="projBis" placeholder="titre"><br>
    			<button @click="supProj()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>modifier un élément d'un projet</p>
    			<input type="text" v-model="projBisBis.titre">
    			<button @click="modifProj()">click</button>
    			<div v-if="bool">
    				<p>quel(s) élément(s) du projet voudriez vous changer ?</p>
    				<label for="titre">titre</label><input type="checkbox" v-model="choix[0]" value="titre" id="titre">
    				<div v-if="choix[0]">
    					<p>le titre du projet est: {{ projBisBis.titre }}</p>
						<input type="text" v-model="projBisBisBis.titre" placeholder="change titre">
    				</div>
    				<hr>
    				<label for="proj">projet</label><input type="checkbox" v-model="choix[1]" value="proj" id="proj">
    				<div v-if="choix[1]">
    					<textarea v-model="projBisBisBis.proj" placeholder="change revue de proje"></textarea>
    				</div>
    				<hr>
    				<label for="date">date</label><input type="checkbox" v-model="choix[2]" value="date" id="date">
    				<div v-if="choix[2]">
    					<p>la  date du projet est: {{ projBisBis.date }}</p>
						<input type="date" v-model="projBisBisBis.date" placeholder="jj/mm/aaaa">
    				</div>
    				<hr>
    				<label for="lien">lien</label><input type="checkbox" v-model="choix[3]" value="lien" id="lien">
    				<div v-if="choix[3]">
    					<div v-if="projBisBis.lienSource">
    						<p>la source du lien est: {{ projBisBis.lienSource }}</p>
    						<p>l'intilulé du lien est: {{ projBisBis.lienInt }}</p>
    					</div>
    					<p v-else>pas de lien pour ce projet, en ajouter?</p>
    					<input type="text" v-model="projBisBisBis.lienSource" placeholder="change source du lien">
						<input type="text" v-model="projBisBisBis.lienInt" placeholder="change intitulé du lien">
    				</div>
    				<hr>
    				<button @click="modifProjBis()">modifier</button>
    			</div>
    		</form>
    		<p id="message">{{message}}</p>
    	</div>
		<section v-for="p in projets" class="projet">
			<h3 class="titre">{{p.titre}}</h3>
			<div class="desc">
    			<p class="description" v-html="p.description"></p>
    			<span class="lien" v-if="p.lien_source && p.lien_int"><a :href="p.lien_source">{{p.lien_int}}</a></span>
    			<hr color="lightgrey">
    			<div class="bottom">
    				clicker pour soutenir: <span class="soutien" @click="postSoutien(p.id)">{{p.soutien}}</span>
    			</div>
    		</div>
		</section>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		computed: {
			projets(){
				return this.$store.state.projets
			}
		},
		data() {
			return {
				proj:{
					proj:null,
					titre:null,
					date:null,
					lienSource:null,
					lienInt:null
				},
				projBis:null,
				projBisBis:{
					proj:null,
					titre:null,
					date:null,
					lienSource:null,
					lienInt:null
				},
				projBisBisBis:{
					proj:null,
					titre:null,
					date:null,
					lienSource:null,
					lienInt:null
				},
				message:null,
				choix:[null,null,null,null],
				titre: null,
				bool: false,
				titreBis:null,
				bool2:false,
			}
		},
		mounted(){
			if(!this.projets.length){
				this.$store.dispatch('importProjet')
			}
			this.getTitre()
		},
		methods:{
			nl2br (str, is_xhtml) {   
	    		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
	    		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
			},
			getTitre(){
				axios({
					method:"post",
					url:"/titre",
					data:{
						u:{
							page:"projets"
						}
					}
				})
				.then(res=>{
					this.titre=res.data;
				});
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
								page:"projets",
								titre:this.nl2br(this.titreBis),
							}
						}
					})
					.then(res=>{
						if(res.data=="OK"){
							this.message="le titre a été modifié";
							this.getTitre()
						}else if(res.data=="ER"){
							this.message="vous n''avez pas les droits, connectez vous";
						}
					});
				}
			},
			postSoutien(id){
				axios({
					method: 'post',
					url: '/projet/addSoutien',
					data: {
						u: {
							id_projet: id
						}
					}
				})
				.then(res=>{
					if(res.data=='OK'){
						this.$store.dispatch('importProjet')
					}
				})
			},
			addProj(){
				if(this.$session.exists()){
					if (this.proj.proj!=null&&this.proj.date!=null&&this.proj.titre!=null){
						if(this.proj.lienSource==null||this.proj.lienSource.substring(0,4)=="http"){
							axios({
								method:"post",
								url:"/projet/addProjet",
								data:{
									u:{
										proj:this.nl2br(this.proj.proj),
										titre:this.proj.titre,
										date:this.proj.date,
										lienSource:this.proj.lienSource,
										lienInt:(this.proj.lienInt) ? this.proj.lienInt : null
									}
								}
							})
							.then(res=>{
								if (res.data=="NO") {
									this.message="il y a déjà un projet à ce titre";
								}else if(res.data=="ER"){
									this.message="vous n'avez pas les droits, connectez vous";
								}else{
									this.message="le projet a été ajouté";
									this.$store.dispatch('importProjet')
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
			supProj(){
				if(this.$session.exists()){
					if(this.projBis!=null){
						axios({
							method:"post",
							url:"/projet/supProjet",
							data:{
								u:{
									proj: this.projBis
								}
							}
						})
						.then(res=>{
							if (res.data=="NO") {
								this.message="il n'y a pas de projet à ce titre";
							}else if(res.data=="ER"){
								this.message="vous n'avez pas les droits, connectez vous";
							}else{
								this.message="le projet a été supprimé";
								this.$store.dispatch('importProjet')
							}
						});
					}else{
						this.message="veuillez saisir les champs";
					}
				}
			},
			modifProj(){
				if(this.$session.exists()){
					if(this.projBisBis.titre!=null){
						axios({
							method:"post",
							url:"/projet/modifProjet",
							data:{
								u:{
									titre: this.projBisBis.titre
								}
							}
						})
						.then(res=>{
							if (res.data.status=="NO") {
								this.message="il n'y a pas de projet à ce titre";
								this.bool=false;
							}else if(res.data.status=="ER"){
								this.message="vous n'avez pas les droits, connectez vous";
								this.bool=false;
							}else{
								this.message="vous pouvez modifier le projet";
								this.projBisBis.date=res.data.proj.date;
								this.projBisBis.proj=res.data.proj.proj;
								this.projBisBis.lienSource=res.data.proj.lienSource;
								this.projBisBis.lienInt=res.data.proj.lienInt;
								this.bool=true;
							}
						});
					}else{
						this.message="veuillez rentrer un titre existant";
					}
				}
			},
			modifProjBis(){
				if(this.$session.exists()){
					if(this.projBisBisBis.titre==null && this.projBisBisBis.proj==null && this.projBisBisBis.date==null && this.projBisBisBis.lienInt==null && this.projBisBisBis.lienSource==null){
						this.message="veuillez renseigner au moins un champ à modifier"
					}else{
						if(((this.choix[0] && this.projBisBisBis.titre) || (!this.choix[0] && !this.projBisBisBis.titre)) && ((this.choix[1] && this.projBisBisBis.proj) || (!this.choix[1] && !this.projBisBisBis.proj)) && ((this.choix[2] && this.projBisBisBis.date) || (!this.choix[2] && !this.projBisBisBis.date)) && ((this.choix[3] && this.projBisBisBis.lienSource && this.projBisBisBis.lienInt) || (!this.choix[3] && !this.projBisBisBis.lienSource && !this.projBisBisBis.lienInt))){
							if(this.choix[3] && (this.projBisBisBis.lienSource!=null || this.projBisBisBis.lienInt!=null)){
								if(this.projBisBisBis.lienSource == null || this.projBisBisBis.lienInt == null){
									this.message="veuiller rentrer un intitulé et un source pour le lien";
									return;
								}
							}
							if(this.projBisBisBis.lienSource!= null && this.projBisBisBis.lienSource.substring(0,4)!=="http"){
								this.message=="veuillez mettre un lien http(s) pour la source";
								return;
							}
							axios({
								method:"post",
								url:"/projet/modifProjetBis",
								data:{
									u:{
										proj:(this.projBisBisBis.proj) ? this.nl2br(this.projBisBisBis.proj) : null,
										newTitre:(this.projBisBisBis.titre) ? this.projBisBisBis.titre : null,
										date:this.projBisBisBis.date,
										lienSource:this.projBisBisBis.lienSource,
										lienInt:(this.projBisBisBis.lienInt) ? this.projBisBisBis.lienInt : null,
										oldTitre: this.projBisBis.titre
									}
								}
							})
							.then(res=>{
								if(res.data=="OK"){
									this.message="l'projet a été modifié";
									this.$store.dispatch('importProjet')
									this.projBisBisBis.proj=null
									this.projBisBisBis.titre=null
									this.projBisBisBis.date=null
									this.projBisBisBis.lienSource=null
									this.projBisBisBis.lienInt=null
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	$color: #ED6E13;
	.projet{
		display:flex;
		margin-bottom:50px;
		border: 1px solid lightgrey;
		border-radius: 20px;
		padding-bottom: 10px;
	}
	.titre{
		width: 40%;
		border-right: 1px solid lightgrey;	
	}
	.bottom{
		padding-top: 20px;
	}
	.description{
		padding-bottom: 5px;
		margin-bottom: 0;
	}
	.desc{
		padding-left: 50px;
		text-align:left;
		max-width: 60%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
	.soutien{
		border-radius: 10px;
		border: 1px solid orange;
		padding: 5px 30px;
	}
	.soutien:hover{
		background-color: $color;
		color: white;
	}
	.lien{
		display: block;
		padding-bottom: 5px;
		margin-bottom: 16;
	}
	@media screen and (max-width:500px){
		.projet{
			display:block;
			padding-left:0;
			width: 100%;	
		}
		.projet span{
			display:block;
		}
		.desc{
			padding-left:20px;
			max-width: 100;
		}
		.titre{
			width: 100%;
		}
	}
</style>