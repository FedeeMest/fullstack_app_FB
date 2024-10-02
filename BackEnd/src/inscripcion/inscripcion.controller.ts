import {Request, Response, NextFunction} from 'express';
import { InscripcionRepository } from './inscripcion.repository.js';
import { Inscripcion } from './inscripcion.entity.js';
import { AlumnoRepository } from '../alumno/alumno.repository.js';
import { MateriaRepository } from '../materia/materia.repository.js';


const alumnosRepository = new AlumnoRepository();
const materiasRepository = new MateriaRepository();

const repository = new InscripcionRepository();
function inputS (req: Request, res: Response, next: NextFunction) {
    req.body.inputS = {
        alumno: req.body.alumno,
        materia: req.body.materia,
        fecha: req.body.fecha,
    }
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    })

    next();
}


async function findAll(req: Request, res: Response) {
    res.status(200).json({Listado: await repository.findAll()});
}


async function findOne (req:Request, res:Response) {
    const id = req.params.id
    const inscripcion = await repository.findOne({ id }) 
    if (!inscripcion) {
        return res.status(404).json({Error:"Inscripcion no encontrada"});
    }
    return res.status(200).json({Inscripcion_Solicitado:inscripcion});
}


async function add (req:Request, res:Response) { 
    const input = req.body.inputS;
    const alumno =  await alumnosRepository.findOne({id:input.alumno.id})
    const materia =  await materiasRepository.findOne({id:input.materia.id})
    if (!alumno || !materia) {
        return res.status(404).json({Error:"Alumno o Materia no encontrada"})};
        
    const nuevoInscripcion = new Inscripcion (alumno,materia,input.fecha);
    const inscripcion = await repository.add(nuevoInscripcion);
    return res.status(201).json({Inscripcion_Creada:inscripcion});
}


async function update(req:Request, res:Response) {
    const inscripcion = await repository.update(req.params.id, req.body.inputS);

    if (!inscripcion) { 
        return res.status(404).json({Error:"Inscripcion no encontrada"});
    }
    return res.status(200).json({Inscripcion_Actualizado:inscripcion}); 
}


async function remove(req:Request, res:Response){
    const id = req.params.id
    const inscripcion = await repository.delete({ id })
 
    if (!inscripcion) { 
        return res.status(404).json({Error:"Inscripcion no encontrada"}); 
    } 
    return res.status(200).json({Message: "Inscripcion eliminada"});
}

export{inputS,findAll,findOne,add,update,remove}