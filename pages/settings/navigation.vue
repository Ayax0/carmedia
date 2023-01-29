<script>
import store from "store-js";
import models from "@/framework/models";

export default {
    name: "NavigationSettingsPage",
    data() {
        return {
            api_key: null,
            model: models[0],
            color: "hsl(30, 100%, 50%)",
            gps_status: null,
            gps_position: null,
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
            this.color = value.color.primary;
        },
        color(value) {
            store.set("navigation.model.primary", value);
            this.model.color.primary = value;
        },
    },
    methods: {
        ready({ renderer, model, camera, scene }) {
            renderer.setAnimationLoop((time) => {
                model.rotation.y = time / 2000;
                renderer.render(scene, camera);
            });
        },
        mapSensorStatus(status) {
            if (status == 0) return "not calibrated";
            if (status == 1) return "calibrating...";
            if (status == 2 || status == 3) return "calibrated";
            return "unknown";
        },
        mapFusionMode(mode) {
            if (mode == 0) return "initialization mode";
            if (mode == 1) return "fusion mode";
            if (mode == 2) return "suspended fusion mode";
            if (mode == 3) return "disabled fusion mode";
            return "unknown";
        },
        mapFixType(type) {
            if (type == 0) return "no fix";
            if (type == 1) return "dead reckoning only";
            if (type == 2) return "2d-fix";
            if (type == 3) return "3d-fix";
            if (type == 4) return "gnss + dead reckoning";
            if (type == 5) return "time only fix";
            return "unknown";
        },
    },
    mounted() {
        this.api_key = store.get("navigation.api_key");
        const model = models.find((model) => model.name == (store.get("navigation.model") || models[0].name));
        model.color.primary = store.get("navigation.model.primary");
        this.model = model;

        this.$socket.on("gps", (packet) => {
            if (packet.packet_class == 0x10 && packet.packet_id == 0x10) {
                this.gps_status = packet;
            }

            if (packet.packet_class == 0x01 && packet.packet_id == 0x07) {
                this.gps_position = packet;
            }
        });
    },
};
</script>

<template>
    <div class="main">
        <vtextfield v-model="api_key" title="Google API Key" />
        <div class="title">Auto Model</div>
        <vselect v-model="model" :items="models" item-text="name" />
        <color-picker v-model="color" />
        <navigation-car style="min-height: 200px" :model="model" :camera="{ x: 0, y: 0, z: 550 }" :rotation="{ x: 10, y: 60, z: 0 }" @ready="ready" />
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
        border: 1px solid #1b1b1b;
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even) {
        background-color: #3f3f3f;
    }
}

#nav-car {
    width: 100%;
    height: 250px;
}
</style>
