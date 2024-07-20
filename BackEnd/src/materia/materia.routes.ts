import {Router} from 'express';
import {inputS,findAll,findOne,add,update,remove} from './materia.controller.js';

export const materiaRouter = Router();

materiaRouter.get("/",findAll);
materiaRouter.get("/:id",findOne);
materiaRouter.post("/",inputS,add);
materiaRouter.put("/:id",inputS,update);
materiaRouter.patch("/:id",inputS,update);
materiaRouter.delete("/:id",remove);
