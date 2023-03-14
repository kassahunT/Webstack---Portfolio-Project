import express from 'express';
const router=express.Router();
import {deleteUser, registerUser,signinUser,signoutUser} from "../controllers/user.js";
import checkAuth from '../middleware/checkAuth.js';


router.post('/signup',registerUser);
router.post('/login' ,signinUser);
router.post('/logout',checkAuth(["admin","user"]),signoutUser);
router.delete('/:userId',checkAuth(["admin"]) ,deleteUser);
export default router;