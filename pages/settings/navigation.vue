<script>
import store from "store-js";
import models from "@/framework/models";

export default {
    name: "NavigationSettingsPage",
    data() {
        return {
            api_key: null,
            model: models[0],
        };
    },
    computed: {
        models() {
            return models;
        },
    },
    watch: {
        api_key(value) {
            store.set("navigation.api_key", value);
        },
        model(value) {
            store.set("navigation.model", value.name);
        },
    },
    methods: {
        ready({ renderer, model, camera, scene }) {
            renderer.setAnimationLoop((time) => {
                model.rotation.y = time / 2000;
                renderer.render(scene, camera);
            });
        },
    },
    mounted() {
        this.api_key = store.get("navigation.api_key");
        this.model = models.find((model) => model.name == (store.get("navigation.model") || models[0].name));
    },
};
</script>

<template>
    <div class="main">
        <vtextfield v-model="api_key" title="Google API Key" />
        <div class="title">Auto Model</div>
        <vselect v-model="model" :items="models" item-text="name" />
        <navigation-car :model="model" :camera="{ x: 0, y: 0, z: 550 }" :rotation="{ x: 10, y: 60, z: 0 }" @ready="ready" />
    </div>
</template>

<style lang="scss" scoped>
.main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    padding: 2rem;
}

#nav-car {
    width: 100%;
    height: 250px;
}
</style>
