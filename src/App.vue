<template>
  <div id="app">
    <nav-main></nav-main>
    <main>
      <router-view></router-view>
    </main>
    <footer-main></footer-main>
  </div>
</template>

<script>
import NavMain from "./components/nav-main/NavMain";
import FooterMain from "./components/footer-main/FooterMain.vue";
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components:{
    NavMain,
    FooterMain
  }
}
</script>

<style lang="scss">
$color:#ED6E13;
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
}
@font-face {
  font-family: "Dinski";
  src: url('./assets/DinskiCPTJ.ttf');
  font-weight: bold;
}
@font-face{
  font-family: "LemonMilk";
  src: url("./assets/LemonMilk/LemonMilklight.otf");
}
h1, h2 {
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  text-align: center;
  font-weight: normal;
  font-family: "LemonMilk";
  color: black;
}

main{
  padding-top:200px;
  width: 80%;
  margin: 0 auto;
}
p{
  font-family: Helvetica;
}
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
} 
#admin{
  display:flex;
  justify-content:space-around;
  align-items:start;
  flex-wrap:wrap;
  margin-bottom:50px;
}
.envoie{
  border:1px solid $color;
  padding:10px;
}
input,textarea{
  border:3px solid $color;
  border-radius:10px;
}
footer{
  margin-top:50px;
}
</style>
