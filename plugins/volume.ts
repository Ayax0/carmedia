import store from "store-js";

export default defineNuxtPlugin(() => {
    $fetch("/api/volume", { method: "POST", body: { volume: store.get("general.default_volume") || 20 } });
});
