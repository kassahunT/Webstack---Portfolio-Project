import express from 'express'
const router=express.Router();
import { addBus,  getBuses,getBusById, getBusBookedById ,deleteBus } from "../controllers/bus.js";
import checkAuth from '../middleware/checkAuth.js';

router.get('/',checkAuth(["admin","user"]) ,getBuses);
router.post('/',checkAuth(["admin"]) ,addBus);
router.get('/:busId',checkAuth(["admin","user"]) ,getBusById);
router.get('/reservedAndAvailable/:busId',checkAuth(["admin"]) ,getBusBookedById);

router.delete('/:busId',checkAuth(["admin"]) ,deleteBus);

export default router;

