<script lang="ts" setup>
import store from "store-js";
import { Map } from "maplibre-gl";
import RoutingApi from "@/framework/navigation/RoutingApi";

const ready = ref(false);
const map = ref<Map>();
const api = new RoutingApi(store.get("navigation.api_key"));

onMounted(() => {
    map.value = new Map({
        container: "map",
        zoom: 18,
        style: "https://api.maptiler.com/maps/bbed2c88-042e-46ec-8e60-5f5b12cd78e1/style.json?key=iHYc2jkalmprZBsL4zHn",
        interactive: false,
        pitch: 60,
        center: { lat: 47.05286779391203, lon: 8.28453444777522 },
    });

    ready.value = true;
});
</script>

<template>
    <div class="map-wrapper">
        <div id="map" class="map">
            <div v-if="ready" class="map-slot">
                <slot :api="api" :map="map" />
            </div>
        </div>
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
