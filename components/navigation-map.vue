<script lang="ts" setup>
import store from "store-js";
import { Map } from "maplibre-gl";
import RoutingApi from "@/framework/navigation/RoutingApi";
import { getDistance } from "geolib";

const { $socket } = useNuxtApp();

const ready = ref(false);
const target = ref<string>();
var route: any;
var route_index = 0;

var map: Map;
var api = new RoutingApi(store.get("navigation.api_key"));

var last_updated = Date.now();

var searchTimeout;
watch(target, (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    if (value)
        searchTimeout = setTimeout(() => {
            api.autocomplete(value, { bias: "countrycode:ch", lang: "de" }).then((res) => console.log(res));
        }, 3000);
});

onMounted(async () => {
    const mapElement: HTMLElement = await new Promise(async (resolve) => {
        var timer = setInterval(() => {
            const el = document.getElementById("map");
            if (el != null) {
                clearInterval(timer);
                resolve(el);
            }
        }, 100);
    });

    map = new Map({
        container: mapElement,
        style: window.location.origin + "/api/map",
        interactive: false,
        zoom: 18,
        pitch: 60,
        center: { lat: 47.03366628206786, lon: 8.273711278740961 },
    });

    $socket.on("gps", (packet) => {
        if (packet.packet_class == 0x01 && packet.packet_id == 0x07) {
            setTimeout(() => {
                const speed = packet.gSpeed * 0.0036;

                map.easeTo({
                    center: { lat: packet.lat, lng: packet.lon },
                    bearing: packet.headVeh,
                    zoom: speed > 65 ? 16 : 18,
                    duration: Date.now() - last_updated,
                    easing: (num) => num,
                });

                calcCurrentStep();

                last_updated = Date.now();
            }, 1);
        }
    });

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

    function setTunnel(state: boolean, duration = 1000) {
        map.setPaintProperty("building", "fill-opacity-transition", { duration });
        map.setPaintProperty("building_3d", "fill-extrusion-opacity-transition", { duration });
        map.setPaintProperty("road_name", "text-opacity-transition", { duration });
        map.setPaintProperty("road_service", "line-opacity-transition", { duration });
        map.setPaintProperty("road_major", "line-opacity-transition", { duration });
        map.setPaintProperty("road_minor", "line-opacity-transition", { duration });
        map.setPaintProperty("road_service_outline", "line-opacity-transition", { duration });
        map.setPaintProperty("road_private", "line-opacity-transition", { duration });
        map.setPaintProperty("road_major_outline", "line-opacity-transition", { duration });
        map.setPaintProperty("road_minor_outline", "line-opacity-transition", { duration });
        map.setPaintProperty("road_oneway", "icon-opacity-transition", { duration });
        map.setPaintProperty("railway_hatching", "line-opacity-transition", { duration });
        map.setPaintProperty("railway", "line-opacity-transition", { duration });

        map.setPaintProperty("building", "fill-opacity", state ? 0 : 1);
        map.setPaintProperty("building_3d", "fill-extrusion-opacity", state ? 0 : 0.9);
        map.setPaintProperty("road_name", "text-opacity", state ? 0 : 1);
        map.setPaintProperty("road_service", "line-opacity", state ? 0 : 1);
        map.setPaintProperty("road_major", "line-opacity", state ? 0 : 1);
        map.setPaintProperty("road_minor", "line-opacity", state ? 0 : 1);
        map.setPaintProperty("road_service_outline", "line-opacity", state ? 0 : 1);
        map.setPaintProperty("road_private", "line-opacity", state ? 0 : 1);
        map.setPaintProperty("road_major_outline", "line-opacity", state ? 0 : 1);
        map.setPaintProperty("road_minor_outline", "line-opacity", state ? 0 : 1);
        map.setPaintProperty("road_oneway", "icon-opacity", state ? 0 : 1);
        map.setPaintProperty("railway_hatching", "line-opacity", state ? 0 : 1);
        map.setPaintProperty("railway", "line-opacity", state ? 0 : 1);
        map.setLayoutProperty("poi", "visibility", state ? "none" : "visible");
    }

    ready.value = true;
});
</script>

<template>
    <div class="map-wrapper">
        <div id="map" class="map">
            <div v-if="ready" class="map-slot">
                <slot :api="api" :map="map" />
                <navigation-control v-model:target="target" />
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
