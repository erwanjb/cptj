import Vue from 'vue';
import App from './App.vue';
import axiosConfig from "./axios.config";
import store from './store';
import VueRouter from "vue-router";
import { routes } from "./routes";
import VueSession from 'vue-session';
import fontawesome from "@fortawesome/fontawesome";
import regular from "@fortawesome/fontawesome-free-regular";
import brands from "@fortawesome/fontawesome-free-brands";
import solid from "@fortawesome/fontawesome-free-solid";

fontawesome.library.add(regular, brands, solid);

Vue.use(VueRouter);
Vue.use(VueSession);

const router = new VueRouter({
  routes,
  mode: "history"
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});