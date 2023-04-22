import Ripple from "vue3-whr-ripple-directive";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("ripple", Ripple);
});
