<template lang="html">
    <div id="main_actualite">
    	<div id="admin" v-if="$session.exists()">
    		<form @submit.prevent class="envoie">
    			<p>ajouter une actualité</p>
    			<textarea v-model="actu.actu" cols="40" rows="6"></textarea><br>
    			<input type="date" v-model="actu.date"><br>
    			<button @click="addActu()">click</button>
    		</form>
    		<form>
    			
    		</form>
    		<p id="message">{{message}}</p>
    	</div>
    	<div id="main_actu">
    		<section v-for="t in tab" class="actualite">
    			<span class="date">{{t.date}} :</span>
    			<span class="actu" v-html="t.actualite"></span>
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
			actu:{
				actu:null,
				date:null
			},
			message:null
		}
	},
	methods:{
		nl2br (str, is_xhtml) {   
    		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
		},
		addActu(){
			if(this.$session.exists()){
				if (this.actu.actu!=null&&this.actu.date!=null){
					axios({
						method:"post",
						url:"/actualite/addActu",
						data:{
							u:{
								actu:this.nl2br(this.actu.actu).replace(/'/gi,"\\'"),
								date:this.actu.date
							}
						}
					})
					.then(res=>{
						if (res.data=="NO") {
							this.message="il y a déjà une actualité à cette date";
						}else{
							this.message="l'actualité a été ajouté";
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
			url:"/actualite"
		})
		.then(res=>{
			this.tab=res.data;
		});
	}
}
</script>

<style lang="scss" scoped>
.actualite{
	margin-left:30%;
	display:flex;
	margin-bottom:100px;
}
.date{
	margin-right:50px;		
}
.actu{
	margin:auto;
	text-align:left;
}
@media screen and (max-width:500px){
	.actualite{
		display:block;
		margin-left:0;
	}
	.actualite span{
		display:block;
	}
	.actu{
		margin-left:20px;
	}
}
</style>