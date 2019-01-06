<template lang="html">
	<footer>
		<p>&copy; Tous droits réservés Alice Reynaud</p>
		<div id="reseau">
			<div class="res">
				<a class="cont-res you2" href="https://www.youtube.com/channel/UC1auzQbFso05Rw4HvmXXsoQ">
					<i class="fas fa-play reseau you"></i>
				</a>
				<span>{{res.you}}</span>
				<div v-if="$session.exists()">
					<button @click="show">change</button>
					<form  @submit.prevent class="hide">
						<input type="text" v-model="resBis.you">
						<button @click="changeRes('you',resBis.you)">click</button>
					</form>
				</div>
			</div>
			<div class="res">
				<a class="cont-res fac2" href="https://fr-fr.facebook.com/cachepastajoie/">
					<i class="fab fa-facebook-f reseau fac fa-2x"></i>
				</a>
				<span>{{res.fac}}</span>
				<div v-if="$session.exists()">
					<button @click="show">change</button>
					<form  @submit.prevent class="hide">
						<input type="text" v-model="resBis.fac">
						<button @click="changeRes('fac',resBis.fac)">click</button>
					</form>
				</div>
			</div>
			<div class="res">
				<a class="cont-res ins" href="https://www.instagram.com/cachepastajoie/?hl=fr">
					<span id="ins">
						<i class="fab fa-instagram reseau ins fa-2x"></i>
					</span>
				</a>
				<span>{{res.ins}}</span>
				<div v-if="$session.exists()">
					<button @click="show">change</button>
					<form  @submit.prevent class="hide">
						<input type="text" v-model="resBis.ins">
						<button @click="changeRes('ins',resBis.ins)">click</button>
					</form>
				</div>
			</div>
			<span>{{message}}</span>				
		</div>
		<a href="#" id="ancre">
			<i class="fas fa-anchor fa-2x"></i>
		</a>
	</footer>
</template>
<script>
import axios from "axios";
export default{
	data(){
		return{
			res:{
				you: null,
				fac: null,
				ins: null,
			},
			resBis:{
				you: null,
				fac: null,
				ins: null,
			},
			message: null,
		}
	},
	mounted(){
		axios({
			method:"get",
			url:"/reseau"
		})
		.then(res=>{
			for(let i = 0; i < res.data.length; i++){
				if(res.data[i].reseau == "you"){
					this.res.you =res.data[i].follow;
				}
				if(res.data[i].reseau == "fac"){
					this.res.fac =res.data[i].follow;
				}
				if(res.data[i].reseau == "ins"){
					this.res.ins =res.data[i].follow;
				}
			}
		});
	},
	methods:{
		show(e){
			if(this.$session.exists()){
				const form = e.target.parentNode.querySelector("form");
				if(form.getAttribute("class")=="hide"){
					form.removeAttribute("class");
				}else{
					form.setAttribute("class","hide");
				}
			}
		},
		changeRes(res, follow){
			if(this.$session.exists()){
				if(follow!=null){
					axios({
						method:"post",
						url:"/reseau/changeRes",
						data: {
							u: {
								res: res,
								follow: follow,
							}
						}
					})
					.then(res=>{
						if(res.data=="OK"){
							this.message="le nombre de follow du réseau a été modifié";
						}else if(res.data=="ER"){
							this.message="vous n'avez pas les droits, connectez vous";
						}
					});
				}else{
					this.message="veuillez remplir le champ pour changer le nombre de follow";
				}
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	footer{
		height:150px;
		display:flex;
		flex-direction:column;
		align-items:center;
		justify-content:center;	
	}
	#reseau{
		position: fixed;
		margin-right: 50px;
		top: 0;
		right: 0;
		display:flex;
		flex-direction: column;
		justify-content:space-around;
		height: 100vh;
		z-index: 4;
	}
	.cont-res{
		width: 50px;
		height: 50px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.you{
		color:white;
		background-color: #d70000;
	}
	.fac{
		color:white;
		background-color: #50349f;
	}
	.ins{
		color:white;
	}
	.you2{
		background-color:#d70000;
	}
	.fac2{
		background-color:#50349f;
	}
	#ins{
		border-radius: 50%;
		width: 50px;
		height: 50px;
		background-image: url("../../assets/ins.jpg");
		background-size: cover;
		display:flex;
		justify-content:center;
		align-items:center;
		margin: auto;
	}
	.hide{
		display:none;
	}
	.res{
		display:flex;
		flex-direction: column;
	}
	#ancre{
		width: 50px;
		height: 50px;
		border-radius: 50%;
		display: flex;
		justify-content:center;
		align-items: center;
		position: fixed;
		left: 50px;
		bottom: 50px;
		color: white;
		background-color: orange;
	}
	@media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none){
		footer p{
			margin-top: 100px;
		}
	}
</style>
