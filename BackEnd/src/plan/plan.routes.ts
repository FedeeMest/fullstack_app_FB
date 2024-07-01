import { Router} from "express";
import {InputS,findAll,findOne,add,update,remove} from './plan.controller.js';

export const planRouter = Router();

planRouter.get("/",findAll);
planRouter.get("/:id",findOne);
planRouter.post("/",InputS,add);
planRouter.put("/:id",InputS,update);
planRouter.patch("/:id",InputS,update);
planRouter.delete("/:id",remove);
 