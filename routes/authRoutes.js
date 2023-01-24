import express from "express"
const router = express.Router()
import authenticateUser from '../middleware/auth.js';

import { register, login, updateUser } from "../controllers/authController.js"


router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/register").post(register)
router.route("/login").post(login)


export default router