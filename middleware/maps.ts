import store from "store-js";

export default defineNuxtRouteMiddleware(() => {
    if (!store.get("navigation.api_key")) return navigateTo("/settings/navigation");
});
