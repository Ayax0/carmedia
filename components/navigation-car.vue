<script lang="ts">
import * as THREE from "three";
import FBXLoader from "@/utils/fbxloader";

export default {
    name: "NavigationCarComponent",
    methods: {
        degToRad(deg) {
            return (deg * Math.PI) / 180;
        },
    },
    mounted() {
        const target = document.getElementById("nav-car");
        if (!target) return;
        const width = target.clientWidth;
        const height = target.clientHeight;

        const camera = new THREE.PerspectiveCamera(50, width / height);

        camera.position.y = 80;
        camera.position.z = 2000;

        const scene = new THREE.Scene();

        const light = new THREE.DirectionalLight(0xfffffb, 0.5); // soft white light
        light.position.z = 800;
        scene.add(light);

        const loader = new FBXLoader();

        loader.load(
            "/3d/opelcorsac.fbx",
            (fbx) => {
                console.log("Loaded:", fbx);

                fbx.children = fbx.children.filter((children) => children instanceof THREE.Mesh);
                fbx.children.forEach((mesh: THREE.Mesh) => {
                    mesh.material.find((material: THREE.MeshPhongMaterial) => material.name == "MainColor").color = new THREE.Color(0xcccccc);

                    const lights = mesh.material.find((material: THREE.MeshPhongMaterial) => material.name == "Lights");
                    const backlights = mesh.material.find((material: THREE.MeshPhongMaterial) => material.name == "BackLight");

                    lights.emissive = new THREE.Color(0xfffffb);
                    lights.emissiveIntensity = 50;

                    backlights.emissive = new THREE.Color(0xff0000);
                    backlights.emissiveIntensity = 200;
                });

                fbx.rotation.x = this.degToRad(30);
                fbx.rotation.y = this.degToRad(180);

                scene.add(fbx);

                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setSize(width, height);
                // renderer.setAnimationLoop((time) => {
                //     fbx.rotation.y = time / 2000;
                //     renderer.render(scene, camera);
                // });

                renderer.render(scene, camera);

                document.getElementById("nav-car")?.appendChild(renderer.domElement);
            },
            () => console.log("progress"),
            (error) => console.log(error)
        );
    },
};
</script>

<template>
    <div id="nav-car"></div>
</template>

<style lang="scss" scoped>
#nav-car {
    position: absolute;
    top: 0;
    left: 0;
    width: 60%;
    height: 100%;
}
</style>
