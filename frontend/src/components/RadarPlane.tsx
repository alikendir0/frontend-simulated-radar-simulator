import * as THREE from "three";

export const createRadarPlane = (radarMode: boolean = true, grassTexture?: THREE.Texture): THREE.Mesh => {
    const material = radarMode
        ? new THREE.MeshBasicMaterial({ color: 0x002200, side: THREE.DoubleSide })
        : new THREE.MeshStandardMaterial({
            map: grassTexture ?? null,
            side: THREE.DoubleSide,
            metalness: 0.2,
            roughness: 0.8,
        });

    const radarPlane = new THREE.Mesh(
        new THREE.CircleGeometry(100, 64),
        material
    );
    radarPlane.rotation.x = -Math.PI / 2;
    return radarPlane;
};