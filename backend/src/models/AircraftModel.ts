export enum AircraftType {
    Civilian = "Civilian",
    Police = "Police",
    Military = "Military",
    International = "International",
    Unknown = "Unknown",
}

export enum AircraftClass {
    Helicopter = "Helicopter",
    Plane = "Plane",
    Drone = "Drone",
    UAV = "UAV",
    Unknown = "Unknown",
}

export interface Aircraft {
    id: string;
    type: AircraftType;
    class: AircraftClass;
    name: string;
    parts: string[];
    image: string;
    recordedTopSpeed: number;
}