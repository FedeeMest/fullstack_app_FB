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
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json({Listado: await repository.findAll()});
}


async function findOne (req:Request, res:Response) {
    const id = req.params.id
    const inscripcion = await repository.findOne({ id }) 
    if (!inscripcion) {
        return res.status(404).json({Error:"Inscripcion no encontrada"});
    }
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(200).json({Inscripcion_Solicitado:inscripcion});
}


async function add(req: Request, res: Response) { 
    const { alumno_id, materia_id, fecha } = req.body; // Asegúrate de que estás usando los nombres correctos

    // Verifica que el alumno y la materia existan solo por sus IDs
    const alumno = await alumnosRepository.findOne({ id: alumno_id });
    const materia = await materiasRepository.findOne({ id: materia_id });

    if (!alumno || !materia) {
        return res.status(404).json({ error: "Alumno o Materia no encontrada" });
    }

    // Crear una nueva inscripción utilizando solo los IDs
    const nuevaInscripcion = new Inscripcion(alumno_id, materia_id, fecha); // Usa los IDs aquí

    try {
        const inscripcion = await repository.add(nuevaInscripcion);
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(201).json({ Inscripcion_Creada: inscripcion });
    } catch (error) {
        console.error('Error al crear la inscripción:', error);
        return res.status(500).json({ error: 'Error al crear la inscripción' });
    }
}



async function update(req:Request, res:Response) {
    const inscripcion = await repository.update(req.params.id, req.body.inputS);

    if (!inscripcion) { 
        return res.status(404).json({Error:"Inscripcion no encontrada"});
    }
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(200).json({Inscripcion_Actualizado:inscripcion}); 
}


async function remove(req:Request, res:Response){
    const id = req.params.id
    const inscripcion = await repository.delete({ id })
 
    if (!inscripcion) { 
        return res.status(404).json({Error:"Inscripcion no encontrada"}); 
    } 
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(200).json({Message: "Inscripcion eliminada"});
}

export{inputS,findAll,findOne,add,update,remove}