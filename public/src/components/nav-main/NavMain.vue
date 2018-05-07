<template lang="html">
	<nav id="nav_main">
    <ul id="list">
      <router-link v-for="(page, n) in pages"
      :to="{name: page}" :key="n" tag="li"
      class="item" active-class="is-active" exact>
        <span>{{ page }}</span>
      </router-link>
      <li class="item" @click="showlist()">
        <span>vidéos</span>
      </li>
    </ul>
    <ul id="hide">
      <router-link v-for="(page, n) in pages2"
      :to="{name: page}" :key="n" tag="li"
      class="item" active-class="is-active" exact>
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
    const hide_list = document.getElementById("hide");
    hide_list.style.display="none";


  },
	data(){
		return{
			pages:[
				"accueil",
				"actualites",
        "apropos",
				"contact"
			],
      pages2:[
        "chronologique",
        "themes"
      ]
		}
	},
  methods:{
    showlist(){
      const hide_list = document.getElementById("hide");
      if(hide_list.style.display=="none"){
        hide_list.style.display="flex";
      }else{
        hide_list.style.display="none";
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#nav_main {
  margin: 0 auto;
}
#list, #hide {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  padding: 0;
}

.item{
  font-size: 1rem;
  margin-right: 15px;
  cursor: pointer;
}

.item:hover, .is-active {
  color: #42b983;
}	
</style>