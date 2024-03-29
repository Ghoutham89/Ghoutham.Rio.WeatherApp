import { defineNuxtPlugin } from "#app";
import * as ElIconsModules from "@element-plus/icons-vue";
import "element-plus/theme-chalk/display.css";
import ElementPlus from "element-plus";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus);
  Object.keys(ElIconsModules).forEach((key) => {
    if ("Menu" !== key) {
      nuxtApp.vueApp.component(key, ElIconsModules[key]);
    } else {
      nuxtApp.vueApp.component(key + "Icon", ElIconsModules[key]);
    }
  });
});
