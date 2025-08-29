import * as THREE from "three";
import { loadGLTFModel } from "./utils/loadGLTFModel";

export const createF16D = async (
  radarMode: boolean
): Promise<THREE.Object3D> => {
  const url = new URL("/models/f-16d.gltf", import.meta.url).href;
  const f16d = await loadGLTFModel(url);

  f16d.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      if (radarMode) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          wireframe: true,
          transparent: true,
          opacity: 0.9,
        });
      }
    }
  });

  f16d.scale.set(0.2, 0.2, 0.2);
  f16d.position.set(-15, 25, -10);
  f16d.name = "F-16D Fighter";

  return f16d;
};
