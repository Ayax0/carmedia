<script>
import { vue3dLoader } from "vue-3d-loader";

export default {
    components: {
        vue3dLoader
    },
    methods: {
        degToRad(deg) {
            return deg * Math.PI / 180
        }
    },
}
</script>

<template>
    <div>
        <ClientOnly>
            <vue3dLoader
                :height="347"
                :backgroundAlpha="0"
                :cameraPosition="{ x: 0, y: 0, z: 2500 }"
                :rotation="{ x: degToRad(30), y: degToRad(180), z: 0 }"
                filePath="/assets/3d/opelcorsac.fbx"
            />
        </ClientOnly>
    </div>
</template>