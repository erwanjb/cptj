<template lang="html">
	<nav id="nav_main">
    <ul id="list">
      <img class="logo" src="dist/assets/cptj.jpg">
      <div id="hamburger" class="cache" @click="showlistBis()">
        <div class="ligne"></div>
        <div class="ligne"></div>
        <div class="ligne"></div>
      </div>
      <router-link v-for="(page, n) in pages"
      :to="{name: page}" :key="n" tag="li"
      class="item" active-class="is-active" exact>
        <span>{{ page }}</span>
      </router-link>
      <li class="item" @click="showlist2()">
        <span>on en parle</span>
      </li>
      <li class="item" @click="showlist1()">
        <span>vidéos</span>
      </li>
    </ul>
    <ul id="hide1" class="cache">
      <router-link v-for="(page, n) in pages2"
      :to="{name: page}" :key="n" tag="li"
      class="item" active-class="is-active" exact>
        <span>{{ page }}</span>
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
    const items = document.querySelectorAll("#list .item");
    const list = document.getElementById("list");
    list.insertBefore(items[items.length-1], items[1]);
    list.insertBefore(items[items.length-2], items[1]);
  },
	data(){
		return{
			pages:[
				"accueil",
        "apropos",
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
        "apropos",
        "contact"
      ]
		}
	},
  methods:{
    showlist1(){
      const hide_list1 = document.getElementById("hide1");
      const hide_list2 = document.getElementById("hide2");
      const list = document.getElementById("list");
      if (hide_list1.getAttribute("class")=="cache"){
        hide_list1.removeAttribute("class");
        list.style.marginBottom = "50px";
      }else{
        hide_list1.setAttribute("class","cache");
        if(hide_list2.getAttribute("class")=="cache"){
          list.style.marginBottom = "16px";
        }
      }
    },
    showlist2(){
      const hide_list2 = document.getElementById("hide2");
      const hide_list1 = document.getElementById("hide1");
      const list = document.getElementById("list");
      if (hide_list2.getAttribute("class")=="cache"){
        hide_list2.removeAttribute("class");
        list.style.marginBottom = "50px";
      }else{
        hide_list2.setAttribute("class","cache");
        if(hide_list1.getAttribute("class")=="cache"){
          list.style.marginBottom = "16px";
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
    }
  }
}
</script>
<style lang="scss" scoped>
$color : #ED6E13;
.logo{
  width:150px;
  height:75px;
}
#nav_main {
  position:relative;
  margin: 0 auto;
}
#hide1, #hide2{
  position:absolute;
  top:60px;
  width:50%;
}
#nav_main{
  position:relative;
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
  align-items: center;
  list-style: none;
  padding: 0;
}
#hide1.cache, #hide2.cache, #hamburger.cache,#show.cache{
  display:none;
}
.itemBis,.item{
  font-size: 1rem;
  margin-right: 15px;
  cursor: pointer;
  color: blue;
  font-family: "LemonMilk";
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