# Radar Simulation (React + Three.js + Express)

Full-stack demo that renders a rotating radar with 3D targets and raycast detection in order to simulate real world Radar Cross Section (RCS) logic. Frontend is React + Vite + Three.js; backend is Express + TypeScript serving an aircraft database and static image assets.

- Frontend: [frontend/](frontend)
- Backend: [backend/](backend)

## Features

- Rotating radar with volumetric raycasting: [`performRadarRaycast`](frontend/src/components/utils/createRadarRaycast.ts)
- Real-time target motion and speed estimation: [`updateTargetSpeed`](frontend/src/components/utils/trackingUtils.ts)
- Dual modes: radar (wireframe/grid) and realistic (skybox/ground texture)
- Aircraft info popup and top speed logging via API
- Static image serving from backend

## Project Structure

```
backend/
  src/
    app.ts
    server.ts
    controllers/
      AircraftController.ts
    models/
      AircraftModel.ts
      aircraftmodel.json
    routes/
      AircraftRoutes.ts
    images/
      icons/
frontend/
  index.html
  vite.config.ts
  src/
    index.tsx
    components/
      RadarScene.tsx
      RadarBeam.tsx
      RadarCamera.tsx
      RadarDish.tsx
      RadarLights.tsx
      RadarPlane.tsx
      RadarHitsPanel.tsx
      Popup.tsx
      Chopper.tsx
      CivilianAircraft.tsx
      F16D.tsx
      utils/
        createRadarRaycast.ts
        trackingUtils.ts
        loadGLTFModel.ts
        loadOBJModel.ts
        loadSkybox.ts
```

Key files:
- Scene and loop: [frontend/src/components/RadarScene.tsx](frontend/src/components/RadarScene.tsx)
- Raycasting: [frontend/src/components/utils/createRadarRaycast.ts](frontend/src/components/utils/createRadarRaycast.ts)
- Speed tracking: [frontend/src/components/utils/trackingUtils.ts](frontend/src/components/utils/trackingUtils.ts)
- API client: [frontend/src/components/utils/api.ts](frontend/src/components/utils/api.ts)
- Backend routes: [backend/src/routes/AircraftRoutes.ts](backend/src/routes/AircraftRoutes.ts)
- Backend controller: [backend/src/controllers/AircraftController.ts](backend/src/controllers/AircraftController.ts)
- Data model: [backend/src/models/AircraftModel.ts](backend/src/models/AircraftModel.ts)
- Data store: [backend/src/models/aircraftmodel.json](backend/src/models/aircraftmodel.json)

## Prerequisites

- Node.js

## Setup

1) Backend
- cd backend
- npm install
- npm run dev
- Server: http://127.0.0.1:5000

2) Frontend
- cd frontend
- npm install
- npm run dev
- App: http://localhost:5173

## Controls

- S: Toggle radar mode vs realistic mode
- T: Toggle raycast visualization
- UI buttons (left panel):
  - Inspect: Calls backend to fetch aircraft by detected part ID
  - Log Top Speed: Sends current measured speed to backend to update record

UI is rendered by [frontend/src/components/RadarHitsPanel.tsx](frontend/src/components/RadarHitsPanel.tsx) and [frontend/src/components/Popup.tsx](frontend/src/components/Popup.tsx).

## Assets

Place assets in frontend/public:
- Models
  - /models/dish.obj
  - /models/chopper.glb
  - /models/civilian_aircraft.glb
  - /models/f-16d.gltf
- Textures
  - /textures/grass_texture.jpg
- Skybox
  - /skybox/xpos.png, xneg.png, ypos.png, yneg.png, zpos.png, zneg.png

Loaders:
- GLTF: [`loadGLTFModel`](frontend/src/components/utils/loadGLTFModel.ts)
- OBJ: [`loadOBJModel`](frontend/src/components/utils/loadOBJModel.ts)
- Skybox: [`loadSkybox`](frontend/src/components/utils/loadSkybox.ts)

Backend serves aircraft icons from:
- Static path: /images/icons
- Folder: [backend/src/images/icons](backend/src/images/icons)

## API

Base URL: http://127.0.0.1:5000/api/aircraft

- GET /  
  Returns all aircraft.
- POST /by-part  
  Body: { "partId": string }  
  Finds aircraft that include this part in `parts`.
- POST /by-name  
  Body: { "name": string }  
  Finds aircraft by name substring.
- POST /update-top-speed  
  Body: { "partId": string, "newTopSpeed": number }  
  Updates top speed if greater than recorded.

Controller: [`AircraftController`](backend/src/controllers/AircraftController.ts)  
Routes: [backend/src/routes/AircraftRoutes.ts](backend/src/routes/AircraftRoutes.ts)  
Data file: [aircraftmodel.json](backend/src/models/aircraftmodel.json)

## Radar and Motion

- Radar rotation speed: 0.005 rad/frame in [`RadarScene`](frontend/src/components/RadarScene.tsx)
- Ray origin: (0, 0.2, 0)
- Detection and hit list freshness: 20s timeout
- Targets and motion:
  - Civilian aircraft: circular path
  - Chopper: lateral motion
  - F-16D: circular path with different radius

Core functions:
- [`performRadarRaycast`](frontend/src/components/utils/createRadarRaycast.ts): casts rays against targets and returns hits
- [`updateTargetSpeed`](frontend/src/components/utils/trackingUtils.ts): estimates speed accounting for radar sweep

## Scripts

Backend ([backend/package.json](backend/package.json)):
- npm run dev: start server with ts-node + nodemon

Frontend ([frontend/package.json](frontend/package.json)):
- npm run dev: Vite dev server
