import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Popup from "./Popup.tsx";
import RadarHitsPanel from "./RadarHitsPanel.tsx";
import { createRadarBeam } from "./RadarBeam.tsx";
import { createRadarDish } from "./RadarDish.tsx";
import { createRadarPlane } from "./RadarPlane.tsx";
import { addRadarLights } from "./RadarLights.tsx";
import { createRadarCamera } from "./RadarCamera.tsx";
import { createChopper } from "./Chopper.tsx";
import { createCivilianAircraft } from "./CivilianAircraft.tsx";
import { createF16D } from "./F16D.tsx";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { performRadarRaycast } from "./utils/createRadarRaycast.ts";
import { fetchAircraftByPart } from "./utils/api.ts";
import {
  updateTargetSpeed,
  type TargetTracking,
} from "./utils/trackingUtils.ts";
import { loadSkybox } from "./utils/loadSkybox.ts";

const RadarScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRadarMode, setIsRadarMode] = useState(true);
  const [showRays, setShowRays] = useState(false);
  const showRaysRef = useRef(false);
  const radarGroup = useRef<THREE.Group>(new THREE.Group());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const civilianAircraftRef = useRef<THREE.Object3D | null>(null);
  const chopperRef = useRef<THREE.Object3D | null>(null);
  const f16dRef = useRef<THREE.Object3D | null>(null);
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rayLinesGroupRef = useRef<THREE.Group>(new THREE.Group());

  const [heightPercent] = useState(16);
  const radarHitsRef = useRef<Record<string, any>>({});
  const targetTrackingRef = useRef<Record<string, TargetTracking>>({});
  const [radarHits, setRadarHits] = useState<Record<string, any>>({});
  const [popupData, setPopupData] = useState<{
    image: string;
    name: string;
    class: string;
    type: string;
    recordedTopSpeed: number;
  } | null>(null);

  const handleInspect = async (partId: string) => {
    try {
      const data = await fetchAircraftByPart(partId);
      setPopupData(data);
    } catch (error) {
      console.error("Error fetching aircraft info:", error);
    }
  };

  const textureLoader = new THREE.TextureLoader();
  const grassTexture = textureLoader.load(
    new URL("/textures/grass_texture.jpg", import.meta.url).href
  );
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(32, 32);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = sceneRef.current;
    scene.background = new THREE.Color(0x000000);

    const camera = createRadarCamera(
      window.innerWidth / window.innerHeight,
      cameraRef
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 10;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    const radarAngularSpeed = 0.005; // radians per frame

    let previousTime = 0;
    const targetFPS = 30;
    const targetFrameTime = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      requestAnimationFrame(animate);
      radarGroup.current.rotation.y += radarAngularSpeed;

      const time = Date.now() * 0.0001;
      const civilianRadius = 40;
      if (civilianAircraftRef.current) {
        civilianAircraftRef.current.position.x =
          Math.cos(time) * civilianRadius;
        civilianAircraftRef.current.position.z =
          Math.sin(time) * civilianRadius;
        civilianAircraftRef.current.rotation.y = -time;
      }
      if (chopperRef.current) {
        const chopperDistance = 20;
        chopperRef.current.position.x = Math.sin(time) * chopperDistance;
        chopperRef.current.rotation.y =
          Math.sin(time) >= 0 ? (3 * Math.PI) / 2 : Math.PI / 2;
      }
      if (f16dRef.current) {
        const f16dRadius = 30;
        f16dRef.current.position.x = Math.cos(time * 0.7) * f16dRadius;
        f16dRef.current.position.z = Math.sin(time * 0.7) * f16dRadius;
        f16dRef.current.rotation.y = -time * 0.7;
      }

      const targets = [
        civilianAircraftRef.current,
        chopperRef.current,
        f16dRef.current,
      ].filter(Boolean) as THREE.Object3D[];

      const hitsNow = performRadarRaycast({
        scene,
        radarGroupRotationY: radarGroup.current.rotation.y,
        targets,
        showRays: showRaysRef.current,
        rayLinesGroup: rayLinesGroupRef.current,
      });

      const hitsBehind = performRadarRaycast({
        scene,
        radarGroupRotationY:
          radarGroup.current.rotation.y - THREE.MathUtils.degToRad(2),
        targets,
      });

      [...hitsNow, ...hitsBehind].forEach((hit) => {
        const previousTracking = targetTrackingRef.current[hit.uuid];

        const updatedTracking = updateTargetSpeed(
          previousTracking || {
            lastHitPoint: hit.hitPoint,
            lastTimestamp: Date.now(),
            speed: 0,
          },
          hit.hitPoint,
          radarAngularSpeed
        );

        targetTrackingRef.current[hit.uuid] = updatedTracking;

        radarHitsRef.current[hit.uuid] = {
          ...hit,
          speed: updatedTracking.speed,
        };
      });

      const FRESHNESS_MS = 20000;
      Object.keys(radarHitsRef.current).forEach((key) => {
        if (Date.now() - radarHitsRef.current[key].time > FRESHNESS_MS) {
          delete radarHitsRef.current[key];
        }
      });

      setRadarHits({ ...radarHitsRef.current });

      controls.update();

      const delta = currentTime - previousTime;
      if (delta < targetFrameTime) return;

      previousTime = currentTime;

      renderer.render(scene, camera);
    };
    animate(0);

    return () => {
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "s") {
        setIsRadarMode((prev) => !prev);
      }
      if (event.key.toLowerCase() === "t") {
        setShowRays((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync showRays state with ref for animation loop
  useEffect(() => {
    showRaysRef.current = showRays;
  }, [showRays]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    scene.clear();

    addRadarLights(scene, isRadarMode);

    scene.add(
      createRadarPlane(isRadarMode, isRadarMode ? undefined : grassTexture)
    );

    if (isRadarMode) {
      scene.background = new THREE.Color(0x000000);
      scene.add(new THREE.GridHelper(200, 256, 0xff3300, 0x001100));
    } else {
      scene.background = loadSkybox();
    }

    radarGroup.current = new THREE.Group();
    radarGroup.current.position.set(0, 0.1, 0);
    radarGroup.current.add(createRadarBeam(isRadarMode));

    createRadarDish(isRadarMode).then((dish) => {
      radarGroup.current.add(dish);
    });
    scene.add(radarGroup.current);

    // Add ray lines group to scene
    rayLinesGroupRef.current = new THREE.Group();
    scene.add(rayLinesGroupRef.current);

    createCivilianAircraft(isRadarMode).then((civilianAircraft) => {
      scene.add(civilianAircraft);
      civilianAircraftRef.current = civilianAircraft;
    });

    createChopper(isRadarMode).then((chopper) => {
      scene.add(chopper);
      chopperRef.current = chopper;
    });

    createF16D(isRadarMode).then((f16d) => {
      scene.add(f16d);
      f16dRef.current = f16d;
    });
  }, [isRadarMode]);

  return (
    <>
      <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "#00ff00",
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: "5px 10px",
          borderRadius: "4px",
          fontFamily: "monospace",
        }}
      >
        Camera Height: {heightPercent}%
      </div>
      <RadarHitsPanel radarHits={radarHits} onInspect={handleInspect} />
      {popupData && (
        <Popup data={popupData} onClose={() => setPopupData(null)} />
      )}
    </>
  );
};

export default RadarScene;
