import { Router } from "express";
import { getAllAircraft, getAircraftByPart, getAircraftInfo, editAircraftTopSpeed } from "../controllers/AircraftController";

const router = Router();

router.get("/", getAllAircraft);
router.post("/by-part", getAircraftByPart);
router.post("/by-name", getAircraftInfo);
router.post("/update-top-speed", editAircraftTopSpeed)

export default router;