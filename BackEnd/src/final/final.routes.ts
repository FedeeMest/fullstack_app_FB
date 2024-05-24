import {Router} from 'express';
import {InputS,findAll,findOne,add,update,remove} from './final.controler.js';

export const finalRouter = Router();

finalRouter.get("/",findAll);
finalRouter.get("/:id",findOne);
finalRouter.post("/",InputS,add);
finalRouter.put("/:id",InputS,update);
finalRouter.patch("/:id",InputS,update);
finalRouter.delete("/:id",remove);
