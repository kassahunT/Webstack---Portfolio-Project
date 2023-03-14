import express from 'express';
const router=express.Router();
import { addTrip, getTrip,  getTrips,trips_delete_trip } from "../controllers/trip.js";
import checkAuth from '../middleware/checkAuth.js';

router.get('/',checkAuth(["admin","user"]) ,getTrips);
router.post('/' ,checkAuth(["admin"]),addTrip);
router.get('/:tripId',checkAuth(["admin","user"]) ,getTrip);
router.delete('/:tripId' ,checkAuth(["admin"]),trips_delete_trip);
export default router;