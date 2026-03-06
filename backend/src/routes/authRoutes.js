import { Router } from 'express';
import { loginController, signupController } from '../controllers/authController.js';

const authRoutes = Router();

authRoutes.post('/signup', signupController);
authRoutes.post('/login', loginController);

export default authRoutes;
