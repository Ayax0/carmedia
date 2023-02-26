<script lang="ts" setup>
import NavigationCar from "@/framework/navigation/NavigationCar";
import models, { Model } from "@/framework/models";
import Setting from "@/framework/Setting";
import { awaitElement } from "@/framework/utils";
import { UBX_ESF_STATUS_DATA, UBX_NAV_PVT_DATA } from "@nextlvlup/ubx-parser/dist/types";

const api_key = new Setting("navigation.api_key");
const model = new Setting<Model>(
    "navigation.model",
    models[0],
    (value) => value?.name,
    (value) => models.find((m) => m.name == value)
);
const color = new Setting<string>("navigation.model.primary", "hsl(30, 100%, 50%)");
const gps_status = ref<UBX_ESF_STATUS_DATA>();
const gps_position = ref<UBX_NAV_PVT_DATA>();
const recording_state = ref<{ status: boolean; recordings: Array<string> }>();
const { $socket } = useNuxtApp();

var car: NavigationCar;

model.watch((value) => car.setModel(value));

color.watch((value) => {
    console.log(model.value);
    car.setColor(model.value.colorMapping.primary, value);
});

function mapSensorStatus(status) {
    if (status == 0) return "not calibrated";
    if (status == 1) return "calibrating...";
    if (status == 2 || status == 3) return "calibrated";
    return "unknown";
}
function mapFusionMode(mode) {
    if (mode == 0) return "initialization mode";
    if (mode == 1) return "fusion mode";
    if (mode == 2) return "suspended fusion mode";
    if (mode == 3) return "disabled fusion mode";
    return "unknown";
}
function mapFixType(type) {
    if (type == 0) return "no fix";
    if (type == 1) return "dead reckoning only";
    if (type == 2) return "2d-fix";
    if (type == 3) return "3d-fix";
    if (type == 4) return "gnss + dead reckoning";
    if (type == 5) return "time only fix";
    return "unknown";
}

function triggerRecording() {
    $fetch("/api/gps/recording", { method: "POST" });
    $fetch("/api/gps/recording").then((res) => (recording_state.value = res as { status: boolean; recordings: Array<string> }));
}

onMounted(async () => {
    const carElement = await awaitElement("car");

    car = new NavigationCar(carElement);
    await car.setModel(model.value);
    car.setPosition(0, 0, 550);
    car.setRotation(10, 60, 0);

    var rotation = 0;
    setInterval(() => car.setRotation(10, rotation++, 0), 25);

    $socket.on("gps", (packet) => {
        if (packet.packet_class == 0x10 && packet.packet_id == 0x10) gps_status.value = packet;
        if (packet.packet_class == 0x01 && packet.packet_id == 0x07) gps_position.value = packet;
    });

    $fetch("/api/gps/recording").then((res) => (recording_state.value = res as { status: boolean; recordings: Array<string> }));
});
</script>

<template>
    <div class="main">
        <vtextfield v-model="api_key.value" title="Google API Key" />
        <div class="title">Auto Model</div>
        <vselect v-model="model.value" :items="models" item-text="name" />
        <color-picker v-model="color.value" />
        <client-only><div id="car" style="min-height: 200px" /></client-only>
        <table>
            <tr>
                <th>Gyroskope X</th>
                <th>{{ mapSensorStatus(gps_status?.sensors?.find((sensor) => sensor.type == 14)?.calibStatus) }}</th>
            </tr>
            <tr>
                <th>Gyroskope Y</th>
                <th>{{ mapSensorStatus(gps_status?.sensors?.find((sensor) => sensor.type == 13)?.calibStatus) }}</th>
            </tr>
            <tr>
                <th>Gyroskope Z</th>
                <th>{{ mapSensorStatus(gps_status?.sensors?.find((sensor) => sensor.type == 5)?.calibStatus) }}</th>
            </tr>
            <tr>
                <th>Accelerometer X</th>
                <th>{{ mapSensorStatus(gps_status?.sensors?.find((sensor) => sensor.type == 16)?.calibStatus) }}</th>
            </tr>
            <tr>
                <th>Accelerometer Y</th>
                <th>{{ mapSensorStatus(gps_status?.sensors?.find((sensor) => sensor.type == 17)?.calibStatus) }}</th>
            </tr>
            <tr>
                <th>Accelerometer Z</th>
                <th>{{ mapSensorStatus(gps_status?.sensors?.find((sensor) => sensor.type == 18)?.calibStatus) }}</th>
            </tr>
            <tr>
                <th>Fusion Mode</th>
                <th>{{ mapFusionMode(gps_status?.fusionMode) }}</th>
            </tr>
            <tr>
                <th>Fix Type</th>
                <th>{{ mapFixType(gps_position?.fixType) }}</th>
            </tr>
        </table>
        <button @click="triggerRecording">{{ recording_state?.status ? "GPS Aufnahme stoppen" : "GPS Aufnahme starten" }}</button>
        <table>
            <tr>
                <th>Aufnahmen</th>
            </tr>
            <tr v-for="recording in recording_state?.recordings">
                <td>{{ recording }}</td>
            </tr>
        </table>
    </div>
</template>

<style lang="scss" scoped>
.main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    padding: 2rem;

    table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
        margin: 1rem 0;
    }

    td,
    th {
        width: 50%;
        border: 1px solid #111111;
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even) {
        background-color: #3f3f3f;
    }
}

#car {
    width: 100%;
    height: 250px;
}

button {
    padding: 10px 20px;
    border-radius: 5px;
    border: 2px solid $primary;
    background: transparent;
    color: white;
    font-size: 16px;
}
</style>
