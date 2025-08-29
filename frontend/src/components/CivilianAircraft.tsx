import * as THREE from "three";
import { loadGLTFModel } from "./utils/loadGLTFModel";

export const createCivilianAircraft = async (radarMode:boolean): Promise<THREE.Object3D> => {
    const url = new URL("/models/civilian_aircraft.glb", import.meta.url).href;
    const civilianAircraft = await loadGLTFModel(url);

    civilianAircraft.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            if (radarMode) {
                (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
                    color: 0x00ff00,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.9,
                });
            }
        }
    });

    civilianAircraft.scale.set(10, 10, 10);
    civilianAircraft.position.set(10, 30, 3);
    civilianAircraft.name = "Civilian Aircraft";

    return civilianAircraft;
};