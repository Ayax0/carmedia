<script lang="ts" setup>
import store from "store-js";
import { Map } from "maplibre-gl";
import RoutingApi from "@/framework/navigation/RoutingApi";

const { $socket } = useNuxtApp();

const ready = ref(false);
const map = ref<Map>();
const api = new RoutingApi(store.get("navigation.api_key"));
const target = ref<string>();

var last_updated = Date.now();

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

    map.value = new Map({
        container: mapElement,
        style: window.location.origin + "/api/map",
        interactive: false,
        zoom: 18,
        pitch: 60,
    });

    $socket.on("gps", (packet) => {
        if (packet.packet_class == 0x01 && packet.packet_id == 0x07) {
            setTimeout(() => {
                const speed = packet.gSpeed * 0.0036;

                map.value.easeTo({
                    center: { lat: packet.lat, lng: packet.lon },
                    bearing: packet.headVeh,
                    zoom: speed > 70 ? 16 : 18,
                    duration: Date.now() - last_updated,
                    easing: (num) => num,
                });

                last_updated = Date.now();
            }, 1);
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
