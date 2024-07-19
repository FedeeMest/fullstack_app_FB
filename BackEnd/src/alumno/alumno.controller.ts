import {Request, Response, NextFunction} from 'express';
import { AlumnoRepository } from './alumno.repository.js';
import { Alumno } from './alumno.entity.js';

const repository = new AlumnoRepository();
function inputS (req: Request, res: Response, next: NextFunction) {
    req.body.InputS = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        plan: req.body.plan,
        mail: req.body.email,
        direccion: req.body.direccion,
        fechaN: req.body.fechaN,
    }
    Object.keys(req.body.InputS).forEach((key) => {
        if (req.body.InputS[key] === undefined) delete req.body.InputS[key];
    })

    next();
}

function findAll(req: Request, res: Response) {
    res.status(200).json({Listado: repository.findAll()});
}

function findOne (req:Request, res:Response) {
    const alumno = repository.findOne({id: req.params.id}); 
    if (!alumno) {
        return res.status(404).json({Error:"Alumno no encontrado"});
    }
    return res.status(200).json({Alumno_Solicitado:alumno});
}


function add (req:Request, res:Response) { 
    const input = req.body.inputS;
    const nuevoAlumno = new Alumno (input.nombre,input.apellido,input.plan,input.mail,input.direccion,input.fechaN);
    const alumno = repository.add(nuevoAlumno);
    return res.status(201).json({Alumno_Creado:alumno});
}


function update(req:Request, res:Response) {
    req.body.inputS.id = req.params.id;
    const alumno = repository.update(req.body.inputS);

    if (!alumno) { 
        return res.status(404).json({Error:"Alumno no encontrado"});
    }
    return res.status(200).json({Alumno_Actualizado:alumno}); 
}

function remove(req:Request, res:Response){
    const alumno = repository.delete({id: req.params.id});
 
    if (!alumno) { 
        return res.status(404).json({Error:"Alumno no encontrado"}); 
    } 
    return res.status(200).json({Message: "Alumno eliminado"});
}

export{inputS,findAll,findOne,add,update,remove}