<script lang="ts">
import * as THREE from "three";
import FBXLoader from "@/utils/fbxloader";
import { Model } from "~~/framework/models";

export default defineComponent({
    name: "NavigationCarComponent",
    props: {
        model: { type: Object as () => Model, required: true },
        camera: { type: Object, default: () => ({ x: 0, y: 0, z: 2000 }) },
        rotation: { type: Object, default: () => ({ x: 30, y: 180, z: 0 }) },
    },
    watch: {
        model: {
            deep: true,
            handler(value) {
                this.render(value);
            },
        },
    },
    methods: {
        degToRad(deg) {
            return (deg * Math.PI) / 180;
        },
        render(model) {
            if (!model) return;

            const width = this.$el.clientWidth;
            const height = this.$el.clientHeight;

            // Scene
            const scene = new THREE.Scene();

            // Camera
            const camera = new THREE.PerspectiveCamera(50, width / height);
            camera.position.x = this.camera.x;
            camera.position.y = this.camera.y;
            camera.position.z = this.camera.z;

            // Ambient Light
            const light = new THREE.DirectionalLight(0xfffffb, 0.7);
            light.position.z = 2000;
            scene.add(light);

            const loader = new FBXLoader();
            loader.load(
                model.path,
                (fbx) => {
                    // Filter Mesh
                    fbx.children = fbx.children.filter((children) => children instanceof THREE.Mesh);

                    // Loop over Meshes
                    fbx.children.forEach((mesh: THREE.Mesh) => {
                        if (model.colorMapping.primary) {
                            const mat_primary = this.findMaterial(mesh, model.colorMapping.primary);
                            mat_primary.color = new THREE.Color(model.color.primary);
                            mat_primary.specular = new THREE.Color(model.color.primary);
                        }

                        if (model.colorMapping.secondary) {
                            const mat_secondary = this.findMaterial(mesh, model.colorMapping.secondary);
                            mat_secondary.color = new THREE.Color(model.color.secondary);
                        }

                        if (model.colorMapping.head_light) {
                            const mat_head_light = this.findMaterial(mesh, model.colorMapping.head_light);
                            mat_head_light.color = new THREE.Color(model.color.head_light);
                            mat_head_light.emissive = new THREE.Color(model.color.head_light);
                            mat_head_light.emissiveIntensity = 200;
                        }

                        if (model.colorMapping.primary) {
                            const mat_back_light = this.findMaterial(mesh, model.colorMapping.back_light);
                            mat_back_light.color = new THREE.Color(model.color.back_light);
                            mat_back_light.emissive = new THREE.Color(model.color.back_light);
                            mat_back_light.emissiveIntensity = 200;
                        }
                    });

                    fbx.position.x = model.offset?.x || 0;
                    fbx.position.y = model.offset?.y || 0;
                    fbx.position.z = model.offset?.z || 0;

                    fbx.rotation.x = this.degToRad((model.offset?.rotation_x || 0) + this.rotation.x);
                    fbx.rotation.y = this.degToRad((model.offset?.rotation_y || 0) + this.rotation.y);
                    fbx.rotation.z = this.degToRad((model.offset?.rotation_z || 0) + this.rotation.z);

                    fbx.scale.x = model.offset?.scale_x || 1;
                    fbx.scale.y = model.offset?.scale_y || 1;
                    fbx.scale.z = model.offset?.scale_z || 1;

                    scene.add(fbx);

                    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                    renderer.setSize(width, height);

                    renderer.render(scene, camera);

                    const navcar = document.getElementById("nav-car");
                    if (!navcar) return;

                    while (navcar.firstChild) navcar.removeChild(navcar.firstChild);
                    navcar.appendChild(renderer.domElement);

                    this.$emit("ready", {
                        model: fbx,
                        camera: camera,
                        scene: scene,
                        renderer: renderer,
                    });
                },
                null,
                (error) => console.error(error)
            );
        },
        findMaterial(mesh: THREE.Mesh, name: string) {
            return mesh.material.find((material: THREE.MeshPhongMaterial) => material.name == name);
        },
    },
    mounted() {
        new ResizeObserver(() => this.render(this.model)).observe(this.$el);
    },
});
</script>

<template>
    <div id="nav-car"></div>
</template>
