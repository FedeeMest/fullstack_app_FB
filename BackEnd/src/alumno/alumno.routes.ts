import { Router } from 'express';
import { inputS, findAll, findOne, add, update, remove, findLegajo, findInscripcionesByAlumnoId, changePassword } from './alumno.controller.js';
import { verifyRole } from '../Middleware/authMiddleware.js';

export const alumnoRouter = Router();

alumnoRouter.get("/", verifyRole(['admin', 'alumno']), findAll);
alumnoRouter.get("/:id", verifyRole(['admin', 'alumno']), findOne);
alumnoRouter.get("/legajo/:legajo", verifyRole(['admin', 'alumno']), findLegajo);
alumnoRouter.get('/:id/inscripciones', verifyRole(['admin', 'alumno']), findInscripcionesByAlumnoId);
alumnoRouter.post("/", verifyRole(['admin']), inputS, add);
alumnoRouter.put("/:id", verifyRole(['admin']), inputS, update);
alumnoRouter.patch("/:id", verifyRole(['admin']), inputS, update);
alumnoRouter.delete("/:id", verifyRole(['admin']), remove);
alumnoRouter.put('/:id/change-password', verifyRole(['admin','alumno']), changePassword);