<template lang="html">
	<nav id="nav_main">
    <div id="span">
      <img class="logo" src="../../assets/logoCPTJ.png">
      <div id="hamburger" class="cache" @click="showlistBis()">
        <div class="ligne"></div>
        <div class="ligne"></div>
        <div class="ligne"></div>
      </div>
    </div>
    <ul id="list">
      <router-link v-for="(page, n) in pages"
      :to="{name: page}" @click.native="hide_listes()" :key="n" tag="li"
      class="item" active-class="is-active" exact>
        <span>{{ page }}</span>
      </router-link>
      <li class="item">
        <a href="https://cachepastajoie.niceshop.co/" class="boutique">Boutique</a>
      </li>
      <li class="item" @click="showlist2()">
        <span>on en parle</span>
      </li>
      <li id="separateur" class="cache">
      </li>
      <li class="item" @click="showlist1()">
        <span>vidéos</span>
      </li>
    </ul>
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
</template>
<script>
export default{
  mounted(){
    const separateur = document.getElementById("separateur");
    const items = document.querySelectorAll("#list .item");
    const list = document.getElementById("list");
    list.insertBefore(items[items.length-1], items[1]);
    list.insertBefore(separateur, items[1]);
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
    showlist1(){
      const hide_list1 = document.getElementById("hide1");
      const hide_list2 = document.getElementById("hide2");
      const navMain = document.getElementById("nav_main");
      const separateur = document.getElementById("separateur");
      if (hide_list1.getAttribute("class")=="cache"){
        hide_list1.removeAttribute("class");
        navMain.style.height = "130px";
        separateur.removeAttribute("class");
        document.querySelector(".item:nth-child(2)").style.borderRight = "none";
      }else{
        hide_list1.setAttribute("class","cache");
        if(hide_list2.getAttribute("class")=="cache"){
          navMain.style.height = "75px";
          separateur.setAttribute("class","cache");
          document.querySelector(".item:nth-child(2)").style.borderRight = "1px solid";
        }
      }
    },
    showlist2(){
      const hide_list2 = document.getElementById("hide2");
      const hide_list1 = document.getElementById("hide1");
      const navMain = document.getElementById("nav_main");
      const separateur = document.getElementById("separateur");
      if (hide_list2.getAttribute("class")=="cache"){
        hide_list2.removeAttribute("class");
        navMain.style.height = "130px";
        separateur.removeAttribute("class");
        document.querySelector(".item:nth-child(2)").style.borderRight = "none";
      }else{
        hide_list2.setAttribute("class","cache");
        if(hide_list1.getAttribute("class")=="cache"){
          navMain.style.height = "75px";
          separateur.setAttribute("class","cache");
          document.querySelector(".item:nth-child(2)").style.borderRight = "1px solid";
        }
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
      const navMain = document.getElementById("nav_main")
      if(hide_list2.getAttribute("class")!=="cache"){
        hide_list2.setAttribute("class","cache");
      }
      if(hide_list1.getAttribute("class")!=="cache"){
        hide_list1.setAttribute("class","cache");
      }
      navMain.style.height= "75px";
      separateur.setAttribute("class","cache");
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
  width:200px;
  height:75px;
  background-color:white;
}
#span{
  display:flex;
}
#nav_main {
  position:fixed;
  display:flex;
}
#hide1, #hide2{
  position:absolute;
  top:70px;
  width:50%;
}
#hide1{
  left:0;
}
#hide2{
  left:50%;
}
#list, #hide1, #hide2 {
  display: flex;
  justify-content: center;
  align-items: start;
  list-style: none;
  padding: 0;
}
#hide1.cache, #hide2.cache, #hamburger.cache,#show.cache,#separateur.cache {
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
}
.item{
    border-right: 1px solid;
}
.itemBis:last-child, .item:last-child{
  border-right:none;
}
#separateur{
  width:1px;
  height: 100px;
  background-color: black;
  margin:0;
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
}
#show{
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
  #separateur{
    width:0;
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