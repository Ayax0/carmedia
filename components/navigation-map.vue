<script lang="ts" setup>
import store from "store-js";
import { Map } from "maplibre-gl";
import RoutingApi from "@/framework/navigation/RoutingApi";

const { $socket } = useNuxtApp();

const ready = ref(false);
const map = ref<Map>();
const api = new RoutingApi(store.get("navigation.api_key"));

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

    console.log(mapElement);

    map.value = new Map({
        container: mapElement,
        zoom: 18,
        style: "https://api.maptiler.com/maps/bbed2c88-042e-46ec-8e60-5f5b12cd78e1/style.json?key=iHYc2jkalmprZBsL4zHn",
        pitch: 60,
        interactive: false,
    });

    $socket.on("gps", (packet) => {
        // UBX-NAV-PVT
        if (packet.packet_class == 0x01 && packet.packet_id == 0x07) {
            setTimeout(() => {
                map.value.easeTo({
                    center: { lat: packet.lat, lng: packet.lon },
                    bearing: packet.headVeh,
                    duration: 100,
                    easing: (num) => num,
                });
            }, 1);
            if (packet.gSpeed * 0.0036 > 70) map.value.setZoom(16);
            else map.value.setZoom(18);
        }
    });

    ready.value = true;
});
</script>

<template>
    <div class="map-wrapper">
        <div id="map" class="map">
            <div v-if="ready" class="map-slot">
                <slot :api="api" :map="map" />
                <navigation-control />
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
