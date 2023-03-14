import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import {bookings_get_all,bookings_create_booking,bookings_get_booking,bookings_delete_booking} from '../controllers/booking.js'
const router=express.Router();


router.get('/' ,checkAuth(["admin"]),bookings_get_all);
router.post('/' ,checkAuth(["admin","user"]),bookings_create_booking);
router.get('/:bookingId' ,checkAuth(["admin","user"]),bookings_get_booking);
router.delete('/:bookingId' ,checkAuth(["admin","user"]),bookings_delete_booking);
export default router;