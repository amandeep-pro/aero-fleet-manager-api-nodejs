import { Router } from 'express';
import { 
  getAirports, 
  getAirportById, 
  createAirport, 
  updateAirport, 
  deleteAirport 
} from '../controllers/airport';

const router = Router();

router.get('/airports', getAirports);
router.get('/airports/:id', getAirportById);
router.post('/airports', createAirport);
router.put('/airports/:id', updateAirport);
router.delete('/airports/:id', deleteAirport);

export default router;
