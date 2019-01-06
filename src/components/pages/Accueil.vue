<template lang="html">
    <div id="main_accueil">
    	<h1>{{ titre }}</h1>
    	<div v-if="$session.exists()">
    		<button @click="showTitre()">change titre</button>
    		<form @submit.prevent v-if="bool" id="titre">
    			<input type="text" v-model="titreBis">
    			<button @click="modifTitre()">click</button>
    		</form>
    	</div>
    	<p>{{ message }}</p>
    	<iframe :src="video"></iframe>	
  	</div>
</template>

<script>
import axios from "axios";
export default {
	data (){
		return{
			video:null,
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
							page:"accueil",
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
			url:"/accueil"
		})
		.then(res=>{
			this.video=res.data;
		});
		axios({
			method:"post",
			url:"/titre",
			data:{
				u:{
					page:"accueil"
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
	iframe{
		width:60%;
		height:60vh;
	}
</style>