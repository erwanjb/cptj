<template lang="html">
    <div id="main_chrono">
    	<h2 v-if="titre">{{ titre }}</h2>
    	<div v-if="$session.exists()">
    		<button @click="showTitre()">change titre</button>
    		<form @submit.prevent v-if="bool" id="titre">
    			<input type="text" v-model="titreBis">
    			<button @click="modifTitre()">click</button>
    		</form>
    	</div>
    	<div id="main_video">
	    	<div v-for="t in tab" class="item_video">
	    		<h3>{{t.titre}}</h3>
	    		<section class="video"><iframe :src="t.video"></iframe></section>
	    	</div>
	    	<p v-if="nb">
				<label @click="showMore($event)"class="show">en voir plus</label>
				<input type="hidden" :value="nb" class="nb">
			</p>
	    </div>
  	</div>
</template>

<script>
import axios from "axios";
export default {
	data(){
		return{
			nb:null,
			tab:[],
			titre:null,
			titreBis:null,
			bool:false,
			message:null,
		}
	},
	mounted(){
		this.getTitre()
		axios({
			method :"get",
			url :"/chrono"
		})
		.then(res =>{
			this.tab = res.data.donnees;
			if(res.data.nb){
				this.nb = res.data.nb;
			}
		});
	},
	methods:{
		getTitre(){
			axios({
				method:"post",
				url:"/titre",
				data:{
					u:{
						page:"chronologique"
					}
				}
			})
			.then(res=>{
				this.titre=res.data;
			});
		},
		showMore(e){
			const nb =e.target.parentNode.querySelector(".nb").value;
			axios({
				method :"post",
				url : "/chrono/addMore",
				data:{
					nb:nb
				}
			})
			.then(res =>{
				for(let i =0;i<res.data.donnees.length;i++){
					this.tab.push(res.data.donnees[i]);
				}
				if(res.data.nb){
					this.nb = res.data.nb;
				}else{
					this.nb = null;
				}
			});
		},
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
							page:"chronologique",
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
	}	
}
</script>

<style lang="scss" scoped>
$color:#ED6E23;
#main_video{
	display:flex;	
	flex-wrap:wrap;
	justify-content: space-around;
}
#main_video p{
	display:flex;
	align-items:center;
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
</style>