import {Router} from 'express';
import {inputS,findAll,findOne,add,update,remove} from './admin.controller.js';
import { verifyRole } from '../Middleware/authMiddleware.js';


export const adminRouter = Router();

adminRouter.get("/",verifyRole(['admin']),findAll);
adminRouter.get("/:id",verifyRole(['admin']),findOne);
adminRouter.post("/",verifyRole(['admin']),inputS,add);
adminRouter.put("/:id",verifyRole(['admin']),inputS,update);
adminRouter.patch("/:id",verifyRole(['admin']),inputS,update);
adminRouter.delete("/:id",verifyRole(['admin']),remove);
