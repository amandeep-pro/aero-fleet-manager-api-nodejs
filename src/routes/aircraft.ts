import { Router } from "express";
import { getAircrafts, getAircraftById, createAircraft, updateAircraft, deleteAircraft } from "../controllers/aircraft";

const router = Router();

router.get("/aircrafts", getAircrafts);
router.get("/aircrafts/:id", getAircraftById);
router.post("/aircrafts", createAircraft);
router.put("/aircrafts/:id", updateAircraft);
router.delete("/aircrafts/:id", deleteAircraft);

export default router;
