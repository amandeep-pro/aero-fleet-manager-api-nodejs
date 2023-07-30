import { Router } from "express";
import { createMission, getMissions, getMissionById, updateMission, deleteMission } from "../controllers/mission";

const router = Router();

// Routes for Mission CRUD operations
router.post("/missions", createMission);
router.get("/missions", getMissions);
router.get("/missions/:id", getMissionById);
router.put("/missions/:id", updateMission);
router.delete("/missions/:id", deleteMission);

export default router;
