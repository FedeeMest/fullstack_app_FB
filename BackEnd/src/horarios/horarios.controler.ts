import {Request, Response, NextFunction} from 'express';
import { HorarioRepository } from "./horario.repository.js"
import { Horario } from './horario.entity.js';

const repository = new HorarioRepository()

function InputS (req: Request, res: Response, next:NextFunction){
    req.body.InputS = {
        dia: req.body.dia,
        hora: req.body.hora,
        materia: req.body.materia
    }
    Object.keys(req.body.InputS).forEach((key) => {
        if (req.body.InputS[key] === undefined) delete req.body.InputS[key];
    })
    
    next(); 

}

function findAll (req:Request, res:Response){
    res.status(200).json({Lsitado: repository.findAll()}
    )
}

function findOne (req:Request, res:Response) {
    const horario = repository.findOne({id: req.params.id})
    if (!horario){
        return res.status(400).json({Error: "Horario no encontrado"})
    }
    return res.status(200).json({Horario_Solicitado: horario})
}

function add (req:Request, res:Response) { 
    const input = req.body.InputS;
    const nuevoHorario = new Horario(input.dia,input.hora,input.materia);
    const horario = repository.add(nuevoHorario);
    return res.status(201).json({Usuario_Creado:horario});
}

function update(req:Request, res:Response) {
    req.body.InputS.id = req.params.id;
    const horario = repository.update(req.body.InputS);

    if (!horario) { 
        return res.status(404).json({Error:"Horario no encontrado"});
    }
    return res.status(200).json({Horario_Actualizado:horario}); 
}

function remove(req:Request, res:Response){
    const horario = repository.delete({id: req.params.id});
 
    if (!horario) { 
        return res.status(404).json({Error:"Horario no encontrado"}); 
    } 
    return res.status(200).json({Message: "Horario eliminado"});
}

export{InputS,findAll,findOne,add,update,remove}