import {Router} from 'express';
import {inputS,findAll,findOne,add,update,remove} from './admin.controller.js';

export const adminRouter = Router();

adminRouter.get("/",findAll);
adminRouter.get("/:id",findOne);
adminRouter.post("/",inputS,add);
adminRouter.put("/:id",inputS,update);
adminRouter.patch("/:id",inputS,update);
adminRouter.delete("/:id",remove);
