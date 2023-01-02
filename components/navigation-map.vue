<script>
import store from "store-js";
import { GoogleMap } from "vue3-google-map";

export default {
    name: "NavigationMapComponent",
    components: {
        GoogleMap,
    },
    computed: {
        api_key() {
            return store.get("navigation.api_key");
        },
    },
};
</script>

<template>
    <div class="map-wrapper">
        <GoogleMap
            class="map"
            :api-key="api_key"
            :zoom="18"
            :tilt="60"
            :disable-default-ui="true"
            :draggable="false"
            gesture-handling="cooperative"
            map-id="9a664a373c810533"
            language="de"
            :center="{ lat: 47.047834597918644, lng: 8.303957758935331 }"
        >
            <template #default="{ ready, api, map }">
                <div v-if="ready" class="map-slot">
                    <slot :api="api" :map="map" />
                </div>
            </template>
        </GoogleMap>
    </div>
</template>

<style lang="scss" scoped>
.map-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

    .map {
        width: 140%;
        height: calc(100% + 15px);
        position: absolute;
        right: 0;
        top: 0;

        .map-slot {
            position: absolute;
            top: 0;
            bottom: 15px;
            right: 0;
            left: calc(calc(100% / 140) * 40);
        }
    }
}
</style>
