import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const loadGLTFModel = (path: string): Promise<THREE.Object3D> => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            path,
            (gltf) => resolve(gltf.scene),
            undefined,
            (err) => reject(err)
        );
    });
};
