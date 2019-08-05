<template lang="html">
  <div>
    <router-link :to="{name: 'accueil'}">
      <img class="logo" src="./../../assets/logoCPTJ.png">
    </router-link>
  	<nav id="nav_main">
      <ul id="list">
        <router-link v-for="(page, n) in pages"
        :to="{name: page}" :key="n" tag="li"
        class="item" active-class="is-active" exact>
          <span>{{ page }}</span>
        </router-link>
        <!-- <li class="item">
          <a href="https://cachepastajoie.niceshop.co/" target="_blank" class="boutique">Boutique</a>
        </li> -->
      </ul>
    </nav>
  </div>
</template>
<script>
export default{
  mounted(){
    //
  },
	data(){
		return{
      pages:[
        "accueil",
        "toutes les vidéos",
        "vidéos par thème",
        "on s'éclate",
        "on en parle",
        "contact"
      ]
		}
	},
  methods:{
  }
}
</script>
<style lang="scss" scoped>
img{
  text-align:center;
}
$color : #ED6E13;
.logo{
  padding-top:30px;
  display: block;
  margin: 0 auto;
  width:200px;
  background-color:white;
  z-index: 1;
  padding-bottom: 50px;
}
#span{
  display: flex;
  justify-content:center;
  position:absolute;
  width: 100%;
  top: 150px;
  left: 0;
}
#nav_main {
  display:flex;
  width:100%;
}
#list{
  width:100%;
  justify-content: center;
  display: flex;
  align-items: start;
  list-style: none;
  padding: 0;
  flex-wrap:wrap;
}
.itemBis,.item{
  margin-right:20px;
  font-size: 1rem;
  padding: 5px;
  cursor: pointer;
  color: black;
  font-family: "LemonMilk";
  font-size: 20px;
  background-color: white;
  z-index: 1;
}
.item:nth-child(4), .item:nth-child(6) {
  color: blue;
}

.item:hover, .is-active,.boutique:hover, .item:nth-child(4).is-active, .item:nth-child(6).is-active {
  color: $color;
}
.boutique{
  font-family: "LemonMilk";
  color:black;
  text-decoration:none;
}
</style>
