import { Request, Response, NextFunction } from 'express';
import { Alumno } from './alumno.entity.js';
import { Inscripcion } from '../inscripcion/inscripcion.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

function sanitizeAlumnoInput(req: Request, res: Response, next: NextFunction) {
    const fechaSinHora = req.body.fechaN ? new Date(req.body.fechaN).toISOString().split('T')[0] : '';
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        plan: req.body.plan,
        mail: req.body.mail,
        direccion: req.body.direccion,
        fechaN: fechaSinHora,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });

    next();
}

async function findAll(req: Request, res: Response) {
    try {
        const alumnos = await em.find(Alumno, {});
        res.status(200).json(alumnos);
    } catch (error) {
        console.error('Error al obtener alumnos:', error);
        res.status(500).json({ Error: 'Error al obtener la lista de alumnos.' });
    }
}

async function findOne(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    try {
        const alumno = await em.findOneOrFail(Alumno, { id });
        res.status(200).json(alumno);
    } catch (error) {
        console.error('Error al buscar el alumno:', error);
        res.status(500).json({ Error: 'Error al buscar el alumno.' });
    }
}

async function findLegajo(req: Request, res: Response) {
    const legajo = parseInt(req.params.legajo, 10);
    if (isNaN(legajo)) {
        return res.status(400).json({ Error: 'Legajo inválido.' });
    }

    try {
        const alumno = await em.findOne(Alumno, { legajo });
        if (!alumno) {
            return res.status(404).json({ Error: 'Alumno no encontrado.' });
        }
        res.status(200).json(alumno);
    } catch (error) {
        console.error('Error al buscar alumno por legajo:', error);
        res.status(500).json({ Error: 'Error al buscar el alumno por legajo.' });
    }
}

async function findInscripcionesByAlumnoId(req: Request, res: Response) {
    const alumnoId = Number.parseInt(req.params.id);
    if (isNaN(alumnoId)) {
        return res.status(400).json({ Error: 'ID de alumno inválido.' });
    }

    try {
        const inscripciones = await em.find(Inscripcion, { alumno: { id: alumnoId } });
        res.status(200).json(inscripciones);
    } catch (error) {
        console.error('Error al obtener inscripciones:', error);
        res.status(500).json({ Error: 'Error al obtener las inscripciones.' });
    }
}

async function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput;
    try {
        const maxLegajo = await em.count(Alumno) + 1; // Simulando el siguiente legajo
        const nuevoAlumno = em.create(Alumno, { ...input, legajo: maxLegajo });
        await em.persistAndFlush(nuevoAlumno);
        res.status(201).json({ message: 'Alumno creado con éxito', data: nuevoAlumno });
    } catch (error) {
        console.error('Error al agregar alumno:', error);
        res.status(500).json({ Error: 'Error al agregar el alumno.' });
    }
}

async function update(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    try {
        const alumno = await em.findOneOrFail(Alumno, { id });
        em.assign(alumno, req.body.sanitizedInput);
        await em.flush();
        res.status(200).json({ message: 'Alumno actualizado con éxito', data: alumno });
    } catch (error) {
        console.error('Error al actualizar alumno:', error);
        res.status(500).json({ Error: 'Error al actualizar el alumno.' });
    }
}

async function remove(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    try {
        const alumno = await em.findOneOrFail(Alumno, { id });
        await em.removeAndFlush(alumno);
        res.status(200).json({ message: 'Alumno eliminado con éxito.' });
    } catch (error) {
        console.error('Error al eliminar alumno:', error);
        res.status(500).json({ Error: 'Error al eliminar el alumno.' });
    }
}

export { sanitizeAlumnoInput, findAll, findOne, add, update, remove, findInscripcionesByAlumnoId, findLegajo };







































































/* import {Request, Response, NextFunction} from 'express';
import { Alumno } from './alumno.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em

function inputS (req: Request, res: Response, next: NextFunction) {
    req.body.inputS = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        plan: req.body.plan,
        mail: req.body.mail,
        direccion: req.body.direccion,
        fechaN: req.body.fechaN,
    }
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    })

    next();
}

async function findAll(req: Request, res: Response) {
    try{
        const alumnos = await em.find(Alumno, {})
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json(alumnos);
    }catch (error:any){
    res.status(500).json({ mensaje: error.message });
    }
}

async function findOne (req:Request, res:Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const alumno = await em.findOneOrFail(Alumno,{ id })
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({ mensaje: 'alumno encontrado', data: alumno});
    } catch (error:any){
        res.status(500).json({ mensaje: error.message })
    }
}

async function add (req:Request, res:Response) { 
    try{
        const alumno = em.create(Alumno, req.body.inputS)
        await em.flush()
        res.header('Access-Control-Allow-Origin', '*');
        res.status(201).json({ mensaje: 'Alumno creado', data: alumno});
    } catch (error:any){
        res.status(500).json({ mensaje: error.message });
    }
}

async function update(req:Request, res:Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const alumnoToUpdate = await em.findOneOrFail(Alumno, { id })
        em.assign(alumnoToUpdate, req.body.inputS)
        await em.flush()
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({ mensaje: 'Alumno actualizado', data: alumnoToUpdate});
    } catch (error:any){
        res.status(500).json({ mensaje: error.message });
    }
}

async function remove(req:Request, res:Response){
    try{
        const id = Number.parseInt(req.params.id)
        const alumno = em.getReference(Alumno, id)
        await em.removeAndFlush(alumno)
    } catch (error:any){
        res.status(500).json({ mensaje: error.message });
    }
}

export{inputS,findAll,findOne,add,update,remove} */