import {Router} from 'express';
import {inputS,findAll,findOne,add,update,remove} from './inscripcion.controller.js';
import { verifyRole } from '../Middleware/authMiddleware.js';

export const inscripcionRouter = Router();

inscripcionRouter.get("/", verifyRole(['admin', 'alumno']), findAll);
inscripcionRouter.get("/:id", verifyRole(['admin', 'alumno']), findOne);
inscripcionRouter.post("/", verifyRole(['admin', 'alumno']), inputS, add);
inscripcionRouter.put("/:id", verifyRole(['admin']), inputS, update);
inscripcionRouter.patch("/:id", verifyRole(['admin']), inputS, update);
inscripcionRouter.delete("/:id", verifyRole(['admin']), remove);

