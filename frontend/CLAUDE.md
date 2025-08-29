# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build` (runs TypeScript compilation then Vite build)
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## Architecture Overview

This is a React + TypeScript + Vite application that creates a 3D radar simulation using Three.js. The application simulates radar detection of aircraft with both visual and radar-only viewing modes.

### Core Components Structure

- **RadarScene.tsx**: Main component orchestrating the entire 3D scene, animation loop, and radar simulation
- **Component Architecture**: Each 3D object (radar dish, aircraft, lights, etc.) is created by dedicated factory functions in separate component files
- **Utils Directory**: Contains specialized utilities for radar physics, API communication, and 3D model loading

### Key Technical Patterns

#### Radar Simulation System
- **Raycasting Engine** (`createRadarRaycast.ts`): Performs volumetric raycasting with configurable ray count, horizontal/vertical spread
- **Target Tracking** (`trackingUtils.ts`): Calculates target speed based on position changes over time, compensating for radar rotation
- **Hit Detection**: Tracks radar hits with freshness timeout (20 seconds) and UUID-based object identification

#### 3D Scene Management
- **Dual Rendering Modes**: Toggle between radar view (black background, grid) and realistic view (skybox, textures) using 'S' key
- **Animation Loop**: 30 FPS target with radar rotation at 0.006 radians/frame
- **Object Movement**: Circular motion patterns for aircraft with different radii and speeds

#### API Integration
- **Backend Communication**: Axios-based API calls to Flask backend at `http://127.0.0.1:5000/api`
- **Aircraft Database**: Fetch aircraft details by part ID, update speed records

### Model Loading System
- **GLTF Models**: Chopper and civilian aircraft loaded asynchronously
- **OBJ Models**: Radar dish with texture mapping
- **Skybox**: Six-texture cube mapping for realistic background
- **Texture Handling**: Grass texture with repeat wrapping for ground plane

### State Management
- React useState/useRef for radar hits, popup data, and 3D object references
- Real-time hit tracking with automatic cleanup of stale detections
- Bi-directional data flow between radar detection and UI display

### Development Notes
- All 3D model assets are in `/public/models/`, textures in `/public/textures/`
- Component files export factory functions that return configured Three.js objects
- Radar origin fixed at (0, 0.2, 0) with configurable raycast parameters