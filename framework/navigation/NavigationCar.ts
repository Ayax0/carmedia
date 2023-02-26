import { Color, DirectionalLight, Group, Material, Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { Model } from "../models";

import FBXLoader from "@/utils/fbxloader";

export default class NavigationCar {
    private element: HTMLElement;
    private scene: Scene;
    private camera: PerspectiveCamera;
    private light: DirectionalLight;
    private renderer: WebGLRenderer;

    private model: Model;
    private car: Group;

    constructor(element: HTMLElement | string) {
        if (typeof element == "string") this.element = document.getElementById(element);
        else this.element = element;

        this.scene = new Scene();
        this.camera = new PerspectiveCamera(50, this.element.clientWidth / this.element.clientHeight, 1, 10000);
        this.light = new DirectionalLight(0xfffffb, 0.7);
        this.light.position.z = 2000;
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.element.clientWidth, this.element.clientHeight);

        this.scene.add(this.camera);
        this.scene.add(this.light);

        this.element.addEventListener("resize", () => {
            this.camera.aspect = this.element.clientWidth / this.element.clientHeight;
            this.renderer.setSize(this.element.clientWidth, this.element.clientHeight);
            this.render();
        });

        this.element.appendChild(this.renderer.domElement);
        this.render();
    }

    setModel(model: Model): Promise<any> {
        if (this.car) this.scene.remove(this.car);
        return this.addModel(model);
    }

    addModel(model: Model): Promise<any> {
        return new Promise((resolve, reject) => {
            const loader = new FBXLoader();
            loader.load(
                model.path,
                (fbx: Group) => {
                    this.model = model;
                    this.car = fbx;

                    // Filter Mesh
                    this.car.children = fbx.children.filter((children) => children instanceof Mesh);

                    // Set Model Colors
                    if (model.colorMapping.primary) this.setColor(model.colorMapping.primary, new Color(model.color.primary));
                    if (model.colorMapping.secondary) this.setColor(model.colorMapping.secondary, new Color(model.color.secondary));
                    if (model.colorMapping.head_light) {
                        this.setColor(model.colorMapping.head_light, new Color(model.color.head_light));
                        this.setEmissive(model.colorMapping.head_light, new Color(model.color.head_light));
                    }
                    if (model.colorMapping.back_light) {
                        this.setColor(model.colorMapping.back_light, new Color(model.color.back_light));
                        this.setEmissive(model.colorMapping.back_light, new Color(model.color.back_light));
                    }

                    // Set initial Offsets
                    this.car.position.x = model.offset?.x || 0;
                    this.car.position.y = model.offset?.y || 0;
                    this.car.position.z = model.offset?.z || 0;

                    // Set initial Rotations
                    this.car.rotation.x = this.degToRad(model.offset?.rotation_x || 0);
                    this.car.rotation.y = this.degToRad(model.offset?.rotation_y || 0);
                    this.car.rotation.z = this.degToRad(model.offset?.rotation_z || 0);

                    // Set initial Scale
                    this.car.scale.x = model.offset?.scale_x || 1;
                    this.car.scale.y = model.offset?.scale_y || 1;
                    this.car.scale.z = model.offset?.scale_z || 1;

                    this.scene.add(this.car);
                    this.render();
                    resolve(this.car);
                },
                null,
                (error) => reject(error)
            );
        });
    }

    setPosition(x: number, y: number, z: number) {
        if (!this.model || !this.car) throw new Error("no model loaded");
        this.camera.position.x = x;
        this.camera.position.y = y;
        this.camera.position.z = z;
        this.render();
    }

    setRotation(x: number, y: number, z: number) {
        if (!this.model || !this.car) throw new Error("no model loaded");
        this.car.rotation.x = this.degToRad((this.model.offset?.rotation_x || 0) + x);
        this.car.rotation.y = this.degToRad((this.model.offset?.rotation_y || 0) + y);
        this.car.rotation.z = this.degToRad((this.model.offset?.rotation_z || 0) + z);
        this.render();
    }

    setColor(mapping: string, color: string | Color) {
        if (!this.model || !this.car) throw new Error("no model loaded");
        this.car.children.forEach((mesh: Mesh) => {
            const material = this.findMaterial(mesh, mapping);
            material.color = typeof color == "string" ? new Color(color) : color;
            material.specular = typeof color == "string" ? new Color(color) : color;
        });
    }

    setEmissive(mapping: string, color: string | Color, intensity: number = 200) {
        if (!this.model || !this.car) throw new Error("no model loaded");
        this.car.children.forEach((mesh: Mesh) => {
            const material = this.findMaterial(mesh, mapping);
            material.emissive = typeof color == "string" ? new Color(color) : color;
            material.emissiveIntensity = intensity;
        });
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    setAnimationLoop(cb: (time: number, frame: XRFrame) => any) {
        this.renderer.setAnimationLoop((time: number, frame: XRFrame) => cb(time, frame));
    }

    private degToRad(deg: number): number {
        return (deg * Math.PI) / 180;
    }

    private findMaterial(mesh: Mesh, name: string): MeshPhongMaterial {
        if (!Array.isArray(mesh.material)) return;
        return mesh.material.find((material: Material) => material.name == name) as MeshPhongMaterial;
    }
}
