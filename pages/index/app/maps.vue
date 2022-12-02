<script lang="ts">
import * as THREE from "three";
import FBXLoader from "@/utils/fbxloader";

export default {
    methods: {
        degToRad(deg) {
            return deg * Math.PI / 180
        }
    },
    mounted() {
        const camera = new THREE.PerspectiveCamera();

        camera.position.z = 800;

        const scene = new THREE.Scene();

        const light = new THREE.DirectionalLight(0xfffffb, 0.5); // soft white light
        light.position.z = 800;
        scene.add( light );

        const loader = new FBXLoader();
        
        loader.load("/3d/opelcorsac.fbx", (fbx) => {
            console.log("Loaded:", fbx);
            
            fbx.children = fbx.children.filter((children) => children instanceof THREE.Mesh);
            fbx.children.forEach((mesh: THREE.Mesh) => {
                mesh.material.find((material: THREE.MeshPhongMaterial) => material.name == "MainColor").color = new THREE.Color(0xff0000);
                
                const lights = mesh.material.find((material: THREE.MeshPhongMaterial) => material.name == "Lights");
                const backlights = mesh.material.find((material: THREE.MeshPhongMaterial) => material.name == "BackLight");

                lights.emissive = new THREE.Color(0xfffffb);
                lights.emissiveIntensity = 50;

                backlights.emissive = new THREE.Color(0xff0000);
                backlights.emissiveIntensity = 200;
            })

            fbx.rotation.x = this.degToRad(60);
            fbx.rotation.y = this.degToRad(180);

            scene.add(fbx);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(300, 300);
            /*renderer.setAnimationLoop((time) => {
                fbx.rotation.y = time / 2000;

                renderer.render(scene, camera);
            });*/

            renderer.render(scene, camera);

            document.getElementById("render_screen").appendChild(renderer.domElement);
        }, () => console.log("progress"),
        (error) => console.log(error));
    }
}
</script>

<template>
    <div id="render_screen" style="margin: calc(50vh - 150px - 4rem) calc(50vw - 150px)"></div>
</template>