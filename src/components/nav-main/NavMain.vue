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
        :to="{name: page}" @click.native="hide_listes()" :key="n" tag="li"
        class="item" active-class="is-active" exact>
          <span>{{ page }}</span>
        </router-link>
        <li class="item">
          <a href="https://cachepastajoie.niceshop.co/" class="boutique">Boutique</a>
        </li>
        <li class="item" @click="showlist2($event)">
          <span>on en parle</span>
        </li>
        <li class="item" @click="showlist1($event)">
          <span>vidéos</span>
        </li>
      </ul>
      <div id="video" class="cache"></div>
      <div id="parle" class="cache"></div>
      <ul id="hide1" class="cache">
        <router-link v-for="(page, n) in pages2"
        :to="{name: page}" :key="n" tag="li"
        class="item" active-class="is-active" exact>
          <span >{{ page }}</span>
        </router-link>
      </ul>
      <ul id="hide2" class="cache">
        <router-link v-for="(page, n) in pages4"
        :to="{name: page}" :key="n" tag="li"
        class="item" active-class="is-active" exact>
          <span>{{ page }}</span>
        </router-link>
      </ul>
      <ul id="show" class="cache">
        <router-link v-for="(page, n) in pages3" 
        :to="{name: page}" @click.native="hide_listesBis()" :key="n" tag="li"
        class="itemBis" active-class="is-active" exact>
          <span>{{ page }}</span>
        </router-link>
        <li class="itemBis">
          <a href="https://cachepastajoie.niceshop.co/" class="boutique">Boutique</a>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
export default{
  mounted(){
    const items = document.querySelectorAll("#list .item");
    const list = document.getElementById("list");
    list.insertBefore(items[items.length-1], items[1]);
    list.insertBefore(items[items.length-2], items[1]);
  },
	data(){
		return{
			pages:[
				"accueil",
        "à propos",
				"contact"
			],
      pages2:[
        "chronologique",
        "themes"
      ],
      pages4:[
        "actualites",
        "revue de presse"
      ],
      pages3:[
        "accueil",
        "chronologique",
        "themes",
        "actualites",
        "revue de presse",
        "à propos",
        "contact"
      ]
		}
	},
  methods:{
    showlist1(e){
      const video = document.getElementById("video");
      const parle = document.getElementById("parle");
      const hide_list1 = document.getElementById("hide1");
      const hide_list2 = document.getElementById("hide2");
      const navMain = document.getElementById("nav_main");
      if (hide_list1.getAttribute("class")=="cache"){
        hide_list1.removeAttribute("class");
        hide_list1.style.left = (e.target.offsetLeft +e.target.offsetWidth/2) + 80 + "px";
        navMain.style.height = "130px";
        video.removeAttribute("class");
        video.style.top = (e.target.offsetTop +e.target.offsetHeight) + "px";
        video.style.left = (e.target.offsetLeft +e.target.offsetWidth/2) + "px";
        if(hide_list2.getAttribute("class")!="cache"){
          hide_list2.setAttribute("class","cache");
          parle.setAttribute("class", "cache");
        }
      }else{
        hide_list1.setAttribute("class","cache");
        navMain.style.height = "75px";
        video.setAttribute("class", "cache");
      }
    },
    showlist2(e){
      const video = document.getElementById("video");
      const parle = document.getElementById("parle");
      const hide_list2 = document.getElementById("hide2");
      const hide_list1 = document.getElementById("hide1");
      const navMain = document.getElementById("nav_main");
      if (hide_list2.getAttribute("class")=="cache"){
        hide_list2.removeAttribute("class");
        hide_list2.style.left = (e.target.offsetLeft +e.target.offsetWidth/2) + 80 + "px";
        navMain.style.height = "130px";
        parle.removeAttribute("class");
        parle.style.top = (e.target.offsetTop +e.target.offsetHeight) + "px";
        parle.style.left = (e.target.offsetLeft +e.target.offsetWidth/2) + "px";
        if(hide_list1.getAttribute("class")!="cache"){
          hide_list1.setAttribute("class","cache");
          video.setAttribute("class", "cache");
        }
      }else{
        hide_list2.setAttribute("class","cache");
        navMain.style.height = "75px";
        parle.setAttribute("class", "cache");
      }
    },
    showlistBis(){
      const show = document.getElementById("show");
      if (show.getAttribute("class")=="cache"){
        show.removeAttribute("class");
      }else{
        show.setAttribute("class","cache");
      }
    },
    hide_listes(){
      const hide_list2 = document.getElementById("hide2");
      const hide_list1 = document.getElementById("hide1");
      const navMain = document.getElementById("nav_main");
      const video = document.getElementById("video");
      const parle = document.getElementById("parle");
      if(hide_list2.getAttribute("class")!=="cache"){
        hide_list2.setAttribute("class","cache");
        parle.setAttribute("class","cache");
      }
      if(hide_list1.getAttribute("class")!=="cache"){
        hide_list1.setAttribute("class","cache");
        video.setAttribute("class","cache");
      }
      navMain.style.height= "75px";
      document.querySelector(".item:nth-child(2)").style.borderRight = "1px solid";
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
#video,#parle{
  z-index: 2;
  position: absolute;
  border-bottom: 1px solid;
  border-left: 1px solid;
  width: 80px;
  height: 40px;
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
  #video{
    display:none;
  }
  #parle{
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
