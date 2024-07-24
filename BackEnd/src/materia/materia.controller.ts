import {Request, Response, NextFunction} from 'express';
import { MateriaRepository } from './materia.repository.js';
import { Materia } from './materia.entity.js';

const repository = new MateriaRepository();
function inputS (req: Request, res: Response, next: NextFunction) {
    req.body.inputS = {
        nombre: req.body.nombre,
        horas_anuales: req.body.horas_anuales,
        modalidad: req.body.modalidad,
    }
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    })

    next();
}

function findAll(req: Request, res: Response) {
    res.status(200).json({Listado: repository.findAll()});
}

function findOne (req:Request, res:Response) {
    const materia = repository.findOne({id: req.params.id}); 
    if (!materia) {
        return res.status(404).json({Error:"Materia no encontrada"});
    }
    return res.status(200).json({Materia_Solicitado:materia});
}


function add (req:Request, res:Response) { 
    const input = req.body.inputS;
    const nuevoMateria = new Materia (input.nombre,input.horas_anuales,input.modalidad);
    const materia = repository.add(nuevoMateria);
    return res.status(201).json({Materia_Creada:materia});
}


function update(req:Request, res:Response) {
    req.body.inputS.id = req.params.id;
    const materia = repository.update(req.body.inputS);

    if (!materia) { 
        return res.status(404).json({Error:"Materia no encontrada"});
    }
    return res.status(200).json({Materia_Actualizado:materia}); 
}

function remove(req:Request, res:Response){
    const materia = repository.delete({id: req.params.id});
 
    if (!materia) { 
        return res.status(404).json({Error:"Materia no encontrada"}); 
    } 
    return res.status(200).json({Message: "Materia eliminada"});
}

export{inputS,findAll,findOne,add,update,remove}