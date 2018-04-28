<template>
  <div id="app">
    <header-main></header-main>
    <nav-main></nav-main>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import HeaderMain from "./components/header-main/HeaderMain.vue";
import NavMain from "./components/nav-main/NavMain";
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },components:{
    HeaderMain,
    NavMain
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
#admin{
  display:flex;
  justify-content:space-around;
  align-items:start;
  flex-wrap:wrap;
}
.envoie{
  border:1px solid orange;
  padding:10px;
}
input,textarea{
  border:3px solid orange;
  border-radius:10px;
}
</style>
