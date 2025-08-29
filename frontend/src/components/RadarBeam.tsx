import * as THREE from "three";

export const createRadarBeam = (radarMode: boolean): THREE.Mesh => {
    const beamLength = -100;
    const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, beamLength, 32);
    beamGeometry.translate(0, beamLength / 2, 0);

    const beamMaterial = radarMode
        ? new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        : new THREE.MeshStandardMaterial({ visible: false });

    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.rotation.z = Math.PI / 2;

    beam.visible = radarMode; // Beam disappears in normal mode
    return beam;
};
