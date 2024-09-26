import {Request, Response, NextFunction} from 'express';
import { AlumnoRepository } from './alumno.repository.js';
import { Alumno } from './alumno.entity.js';

const repository = new AlumnoRepository();
function inputS (req: Request, res: Response, next: NextFunction) {
    const fechaSinHora = req.body.fechaN ? new Date(req.body.fechaN).toISOString().split('T')[0] : '';
    req.body.inputS = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        plan: req.body.plan,
        mail: req.body.mail,
        direccion: req.body.direccion,
        fechaN: fechaSinHora
    }
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    })

    next();
}

async function findAll(req: Request, res: Response) {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json(await repository.findAll());
}

async function findOne (req:Request, res:Response) {
    const id = req.params.id
    const alumno = await repository.findOne({ id })
    if (!alumno) {
        return res.status(404).json({Error:"Alumno no encontrado"});
    }
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(200).json(alumno);
}


async function add (req:Request, res:Response) { 
    const input = req.body.inputS;
    const nuevoAlumno = new Alumno (input.nombre,input.apellido,input.plan,input.mail,input.direccion,input.fechaN);
    const alumno = await repository.add(nuevoAlumno);
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(201).json({message: 'Character created', data:alumno});
}


async function update(req:Request, res:Response) {
    const alumno = await repository.update(req.params.id, req.body.inputS)

    if (!alumno) { 
        return res.status(404).json({Error:"Alumno no encontrado"});
    }
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(200).json({message: 'Alumno Actualizado con exito', data:alumno}); 
}

async function remove(req:Request, res:Response){
    const id = req.params.id
    const alumno = await repository.delete({ id })
 
    if (!alumno) { 
        return res.status(404).json({Error:"Alumno no encontrado"}); 
    } 
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(200).json({Message: "Alumno eliminado"});
}

export{inputS,findAll,findOne,add,update,remove}