import * as THREE from "three";

// Define the RadarHit interface
export interface RadarHit {
  uuid: string;
  name: string;
  distance: number;
  time: number;
  hitPoint: THREE.Vector3;
}

export function performRadarRaycast({
  scene,
  radarGroupRotationY,
  targets,
  rayCount = 100,
  horizontalSpread = 0,
  verticalSpread = 1,
  radarOrigin = new THREE.Vector3(0, 0.2, 0),
  showRays = false,
  rayLinesGroup,
}: {
  scene: THREE.Scene;
  radarGroupRotationY: number;
  targets: THREE.Object3D[];
  rayCount?: number;
  horizontalSpread?: number;
  verticalSpread?: number;
  radarOrigin?: THREE.Vector3;
  showRays?: boolean;
  rayLinesGroup?: THREE.Group;
}): RadarHit[] {
  const raycaster = new THREE.Raycaster();
  const baseAngle = radarGroupRotationY + Math.PI / 2;
  const baseDirection = new THREE.Vector3(
    Math.sin(baseAngle),
    0,
    Math.cos(baseAngle)
  ).normalize();
  const now = Date.now();
  const hits: RadarHit[] = [];

  // Clear previous ray visualizations
  if (rayLinesGroup) {
    rayLinesGroup.clear();
  }

  // Loop through the rays based on the `rayCount`
  for (let i = 0; i < rayCount; i++) {
    // Calculate the horizontal offset for the ray
    const horizontalOffset = (i / (rayCount - 1) - 0.5) * horizontalSpread;

    // Calculate the vertical angle for the ray
    const t = i / (rayCount - 1);
    const verticalAngle = t * verticalSpread;

    // Clone the base direction to apply horizontal and vertical offsets
    const direction = baseDirection.clone();
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), horizontalOffset);

    // Determine the vertical axis and apply vertical angle
    const verticalAxis = new THREE.Vector3(
      -direction.z,
      0,
      direction.x
    ).normalize();
    direction.applyAxisAngle(verticalAxis, verticalAngle);
    direction.normalize();

    // Visualize rays if enabled
    if (showRays && rayLinesGroup) {
      const rayLength = 100;
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.3,
      });
      const points = [
        radarOrigin.clone(),
        radarOrigin.clone().add(direction.clone().multiplyScalar(rayLength)),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      rayLinesGroup.add(line);
    }

    // Perform raycast for the current direction
    raycaster.set(radarOrigin, direction);
    const intersections = raycaster.intersectObjects(targets, true);

    // Process the intersections (hits)
    intersections.forEach((intersect) => {
      const object = intersect.object;
      hits.push({
        uuid: object.uuid,
        name: object.name || object.parent?.name || "Unknown Object",
        distance: radarOrigin.distanceTo(intersect.point),
        time: now,
        hitPoint: intersect.point.clone(),
      });
    });
  }

  return hits;
}
