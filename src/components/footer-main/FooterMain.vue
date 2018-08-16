<template lang="html">
	<footer>
		<p>&copy; Mentions légales</p>
		<div id="reseau">
			<i class="fab fa-youtube reseau you fa-2x"></i>		
			<i class="fab fa-facebook reseau fac fa-2x"></i>		
			<i class="fab fa-instagram reseau ins fa-2x"></i>		
			<i class="fab fa-twitter reseau twi fa-2x"></i>		
		</div>
	</footer>
</template>
<script>
export default{
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
		position:fixed;
		top:0;
		left:0;
		display:flex;
		flex-direction:column;
		justify-content:space-around;
		height:100vh;
	}
	.you{
		color:#d70000;
	}
	.fac{
		color:#50349f;
	}
	.ins{
		color:#321e2c;
	}
	.twi{
		color:#4281f6;
	}
	@media screen and (max-width:501px){
		#reseau{
			position:static;
			display:block;
		}
	}
</style>