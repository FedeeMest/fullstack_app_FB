import {Router} from 'express';
import {InputS,findAll,findOne,add,update,remove} from './horarios.controler.js';

export const horarioRouter = Router();

horarioRouter.get("/",findAll);
horarioRouter.get("/:id",findOne);
horarioRouter.post("/",InputS,add);
horarioRouter.put("/:id",InputS,update);
horarioRouter.patch("/:id",InputS,update);
horarioRouter.delete("/:id",remove);
