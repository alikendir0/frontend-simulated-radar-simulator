import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import { Aircraft } from "../models/AircraftModel";

const filePath = path.join(__dirname, '../models/aircraftmodel.json');

export const getAllAircraft = (req: Request, res: Response) => {
    let aircraftList: Aircraft[];
    try {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        aircraftList = JSON.parse(fileData);
    } catch (error) {
        return res.status(500).json({ message: 'Error reading aircraft data from file' });
    }

    res.json(aircraftList);
};

export const getAircraftByPart = (req: Request, res: Response) => {
    const { partId } = req.body;

    if (!partId) {
        return res.status(400).json({ message: "Missing 'partId' in request body." });
    }

    let aircraftList: Aircraft[];
    try {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        aircraftList = JSON.parse(fileData);
    } catch (error) {
        return res.status(500).json({ message: 'Error reading aircraft data from file' });
    }

    const matchedAircraft = aircraftList.filter((aircraft) =>
        aircraft.parts.includes(partId)
    );

    if (matchedAircraft.length > 0) {
        const returnAircraft = {
            name: matchedAircraft[0].name,
            type: matchedAircraft[0].type,
            class: matchedAircraft[0].class,
            image: matchedAircraft[0].image,
            recordedTopSpeed: matchedAircraft[0].recordedTopSpeed
        };
        res.json(returnAircraft);
    } else {
        res.status(404).json({ message: "No aircraft uses this part." });
    }
};

export const getAircraftInfo = (req: Request, res: Response) => {
    const { name } = req.body;
    console.log(name)
    if (!name) {
        return res.status(400).json({ message: "Missing 'name' in request body." });
    }

    let aircraftList: Aircraft[];
    try {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        aircraftList = JSON.parse(fileData);
    } catch (error) {
        return res.status(500).json({ message: 'Error reading aircraft data from file' });
    }

    const matchedAircraft = aircraftList.filter((aircraft) =>
        aircraft.name.includes(name)
    );

    if (matchedAircraft.length > 0) {
        const returnAircraft = {
            name: matchedAircraft[0].name,
            type: matchedAircraft[0].type,
            class: matchedAircraft[0].class,
            image: matchedAircraft[0].image,
            recordedTopSpeed: matchedAircraft[0].recordedTopSpeed
        };
        res.json(returnAircraft);
    } else {
        res.status(404).json({ message: "No aircraft exists with the given name." });
    }
};

export const editAircraftTopSpeed = (req: Request, res: Response) => {
    const { partId, newTopSpeed } = req.body;

    if (!partId || !newTopSpeed) {
        return res.status(400).json({ message: "Missing 'partId' or 'newTopSpeed' in request body." });
    }

    let aircraftListData: Aircraft[];
    try {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        aircraftListData = JSON.parse(fileData);
    } catch (error) {
        return res.status(500).json({ message: 'Error reading aircraft data from file' });
    }

    const matchedAircraft = aircraftListData.filter((aircraft: Aircraft) =>
        aircraft.parts.includes(partId)
    );

    if (matchedAircraft.length === 0) {
        return res.status(404).json({ message: "No aircraft found with this partId." });
    }

    const aircraftToUpdate = matchedAircraft[0];

    if (aircraftToUpdate.recordedTopSpeed < newTopSpeed) {
        aircraftToUpdate.recordedTopSpeed = newTopSpeed;

        try {
            fs.writeFileSync(filePath, JSON.stringify(aircraftListData, null, 2), 'utf-8');
        } catch (error) {
            return res.status(500).json({ message: 'Error saving aircraft data to file' });
        }

        return res.status(200).json({
            message: 'Aircraft top speed updated successfully',
            aircraft: aircraftToUpdate
        });
    } else {
        return res.status(201).json({
            message: 'This speed is not greater than the top recorded speed!'
        });
    }
};
