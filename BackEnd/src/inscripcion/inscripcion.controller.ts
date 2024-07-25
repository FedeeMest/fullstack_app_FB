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

function findAll(req: Request, res: Response) {
    res.status(200).json({Listado: repository.findAll()});
}

function findOne (req:Request, res:Response) {
    const inscripcion = repository.findOne({id: req.params.id}); 
    if (!inscripcion) {
        return res.status(404).json({Error:"Inscripcion no encontrada"});
    }
    return res.status(200).json({Inscripcion_Solicitado:inscripcion});
}


function add (req:Request, res:Response) { 
    const input = req.body.inputS;
    const alumno = alumnosRepository.findOne({id:input.alumno.id})
    const materia = materiasRepository.findOne({id:input.materia.id})
    if (!alumno || !materia) {
        return res.status(404).json({Error:"Alumno o Materia no encontrada"})};
    const nuevoInscripcion = new Inscripcion (alumno,materia,input.fecha);
    const inscripcion = repository.add(nuevoInscripcion);
    return res.status(201).json({Inscripcion_Creada:inscripcion});
}


function update(req:Request, res:Response) {
    req.body.inputS.id = req.params.id;
    const inscripcion = repository.update(req.body.inputS);

    if (!inscripcion) { 
        return res.status(404).json({Error:"Inscripcion no encontrada"});
    }
    return res.status(200).json({Inscripcion_Actualizado:inscripcion}); 
}

function remove(req:Request, res:Response){
    const inscripcion = repository.delete({id: req.params.id});
 
    if (!inscripcion) { 
        return res.status(404).json({Error:"Inscripcion no encontrada"}); 
    } 
    return res.status(200).json({Message: "Inscripcion eliminada"});
}

export{inputS,findAll,findOne,add,update,remove}