import React from "react";
import { editAircraftTopSpeed } from './utils/api';


interface HitData {
    uuid: string;
    name: string;
    distance: number;
    speed: number;
    time: number;
    hitPoint: { x: number; y: number; z: number };
}

interface RadarHitsPanelProps {
    radarHits: Record<string, HitData>;
    onInspect: (partId: string) => void;
}

const handleTopSpeed= async (partId: string, newTopSpeed: number) =>{
    try{
        const data = await editAircraftTopSpeed(partId, newTopSpeed);
        console.log(data);
    }
    catch(error) {
        console.error('Error fetching aircraft info:', error);
    }
}

const RadarHitsPanel: React.FC<RadarHitsPanelProps> = ({ radarHits, onInspect }) => (
    <div style={{
        position: "absolute",
        top: 60,
        left: 20,
        color: "#00ff00",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: "5px 10px",
        borderRadius: "4px",
        fontFamily: "monospace",
        zIndex: 10
    }}>
        <div>Radar Hits:</div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {Object.keys(radarHits).length > 0 ? (
                Object.keys(radarHits).map((key) => {
                    const hit = radarHits[key];
                    const timeStr = new Date(hit.time).toLocaleTimeString();
                    return (
                        <li key={key} style={{ marginBottom: "10px" }}>
                            • {hit.name} ({hit.distance.toFixed(1)} units) at {timeStr} altitude {hit.hitPoint.y.toFixed(2)} speed {hit.speed} <br />
                            <button
                                style={{
                                    display: "inline-block",
                                    marginTop: "5px",
                                    padding: "4px 8px",
                                    fontSize: "0.8rem",
                                    backgroundColor: "black",
                                    color: "#00ff00",
                                    border: "1px solid #00ff00",
                                    borderRadius: "2px",
                                    cursor: "pointer",
                                    fontFamily: "monospace"
                                }}
                                onClick={() => onInspect(hit.name)}
                            >
                                Inspect
                            </button>
                            <button
                                style={{
                                    display: "inline-block",
                                    marginTop: "5px",
                                    padding: "4px 8px",
                                    fontSize: "0.8rem",
                                    backgroundColor: "black",
                                    color: "#00ff00",
                                    border: "1px solid #00ff00",
                                    borderRadius: "2px",
                                    cursor: "pointer",
                                    fontFamily: "monospace"
                                }}
                                onClick={() => handleTopSpeed(hit.name, hit.speed)}
                            >
                                Log Top Speed
                            </button>
                        </li>
                    );
                })
            ) : (
                <li>• None</li>
            )}
        </ul>
    </div>
);

export default RadarHitsPanel;


