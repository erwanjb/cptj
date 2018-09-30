<template lang="html">
	<nav id="nav_main">
    <!-- <img class="logo" src="./dist/assets/logoCPTJ.png"> -->
    <img class="logo" src="../../assets/logoCPTJ.png">
    <ul id="list">
      <div id="hamburger" class="cache" @click="showlistBis()">
        <div class="ligne"></div>
        <div class="ligne"></div>
        <div class="ligne"></div>
      </div>
      <router-link v-for="(page, n) in pages"
      :to="{name: page}" @click.native="hide_listes()" :key="n" tag="li"
      class="item" active-class="is-active" exact>
        <span>{{ page }}</span>
      </router-link>
      <li class="item" @click="showlist2()">
        <span>on en parle</span>
      </li>
      <li id="separateur">
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
      :to="{name: page}" :key="n" tag="li"
      class="itemBis" active-class="is-active" exact>
        <span>{{ page }}</span>
      </router-link>
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
      const separateur = document.getElementById("separateur")
      if (hide_list1.getAttribute("class")=="cache"){
        hide_list1.removeAttribute("class");
        navMain.style.height = "130px";
        separateur.style.width = "1px";
        separateur.style.height = "100px";
      }else{
        hide_list1.setAttribute("class","cache");
        if(hide_list2.getAttribute("class")=="cache"){
          navMain.style.height = "75px";
          separateur.style.width = "0px";
        }
      }
    },
    showlist2(){
      const hide_list2 = document.getElementById("hide2");
      const hide_list1 = document.getElementById("hide1");
      const navMain = document.getElementById("nav_main");
      const separateur = document.getElementById("separateur")
      if (hide_list2.getAttribute("class")=="cache"){
        hide_list2.removeAttribute("class");
        navMain.style.height = "130px";
        separateur.style.width = "1px";
        separateur.style.height = "100px";
      }else{
        hide_list2.setAttribute("class","cache");
        if(hide_list1.getAttribute("class")=="cache"){
          navMain.style.height = "75px";
          separateur.style.width = "0px";
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
      separateur.style.width = "0px";
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
#hide1.cache, #hide2.cache, #hamburger.cache,#show.cache{
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
#separateur{
  width:0px;
  background-color: black;
}
.itemBis:hover,.item:hover, .is-active {
  color: $color;
}	
#hamburger{
  width:60px;
  height:60px;
  display:flex;
  flex-direction:column;
  justify-content:space-around;
  align-items:center;
}
#show{
  display:flex;
  flex-direction:column;
}
@media screen and (max-width:630px){
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
@media screen and (min-width:631px){
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