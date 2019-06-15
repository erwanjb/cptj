<template lang="html">
    <div id="main_themes">
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
    			<p>ajouter une vidéo</p>
    			<input type="text" v-model="video.video"  placeholder="source"><br>
    			<p v-for="(c,i) in categoriebis">
    				<label for="c">{{c}}</label>
    				<input type="checkbox" :id="c" v-model="video.categorie" :value="categorie[i]">
    			</p>
    			<input type="text" v-model="video.titre" placeholder="titre"><br>
    			<input type="date" v-model="video.date" placeholder="jj/mm/aaaa"><br>
    			<button @click="addVideo()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>supprimer une vidéo</p>
    			<input type="text" v-model="videoBis" placeholder="source"><br>
    			<button @click="supVideo()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>ajouter une catégorie</p>
    			<input type="text" v-model="cat" placeholder="catégorie"><br>
    			<button @click="addCategorie()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>supprimer une catégorie</p>
    			<input type="text" v-model="catBis" placeholder="catégorie"><br>
    			<button @click="supCategorie()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>vidéos qui n'ont pas de catégorie</p>
    			<div id="videoWithoutCat">
    				<iframe v-for="t in tabBis" :src="t.video"></iframe>
    			</div>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>modifier un élément d'une vidéo</p>
				<input type="text" v-model="videoBisBis.video" placeholder="source">
				<button @click="modifVideo()">click</button>
				<div v-if="bool">
					<p>quel(s) élément(s) de la vidéo voudriez vous changer ?</p>
					<label for="titre">titre</label><input type="checkbox" v-model="choix[0]" value="titre" id="titre"><br>
					<div v-if="choix[0]">
						<p>le titre de la vidéo est: {{videoBisBis.titre}}</p>
						<input type="text" v-model="videoBisBisBis.titre" placeholder="change titre"><br>
					</div>
					<hr>
					<label for="date">date</label><input type="checkbox" v-model="choix[1]" value="date" id="date"><br>
					<div v-if="choix[1]">
						<p>la date de la vidéo est: {{videoBisBis.date}}</p>
						<input type="date" v-model="videoBisBisBis.date" placeholder="change date"><br>
					</div>
					<hr>
					<label for="categorie">catégorie</label><input type="checkbox" v-model="choix[2]" value="categorie" id="categorie"><br>
					<div v-if="choix[2]">
						<p>les catégories de la vidéo sont: <span v-for="(c,i) in videoBisBis.categorie">{{c}}, </span><span v-if="videoBisBis.categorie.length === 0">0 trouvée</span></p>
						<p v-for="(c,i) in categoriebis">
							<label for="c">{{c}}</label>
							<input type="checkbox" :id="c" v-model="videoBisBisBis.categorie" :value="categorie[i]"><br>
						</p>
					</div>
					<hr>
					<button @click="modifVideoBis()">modifier</button>
				</div>
    		</form>
    		<p id="message">{{message}}</p>
    	</div>
    	<div id="main_video">
    		<div class="theme">
    			<div v-for="(c,i) in categorie">
    				<a href="" class="btn" @click="show($event)">{{categoriebis[i]}}</a>
    				<input type="hidden" :value="c">
    			</div>
    		</div>
			<section v-for="(c,i) in categorie" style="display:none;" class="video_categorie" :id="c">
				<div v-for="t in tab[i]" class="item_video">
					<h3>{{t.titre}}</h3>
					<section class="video"><iframe :src="t.video"></iframe></section>
				</div>
				<p v-if="nb[i]">
					<label @click="showMore($event)"class="show">en voir plus</label>
					<input type="hidden" :value="nb[i]" class="nb">
					<input type="hidden" :value="i" class="index">
					<input type="hidden" :value="categorie[i]" class="cat">
				</p>
			</section>
    	</div>
  	</div>
</template>

<script>
import axios from "axios";
export default {
	computed: {
		nb(){
			return this.$store.state.nb
		},
		tab(){
			return this.$store.state.tab
		},
		categorie(){
			return this.$store.state.categorie
		},
		categoriebis(){
			return this.$store.state.categoriebis
		}
	},
	data(){
		return{
			message:null,
			tabBis:[],
			video:{
				video:null,
				categorie:[],
				titre:null,
				date:null
			},
			videoBis:null,
			videoBisBis:{
				video:null,
				date:null,
				titre:null,
				categorie:[]
			},
			videoBisBisBis:{
				video:null,
				date:null,
				titre: null,
				categorie:[]
			},
			cat:null,
			catBis:null,
			bool:false,
			choix:[null,null,null],
			titre:null,
			titreBis:null,
			bool2:false,
		}
	},
	methods:{
		show(e){
			e.preventDefault();
			const cat = document.getElementsByClassName("video_categorie");
			const value = e.target.parentNode.querySelector("input").value;
			for (let i = 0; i < cat.length; i++) {
				if(cat[i].style.display!="none"){
					cat[i].style.display="none";
				}
			}
			document.querySelector(".video_categorie#"+value).style.display = "flex";
			// if(e.target.parentNode.querySelector(".video_categorie").style.display == "none"){
			// 	e.target.parentNode.querySelector(".video_categorie").style.display = "flex";
			// }else{
			// 	e.target.parentNode.querySelector(".video_categorie").style.display = "none";
			// } 
		},
		showMore(e){
			const nb = e.target.parentNode.querySelector(".nb").value;
			const index = e.target.parentNode.querySelector(".index").value;
			const cat = e.target.parentNode.querySelector(".cat").value;
			axios({
				method :"post",
				url :"/themes/addMore",
				data:{
					u:{
						cat:cat.replace(/'/gi,"\\'"),
						nb:nb
					}
				}
			})
			.then(res=>{
				for(let i=0;i<res.data.tab.length;i++){
					this.tab[parseInt(index)].push(res.data.tab[i]);
				}
				if (res.data.nb) {
					this.nb[parseInt(index)]=res.data.nb;
				}else{
					this.nb[parseInt(index)]=null;
				}
			});
		},
		addVideo(){
			if(this.$session.exists()){
				if(this.video.video!=null&&this.video.categorie!=[]&&this.video.date!=null&&this.video.titre!=null){
					if(this.video.video.substring(0,7)=="<iframe"&&this.video.video.substring(this.video.video.length,this.video.video.length-9)=="</iframe>"){
						axios({
							method :"post",
							url :"/themes/addVideo",
							data:{
								u:{
									video:this.video.video,
									categorie:this.video.categorie,
									titre:this.video.titre.replace(/'/gi,"\\'"),
									date:this.video.date,
									}
							}
						})
						.then(res=>{
							if(res.data.status=="NO"){
								this.message="la vidéo est déjà présente";
							}else if(res.data.status=="ER"){
								this.message="vous n'avez pas d'autorisation, connectez vous";
							}else{
								this.message="la vidéo a été enregistré";
								this.$store.dispatch('importTheme')
							}
						});
					}else{
						this.message="vous avez mal saisi la vidéo";
					}
				}else{
					this.message="vous n'avez pas saisi tous les champs";
				}
			}
		},
		supVideo(){
			if(this.$session.exists()){
				if(this.videoBis!=null){
					if(this.videoBis.substring(0,7)=="<iframe"&&this.videoBis.substring(this.videoBis.length,this.videoBis.length-9)=="</iframe>"){
						axios({
							method :"post",
							url :"/themes/supVideo",
							data:{
								u:{
									video: this.videoBis
								}
							}
						})
						.then(res=>{
							if(res.data.status=="NO"){
								this.message="la vidéo n'est pas enregistré";
							}else if(res.data.status=="ER"){
								this.message="vous n'avez pas d'autorisation, connectez vous";
							}else{
								this.message="la vidéo a été supprimé";
								this.$store.dispatch('importTheme')
							}
						});
					}else{
						this.message="vous avez mal saisi la vidéo";
					}
				}else{
					this.message="vous n'avez pas saisi tous les champs";
				}
			}
		},
		addCategorie(){
			if(this.$session.exists()){
				if (this.cat!=null) {
					axios({
						method :"post",
						url :"/themes/addCategorie",
						data:{
							u: {
								cat: this.cat.replace(/'/gi,"\\'")
							}
						}
					})
					.then(res=>{
						if(res.data.status=="NO"){
							this.message="la categorie existe déjà";
						}else if(res.data.status=="ER"){
							this.message="vous n'avez pas d'autorisation, connectez vous";
						}else{
							this.message="la categorie a été enregistré";
							this.$store.dispatch('importTheme')
						}
					});
				}else{
					this.message="vous n'avez pas saisi tous les champs";
				}
			}
		},
		supCategorie(){
			if(this.$session.exists()){
				if (this.catBis!=null){
					axios({
						method :"post",
						url :"/themes/supCategorie",
						data:{
							u: {
								cat: this.catBis.replace(/'/gi,"\\'")
							}
						}
					})
					.then(res=>{
						if(res.data.status=="NO"){
							this.message="la categorie n'existe pas";
						}else if(res.data.status=="ER"){
							this.message="vous n'avez pas d'autorisation, connectez vous";
						}else{
							this.message="la categorie a été supprimé";
							this.$store.dispatch('importTheme')
						}
					});
				}else{
					this.message="vous n'avez pas saisi tous les champs";
				}
			}
		},
		modifVideo(){
			if(this.$session.exists()){
				if(this.videoBisBis.video!=null){
					axios({
						method :"post",
						url :"/themes/modifVideo",
						data:{
							u: {
								video:this.videoBisBis.video
							}
						}
					})
					.then(res=>{
						if(res.data.status=="NO"){
							this.message="la vidéo n'existe pas";
							this.bool=false;
						}else if(res.data.status=="ER"){
							this.message="vous n'avez pas d'autorisation, connectez vous";
							this.bool=false;
						}else{
							this.message="vous pouvez modifier la vidéo";
							this.videoBisBis.date=res.data.video.date;
							this.videoBisBisBis.video=this.videoBisBis.video;
							this.videoBisBis.titre=res.data.video.titre;
							this.videoBisBis.categorie=res.data.video.categorie;
							this.bool=true;
						}
					});
				}else{
					this.message="vous n'avez pas saisi tous les champs";
				}
			}
		},
		modifVideoBis(){
			if(this.$session.exists()){
				if(this.videoBisBisBis.date === null && this.videoBisBisBis.titre === null && this.videoBisBisBis.categorie.length === 0){
					this.message="Veuillez renseigner au moins un élément";
				}else{
					axios({
						method :"post",
							url :"/themes/modifVideoBis",
							data:{
								u:this.videoBisBisBis
							}
					})
					.then(res=>{
						if (res.data=="OK") {
							this.message="les éléments de la vidéo ont été changé";
							this.$store.dispatch('importTheme')
						}else if(res.data=="ER"){
							this.message="vous n'avez pas d'autorisation, connectez vous";
						}
					});
					this.bool=false;
				}
			}
		},
		nl2br (str, is_xhtml) {   
    		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
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
							page:"themes",
							titre:this.nl2br(this.titreBis).replace(/'/gi,"\\'"),
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
		getTitre(){
			axios({
				method:"post",
				url:"/titre",
				data:{
					u:{
						page:"themes"
					}
				}
			})
			.then(res=>{
				this.titre=res.data;
			});
		}
	},
	mounted(){
		if(!this.categorie.length || !this.tab.length) {
			this.$store.dispatch('importTheme')
		} 
		this.getTitre()
		if(this.$session.exists()){
			axios({
				method :"get",
				url :"/themes/themesBis",
			})
			.then(res=>{
				this.tabBis=res.data;
			});	
		}
	}	
}
</script>

<style lang="scss" scoped>
$color: #ED6E13;
.video_categorie{
	display:flex;	
	flex-wrap:wrap;
	justify-content: space-around;
}
.video_categorie p{
	display:flex;
	align-items:center;
}
.btn{
	border-radius:20px;
	display:inline-block;
	margin-bottom:20px;
	color:$color;
	padding:10px;
	text-decoration:none;
	border:1px solid $color;
}
.btn:hover{
	background:$color;
	color:white;
	cursor: pointer;
}
.show{
	padding: 20px;
	background-color:$color;
	border-radius:20px;
	color: white;
}
.show:hover{
	color:white;
	background:white;
	cursor: pointer;
	border: 1px solid $color;
	color: $color;
}
.theme{
	display:flex;
	justify-content:space-around;
	flex-wrap:wrap;
	width:100%;
}
</style>
