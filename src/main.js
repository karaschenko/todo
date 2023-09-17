import { createApp } from "vue";
import App from "./App.vue";
import LoginForm from "./pages/LoginForm.vue";
import Dashboard from "./pages/DashboardPage.vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import { clickOutside } from "./directives/click-outside";
import "./assets/scss/global.scss";

const routes = [
  { path: "/", component: LoginForm },
  { path: "/dashboard", component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.directive("click-outside", clickOutside);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.mount("#app");
