<template lang="html">
    <div id="main_contact">
    	<h2>Contact</h2>
    	<form action="https://formspree.io/wawan.jb@gmail.com" method="post">
			<label for="email">votre mail : </label><input type="email" id="email" name="email"><br>
			<label for="nom">votre prénom ou pseudo : </label><input type="text" id="nom" name="nom"><br>
			<label for="text">votre message : </label><textarea id="text" cols="60" rows="10" name="text"></textarea><br>
			<input type="submit" value="Envoyer">
		</form>
  	</div>
</template>

<script>

export default {
}
</script>

<style lang="scss" scoped>
input{
	margin-bottom:10px;
}
form{
	display:flex;
	flex-direction:column;
	align-items:center;
}
</style>