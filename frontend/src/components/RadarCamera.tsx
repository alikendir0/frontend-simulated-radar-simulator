import * as THREE from "three";

export const createRadarCamera = (aspect: number, ref?: React.MutableRefObject<THREE.PerspectiveCamera | null>): THREE.PerspectiveCamera => {
    const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);
    camera.position.set(0, 20, 0);
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 0, -1);
    if (ref) ref.current = camera;
    return camera;
};

