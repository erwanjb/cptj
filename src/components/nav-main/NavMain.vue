<template lang="html">
  <div>
    <router-link :to="{name: 'accueil'}">
      <img class="logo" src="../../assets/logoCPTJ.png">
    </router-link>
    <div id="span">
      <div id="hamburger" class="cache" @click="showlistBis()">
        <div class="ligne"></div>
        <div class="ligne"></div>
        <div class="ligne"></div>
      </div>
    </div>
  	<nav id="nav_main">
      <ul id="list">
        <router-link v-for="(page, n) in pages"
        :to="{name: page}" :key="n" tag="li"
        class="item" active-class="is-active" exact>
          <span>{{ page }}</span>
        </router-link>
        <li class="item">
          <a href="https://cachepastajoie.niceshop.co/" target="_blank" class="boutique">Boutique</a>
        </li>
      </ul>
      <ul id="show" class="cache">
        <router-link v-for="(page, n) in pages" 
        :to="{name: page}" @click.native="hide_listesBis()" :key="n" tag="li"
        class="itemBis" active-class="is-active" exact>
          <span>{{ page }}</span>
        </router-link>
        <li class="itemBis">
          <a href="https://cachepastajoie.niceshop.co/" target="_blank" class="boutique">Boutique</a>
        </li>
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
        "on en parle",
        "contact"
      ]
		}
	},
  methods:{
    showlistBis(){
      const show = document.getElementById("show");
      if (show.getAttribute("class")=="cache"){
        show.removeAttribute("class");
      }else{
        show.setAttribute("class","cache");
      }
    },
    hide_listesBis(){
      const show = document.getElementById("show");
      show.setAttribute("class", "cache");
    }
  }
}
</script>
<style lang="scss" scoped>
$color : #ED6E13;
.logo{
  display: block;
  margin: 0 auto;
  width:200px;
  height:75px;
  background-color:white;
  z-index: 1;
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
  position:absolute;
  top: 150px;
  left: 0;
  display:flex;
  width:100%;
}
#hide1, #hide2{
  position:absolute;
  top:70px;
}
#list{
  width:100%;
  justify-content: center;
}
#list, #hide1, #hide2 {
  display: flex;
  align-items: start;
  list-style: none;
  padding: 0;
}
#hide1, #hide2{
  margin-top: 0;
}
#hide1.cache, #hide2.cache, #hamburger.cache,#show.cache,#video.cache,#parle.cache{
  display:none;
}
.itemBis,.item{
  margin:0;
  font-size: 1rem;
  padding: 5px;
  cursor: pointer;
  color: black;
  font-family: "LemonMilk";
  font-size: 20px;
  background-color: white;
  z-index: 1;
}
.item{
    border-right: 1px solid;
}
.itemBis:last-child, .item:last-child{
  border-right:none;
}
.itemBis:hover,.item:hover, .is-active,.boutique:hover {
  color: $color;
}	
#hamburger{
  width:60px;
  height:60px;
  display:flex;
  flex-direction:column;
  justify-content:space-around;
  align-items:center;
  background-color:white;
  z-index: 3;
}
#show{
  position: absolute;
  top: 100px;
  left: 30%;
  display:flex;
  flex-direction:column;
}
.boutique{
  font-family: "LemonMilk";
  color:black;
  text-decoration:none;
}
@media screen and (max-width:750px){
  #nav_main{
    display: block;
  }
  #hamburger.cache{
    display:flex;
  }
  .item{
    display:none;
  }
  #show.cache{
    display:none;
  }
}
@media screen and (max-width: 687px){
  #span{
      top: 180px;
  }
}
@media screen and (max-width: 366px){
  #span{
      top: 215px;
  }
}
@media screen and (min-width:751px){
  #show{
    display:none;
  }
}
.ligne{
  width:50px;
  height:10px;
  background-color:black;
}
</style>
