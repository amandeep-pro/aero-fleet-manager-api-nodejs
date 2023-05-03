import { Router } from 'express';
import aircraftRoutes from './aircraft';

const router = Router();

// Register aircraft routes
router.use('/api', aircraftRoutes);

export default router;
