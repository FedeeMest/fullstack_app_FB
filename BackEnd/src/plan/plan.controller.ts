import {Request, Response, NextFunction} from 'express';
import {PlanRepository } from './plan.repository.js';   
import {Plan} from './plan.entity.js';

const repository = new PlanRepository()

function InputS (req: Request, res: Response, next:NextFunction){
    req.body.InputS = {
        materias: req.body.materias,
        nombre: req.body.nombre
    }
    Object.keys(req.body.InputS).forEach((key) => {
        if (req.body.InputS[key] === undefined) delete req.body.InputS[key];
    })
    
    next(); 
}
function findAll (req:Request, res:Response) {
    res.status(200).json({Listado: repository.findAll()});
}

function findOne (req:Request, res:Response) {
    const plan = repository.findOne({id: req.params.id}); 
    if (!plan) {
        return res.status(404).json({Error:"Plan no encontrado"});
    }
    return res.status(200).json({Plan_Solicitado:plan});
}


function add (req:Request, res:Response) { 
    const input = req.body.InputS;
    const nuevoPlan = new Plan(input.nombre,input.materias);
    const plan = repository.add(nuevoPlan);
    return res.status(201).json({Plan_Creado:plan});
}


function update(req:Request, res:Response) {
    req.body.InputS.id = req.params.id;
    const plan = repository.update(req.body.InputS);

    if (!plan) { 
        return res.status(404).json({Error:"Plan no encontrado"});
    }
    return res.status(200).json({Plan_Actualizado:plan}); 
}

function remove(req:Request, res:Response){
    const plan = repository.delete({id: req.params.id});
 
    if (!plan) { 
        return res.status(404).json({Error:"Plan no encontrado"}); 
    } 
    return res.status(200).json({Message: "Plan eliminado"});
}

export{InputS,findAll,findOne,add,update,remove}
