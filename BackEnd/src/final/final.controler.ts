import {Request, Response, NextFunction} from 'express';
import { FinalRepository } from './final.repository.js';   
import { Final } from './final.entity.js';

const repository = new FinalRepository()

function InputS (req: Request, res: Response, next:NextFunction){
    req.body.InputS = {
        materia: req.body.materia,
        nota: req.body.nota,
        fecha: req.body.fecha
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
    const final = repository.findOne({id: req.params.id}); 
    if (!final) {
        return res.status(404).json({Error:"Final no encontrado"});
    }
    return res.status(200).json({Final_Solicitado:final});
}


function add (req:Request, res:Response) { 
    const input = req.body.InputS;
    const nuevoFinal = new Final(input.materia,input.nota,input.fecha);
    const final = repository.add(nuevoFinal);
    return res.status(201).json({Usuario_Creado:final});
}


function update(req:Request, res:Response) {
    req.body.InputS.id = req.params.id;
    const final = repository.update(req.body.InputS);

    if (!final) { 
        return res.status(404).json({Error:"Final no encontrado"});
    }
    return res.status(200).json({Final_Actualizado:final}); 
}

function remove(req:Request, res:Response){
    const final = repository.delete({id: req.params.id});
 
    if (!final) { 
        return res.status(404).json({Error:"Final no encontrado"}); 
    } 
    return res.status(200).json({Message: "Final eliminado"});
}

 


export{InputS,findAll,findOne,add,update,remove}