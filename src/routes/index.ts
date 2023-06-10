import { Router } from 'express';
import aircraftRoutes from './aircraft';
import airportRoutes from "./airport"

const router = Router();

// Register aircraft routes
router.use('/api', aircraftRoutes);
router.use('/api',airportRoutes)

export default router;
