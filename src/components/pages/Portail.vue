<template>
	<main id="connection">
		<form @submit.prevent>
			<input type="text" v-model="user.identifiant">
			<input type="password" v-model="user.password">
			<button @click="connection()">click</button>
		</form>
		<button v-if="$session.exists()" @click="deco">déconnexion</button>
		<div>
			<div id="message">{{message}}</div>
		</div>
	</main>
</template>
<script>
import axios from "axios";
export default{
	  data() {
	  	return{
	  		message:null,
		  	user: {
		  		identifiant :null,
		  		password :null	
		  	},
		}
	  },
	  methods:{
	  	connection(){
	  		axios({
		        method: "post",
		        url: "/portail",
			    withCredentials:true,
		        data:{
		        	u:this.user
		        }
		    })
		    .then(res => {
		    	if('token' in res.data){
		    		this.$session.start();
		    		window.location.reload()
		    		//this.$session.set('jwt', res.data.token);
		    		this.message="vous êtes connecté";
		    	}else{
		    		this.message="vous n'avez pas les droits";
		    	}
		    });
	  	},
	  	deco(){
	  		axios({
	  			method: 'post',
	  			url: '/deco'
	  		})
	  		.then(res =>{
	  			this.$session.destroy()
	  			this.message="vous n'êtes plus connecté";
	  			window.location.reload()
	  		})
	  	}
	  }
}
</script>
<style lang="scss" scoped>
	
</style>