import { Router } from 'express';
import aircraftRoutes from './aircraft';
import airportRoutes from "./airport"
import missionRoutes from "./mission"

const router = Router();

// Register aircraft routes
router.use('/api', aircraftRoutes);
router.use('/api',airportRoutes)
router.use("/api",missionRoutes)

export default router;
