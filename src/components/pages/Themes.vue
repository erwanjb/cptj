<template lang="html">
    <div id="main_themes">
    	<h2>Vidéos par thèmes</h2>
    	<div id="admin" v-if="$session.exists()">
    		<form @submit.prevent class="envoie">
    			<p>ajouter une vidéo</p>
    			<input type="text" v-model="video.video"><br>
    			<p v-for="(c,i) in categoriebis">
    				<label for="c">{{c}}</label>
    				<input type="checkbox" :id="c" v-model="video.categorie" :value="categorie[i]">
    			</p>
    			<input type="text" v-model="video.titre"><br>
    			<input type="date" v-model="video.date"><br>
    			<button @click="addVideo()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>supprimer une vidéo</p>
    			<input type="text" v-model="videoBis"><br>
    			<button @click="supVideo()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>ajouter une catégorie</p>
    			<input type="text" v-model="cat"><br>
    			<button @click="addCategorie()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>supprimer une catégorie</p>
    			<input type="text" v-model="catBis"><br>
    			<button @click="supCategorie()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>vidéos qui n'ont pas de catégorie</p>
    			<div id="videoWithoutCat">
    				<iframe v-for="t in tabBis" :src="t.video"></iframe>
    			</div>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>modifier la date d'une vidéo</p>
				<input type="text" v-model="videoBisBis.video">
				<button @click="modifVideo()">click</button>
				<div v-if="bool">
					<p>la date de la vidéo est: {{videoBisBis.date}}</p>
					<input type="date" v-model="videoBisBisBis.date"><br>
					<button @click="modifDate()">click</button>
				</div>
    		</form>
    		<p id="message">{{message}}</p>
    	</div>
    	<div id="main_video">
    		<div v-for="(c,i) in categorie" class="categorie">
    			<a href="" class="btn" @click="show($event)">{{categoriebis[i]}}</a>
    			<section style="display:none;" class="video_categorie" :id="c">
    				<div v-for="t in tab[i]" class="item_video">
    					<h3>{{t.titre}}</h3>
    					<section class="video"><iframe :src="t.video"></iframe></section>
    				</div>
    				<p v-if="nb[i]">
    					<label @click="showMore($event)"class="show">···/···</label>
    					<input type="hidden" :value="nb[i]" class="nb">
    					<input type="hidden" :value="i" class="index">
    					<input type="hidden" :value="categorie[i]" class="cat">
    				</p>
    			</section>
    		</div>
    	</div>
  	</div>
</template>

<script>
import axios from "axios";
export default {
	data(){
		return{
			nb:[],
			message:null,
			tab:[],
			tabBis:[],
			categorie:[],
			categoriebis:[],
			video:{
				video:null,
				categorie:[],
				titre:null,
				date:null
			},
			videoBis:null,
			videoBisBis:{
				video:null,
				date:null
			},
			videoBisBisBis:{
				video:null,
				date:null
			},
			cat:null,
			catBis:null,
			bool:false
		}
	},
	methods:{
		show(e){
			e.preventDefault();
			if(e.target.parentNode.querySelector(".video_categorie").style.display == "none"){
				e.target.parentNode.querySelector(".video_categorie").style.display = "flex";
			}else{
				e.target.parentNode.querySelector(".video_categorie").style.display = "none";
			} 
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
									date:this.video.date
									}
							}
						})
						.then(res=>{
							if(res.data.status=="NO"){
								this.message="la vidéo est déjà présente";
							}else{
								this.message="la vidéo a été enregistré";
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
								u:this.videoBis
							}
						})
						.then(res=>{
							if(res.data.status=="NO"){
								this.message="la vidéo n'est pas enregistré";
							}else{
								this.message="la vidéo a été supprimé";
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
							u:this.cat.replace(/'/gi,"\\'")
						}
					})
					.then(res=>{
						if(res.data.status=="NO"){
							this.message="la categorie existe déjà";
						}else{
							this.message="la categorie a été enregistré";
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
							u:this.catBis.replace(/'/gi,"\\'")
						}
					})
					.then(res=>{
						if(res.data.status=="NO"){
							this.message="la categorie n'existe pas";
						}else{
							this.message="la categorie a été supprimé";
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
							u:this.videoBisBis.video
						}
					})
					.then(res=>{
						if(res.data.status=="NO"){
							this.message="la vidéo n'existe pas";
						}else{
							this.message="vous pouvez modifier la vidéo";
							this.videoBisBis.date=res.data.date;
							this.videoBisBisBis.video=this.videoBisBis.video;
							this.bool=true;
						}
					});
				}else{
					this.message="vous n'avez pas saisi tous les champs";
				}
			}
		},
		modifDate(){
			if(this.$session.exists()){
				if(this.videoBisBisBis.date!=null){
					axios({
						method :"post",
							url :"/themes/modifDate",
							data:{
								u:this.videoBisBisBis
							}
					})
					.then(res=>{
						if (res.data=="OK") {
							this.message="la date a été changé";
						}
					});
				}else{
					this.bool=false;
					this.message="vous n'avez pas saisi tous les champs";
				}
			}
		}
	},
	mounted(){
		axios({
			method :"get",
			url :"/themes"
		})
		.then(res =>{
			this.categorie =res.data.categorie;
			this.tab = res.data.tab;
			this.nb = res.data.nb;
			for(let i= 0;i<this.categorie.length;i++){
				let stock ="";
				for(let j=0;j<this.categorie[i].length;j++){
					if(this.categorie[i][j]=="_"||this.categorie[i][j]=="\\"){
						if(this.categorie[i][j]=="_"){
							stock+=" ";
						}
						if(this.categorie[i][j]=="\\"){
							stock+="";
						}

					}else{
						stock+=this.categorie[i][j];
					}
				}
				this.categoriebis[i]=stock;
			}
		});
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
	color:$color;
	border: 1px solid $color;
	border-radius:20px;
}
.show:hover{
	color:white;
	background:$color;
	cursor: pointer;
}
</style>