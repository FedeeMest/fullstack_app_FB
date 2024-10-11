import {Router} from 'express';
import {inputS,findAll,findOne,add,update,remove, findLegajo} from './alumno.controller.js';

export const alumnoRouter = Router();

alumnoRouter.get("/",findAll);
alumnoRouter.get("/:id",findOne);
alumnoRouter.get("/legajo/:legajo", findLegajo);
alumnoRouter.post("/",inputS,add);
alumnoRouter.put("/:id",inputS,update);
alumnoRouter.patch("/:id",inputS,update);
alumnoRouter.delete("/:id",remove);
