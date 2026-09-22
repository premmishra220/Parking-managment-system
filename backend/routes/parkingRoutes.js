import express from 'express';
import { getBuildings, getSlotsForBuilding } from '../services/parkingService.js';

const router = express.Router();

router.get('/buildings', (request, response) => {
  response.json({ success: true, buildings: getBuildings() });
});

router.get('/slots/:building', async (request, response, next) => {
  try {
    const building = decodeURIComponent(request.params.building);
    const slots = await getSlotsForBuilding(building);
    response.json({ success: true, slots });
  } catch (error) {
    next(error);
  }
});

export default router;
