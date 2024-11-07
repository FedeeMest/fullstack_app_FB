import {Router} from 'express';
import {inputS,findAll,findOne,add,update,remove} from './inscripcion.controller.js';

export const inscripcionRouter = Router();

inscripcionRouter.get("/",findAll);
inscripcionRouter.get("/:id",findOne);
inscripcionRouter.post("/",inputS,add);
inscripcionRouter.put("/:id",inputS,update);
inscripcionRouter.patch("/:id",inputS,update);
inscripcionRouter.delete("/:id",remove);
