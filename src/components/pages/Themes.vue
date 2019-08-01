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
    			<p>supprimer une vidéo</p>
    			<input type="text" v-model="videoBis" placeholder="source"><br>
    			<button @click="supVideo()">click</button>
    		</form>
    		<form @submit.prevent class="envoie">
    			<p>choisir la/les catégorie(s) des vidéos</p>
    			<a-table :dataSource="dataSource" :columns="columns">
    				<input v-for="(c,i) in categorie" type="checkbox" :slot="c" slot-scope="text,record"  href="javascript:;" v-model="catVid[i].find(e => e.vid == record.key).check" />
    				<iframe slot="video" slot-scope="text,record" :src="'https://www.youtube.com/embed/' + record.url"></iframe>
    			</a-table>
    			<button @click="submitCatVid()">enregistrer les catégories des vidéos</button>
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
					<section class="video"><iframe :src="'https://www.youtube.com/embed/'+t.video"></iframe></section>
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
		},
		columns(){
			return [{
			  	title: 'video',
			  	key: 'video',
			  	scopedSlots: { customRender: 'video' }
			}, {
			  	title: 'titre',
			  	dataIndex: 'titre',
			  	key: 'titre',
			},
			...this.$store.state.categorie.map((c, i) => {
				return {
					key: c,
					title: this.$store.state.categoriebis[i],
					scopedSlots: { customRender: c }
				}
			})]
		},
		catVid() {
			return this.$store.state.categorie.map((c, i) => {
				return this.dataSource.map(ele => {
					if(this.$store.state.tab[i].find(e => e.id_video == ele.key)){
						return {
							vid: ele.key,
							check: true
						}
					}
					return {
							vid: ele.key,
							check: false
						}
				})
			})
		},
	},
	// watch: {
	// 	tab(val){
	// 		console.log(val)
	// 	}
	// },
	data(){
		return{
			dataSource: [],
			message:null,
			videoBis:null,
			cat:null,
			catBis:null,
			bool:false,
			titre:null,
			titreBis:null,
			bool2:false,
		}
	},
	methods:{
		submitCatVid(){
			const arr = []
			for(let i = 0; i < this.catVid.length; i++) {
				for(let j = 0; j < this.catVid[i].length; j++ ) {
					if (!!this.tab[i].find(e => e.id_video == this.catVid[i][j].vid) && !this.catVid[i][j].check) {
						arr.push({
							vid: this.catVid[i][j].vid,
							cat: this.categorie[i],
							check: this.catVid[i][j].check
						})
					}
					if (!this.tab[i].find(e => e.id_video == this.catVid[i][j].vid) && this.catVid[i][j].check) {
						arr.push({
							vid: this.catVid[i][j].vid,
							cat: this.categorie[i],
							check: this.catVid[i][j].check
						})
					}
				}
			}
			axios({
				method:"post",
				url:"/themes/adCatVid",
				data:{
					arr
				}
			})
			.then(res=>{
				if(res.data.status=="ER"){
					this.message="vous n'avez pas d'autorisation, connectez vous";
				}else{
					this.message="les catégories ont été associé aux vidéos";
					this.$store.dispatch('importTheme')
				}
			});
		},
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
						cat:cat,
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
		addCategorie(){
			if(this.$session.exists()){
				if (this.cat!=null) {
					axios({
						method :"post",
						url :"/themes/addCategorie",
						data:{
							u: {
								cat: this.cat
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
								cat: this.catBis
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
								this.getAllVideo()
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
		},
		getAllVideo() {
			axios({
				method :"get",
				url :"/themes/allVideo",
			})
			.then(res=>{
				this.dataSource=res.data.map(d => {
					return {
						key: d.id,
						url: d.video,
						titre: d.titre
					}
				});
			});
		}
	},
	mounted(){
		if(!this.categorie.length || !this.tab.length) {
			this.$store.dispatch('importTheme')
		} 
		this.getTitre()
		if(this.$session.exists()){
			this.getAllVideo()
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
h3{
	width: 320px;
	height: 100px;
}
</style>
