<script lang="ts" setup>
import store from "store-js";
import { getDistance } from "geolib";
import { awaitElement } from "@/framework/utils";
import RoutingApi from "@/framework/navigation/RoutingApi";
import NavigationMap from "@/framework/navigation/NavigationMap";

import models from "@/framework/models";

const { $socket } = useNuxtApp();

const ready = ref(false);
const target = ref<string>();
var route: any;
var route_index = 0;

var map: NavigationMap;
var api = new RoutingApi(store.get("navigation.api_key"));

const model = models.find((model) => model.name == (store.get("navigation.model") || models[0].name));
model.color.primary = store.get("navigation.model.primary") || model.color.primary;

var last_updated = Date.now();

var searchTimeout;
watch(target, (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    if (value)
        searchTimeout = setTimeout(() => {
            api.autocomplete(value, { bias: "countrycode:ch", lang: "de" }).then((res) => console.log(res));
        }, 3000);
});

function test(event) {
    console.log("test", event);
}

onMounted(async () => {
    const mapElement = await awaitElement("map");

    map = new NavigationMap(mapElement);
    $socket.on("gps", (packet) => map.triggerGps(packet));

    map.setCenter({ lat: 69.33962872160589, lon: 88.22484034061034 });

    function calcCurrentStep() {
        if (!route) return;

        const center = map.getCenter();
        const distanceMap: Array<{ index: number; distance: number }> = [];
        route.features.forEach((feature: any) => {
            feature.geometry.coordinates.forEach((position: Array<number>) => {
                const distance = getDistance(center, { lat: position[1], lon: position[0] });
                distanceMap.push({ index: feature.properties.index, distance });
            });
        });
        distanceMap.sort((a, b) => a.distance - b.distance);
        route_index = distanceMap[0].index;

        route.features.forEach((feature: any) => map.setFeatureState({ id: feature.id, source: "route" }, { current_index: route_index }));
    }

    ready.value = true;
});
</script>

<template>
    <div class="map-wrapper">
        <div id="map" class="map">
            <div v-if="ready" class="map-slot">
                <navigation-car :model="model" />
                <navigation-control v-model:target="target" :api="api" @submit="test" />
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

            #nav-car {
                position: absolute;
                top: 0;
                left: 0;
                width: 60%;
                height: 100%;
            }
        }
    }
}
</style>
