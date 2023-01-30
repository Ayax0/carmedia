<script setup lang="ts">
const { api, map } = defineProps<{
    api: typeof google.maps;
    map: google.maps.Map;
}>();

const { $socket } = useNuxtApp();
$socket.on("gps", (packet) => {
    if (!map) return;

    // UBX-NAV-PVT
    if (packet.packet_class == 0x01 && packet.packet_id == 0x07) {
        var speed = packet.gSpeed * 0.0036;
        var heading = packet.headVeh - 180;
        if (heading == 0) heading = 180;
        else if (heading < 0) heading += 180;
        else if (heading > 0) heading -= 180;

        map.panTo({ lat: packet.lat, lng: packet.lon });
        map.setHeading(heading);
        if (speed > 70) map.setZoom(16);
        else map.setZoom(18);
    }
});
</script>

<template>
    <div></div>
</template>

<style lang="scss" scoped></style>
