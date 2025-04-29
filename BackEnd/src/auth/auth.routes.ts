// routes/auth.routes.ts
import { Router } from 'express';
import { login } from '../auth/auth.controller.js';

export const authRoutes = Router();

authRoutes.post('/login', login);

;