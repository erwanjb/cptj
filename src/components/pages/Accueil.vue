<template lang="html">
    <div id="main_accueil">
    	<h1>Cache Pas Ta Joie</h1>
    	<iframe :src="video"></iframe>	
  	</div>
</template>

<script>
import axios from "axios";
export default {
	data (){
		return{
			video:null
		}
	},
	mounted(){
		axios({
			method:"get",
			url:"/accueil"
		})
		.then(res=>{
			this.video=res.data;
		});
	}
}
</script>

<style lang="scss" scoped>
	iframe{
		width:80%;
		height:80vh;
	}
</style>