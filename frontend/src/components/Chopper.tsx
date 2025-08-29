import * as THREE from "three";
import { loadGLTFModel } from "./utils/loadGLTFModel";

export const createChopper = async (radarMode:boolean): Promise<THREE.Object3D> => {
    const url = new URL("/models/chopper.glb", import.meta.url).href;
    const chopper = await loadGLTFModel(url);

    chopper.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            if (radarMode) {
            (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.9,
            });
        }}
    });

    chopper.scale.set(0.01, 0.01, 0.01);
    chopper.position.set(-5, 0.2, -5);
    chopper.name = "Chopper";

    return chopper;
};