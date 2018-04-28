<template lang="html">
    <div id="main_apropos">
    	<div id="admin" v-if="$session.exists()">
    		<form @submit.prevent class="envoie">
	    		<textarea v-model="aproposBis" cols="40" rows="10"></textarea>
	    		<button @click="modifApropos()">click</button>
	    	</form>
	    	<p id="message">{{message}}</p>
    	</div>
    	<div id="apropos" v-html="apropos"></div>
  	</div>
</template>

<script>
import axios from "axios";
export default {
	data(){
		return{
			apropos:null,
			aproposBis:null,
			message:null
		}
	},
	mounted(){
		axios({
			method:"get",
			url:"/apropos"
		})
		.then(res=>{
			this.apropos=res.data;
		});
	},
	methods:{
		nl2br (str, is_xhtml) {   
    		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
		},
		modifApropos(){
			if(this.$session.exists()){
				if(this.aproposBis!=null){
					axios({
						method:"post",
						url:"/apropos/modifApropos",
						data:{
							u:this.nl2br(this.aproposBis).replace(/'/gi,"\\'")
						}
					})
					.then(res=>{
						if (res.data="OK") {
							this.message="le à propos a été changé"
						}
					});
				}else{
					this.message="veuillez saisir les champs";
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
</style>