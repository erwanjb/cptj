import Vue from 'vue';
import App from './App.vue';
import axiosConfig from "./axios.config";
import VueRouter from "vue-router";
import { routes } from "./routes";
import VueSession from 'vue-session';


Vue.use(VueRouter);
Vue.use(VueSession);

const router = new VueRouter({
  routes,
  mode: "history"
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

