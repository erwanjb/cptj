<template lang="html">
    <div id="main_chrono">
    	<h2>Vidéos par ordre chronologique</h2>
    	<div id="main_video">
	    	<div v-for="t in tab" class="item_video">
	    		<h3>{{t.titre}}</h3>
	    		<section class="video"><iframe :src="t.video"></iframe></section>
	    	</div>
	    	<p v-if="nb">
				<label @click="showMore($event)"class="show">···/···</label>
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
			tab:[]
		}
	},
	mounted(){
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
		}
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