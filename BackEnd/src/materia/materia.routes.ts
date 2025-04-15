import {Router} from 'express';
import {inputS,findAll,findOne,add,update,remove} from './materia.controller.js';
import { verifyRole } from '../Middleware/authMiddleware.js';

export const materiaRouter = Router();

materiaRouter.get("/",verifyRole(['admin', 'alumno']),findAll);
materiaRouter.get("/:id",verifyRole(['admin', 'alumno']),findOne);
materiaRouter.post("/",verifyRole(['admin']),inputS,add);
materiaRouter.put("/:id",verifyRole(['admin']),inputS,update);
materiaRouter.patch("/:id",verifyRole(['admin']),inputS,update);
materiaRouter.delete("/:id",verifyRole(['admin']),remove);
