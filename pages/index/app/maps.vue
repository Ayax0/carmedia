<script lang="ts">
import store from "store-js";
import models from "~~/framework/models";

export default defineComponent({
    computed: {
        model() {
            const model = models.find((model) => model.name == (store.get("navigation.model") || models[0].name));
            model.color.primary = store.get("navigation.model.primary") || model.color.primary;
            return model;
        },
    },
});
</script>

<template>
    <navigation-map>
        <template #default="{ api, map }">
            <navigation-car :model="model" />
            <navigation-control />
            <navigation-movement :api="api" :map="map" />
        </template>
    </navigation-map>
</template>

<style lang="scss" scoped>
#nav-car {
    position: absolute;
    top: 0;
    left: 0;
    width: 60%;
    height: 100%;
}
</style>
