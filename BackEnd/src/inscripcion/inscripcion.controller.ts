import {Request, Response, NextFunction} from 'express';
import { Inscripcion } from './inscripcion.entity.js';
import { orm } from '../shared/db/orm.js';
import { Alumno } from '../alumno/alumno.entity.js';
import { Materia } from '../materia/materia.entity.js';

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
    const em = orm.em.fork();
    try{
        const inscripciones = await em.find(Inscripcion, {})
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json(inscripciones);
    }catch (error:any){
        console.error('Error al obtener inscripciones:', error);
        return res.status(500).json({ mensaje: error.message });
    }
}

async function findOne (req:Request, res:Response) {
    const em = orm.em.fork();
    const id = parseInt(req.params.id)
    try{
        const inscripcion = await em.findOneOrFail(Inscripcion,{ id })
        if (!inscripcion){
            return res.status(404).json({ mensaje: 'Inscripcion no encontrada' });
        }
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json(inscripcion);
    } catch (error){
        console.error('Error al buscar el alumno:', error);
        return res.status(500).json({ Error: 'Error al buscar la inscripcion.' });
    }
}

async function add(req: Request, res: Response) { 
    const em = orm.em.fork();
    const input = req.body.inputS;
    try {
        if (!input.alumno || !input.materia) {
            return res.status(400).json({ error: "Se requieren alum_id y mat_id" });
        }
        const alumno = await em.findOne(Alumno, { id: input.alumno });
        const materia = await em.findOne(Materia, { id: input.materia });
        if (!alumno || !materia) {
            return res.status(404).json({ error: "Alumno o Materia no encontrada" });
        }
        const nuevaInscripcion = em.create(Inscripcion, {alumno,materia,fecha: input.fecha,});
        await em.persistAndFlush(nuevaInscripcion);
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(201).json({mensaje:'Inscripcion creda con éxito', data: nuevaInscripcion });
    } catch (error: any) {
        console.error('Error al agregar inscripcion:', error);
        return res.status(500).json({ mensaje: error.message });
    }
}

async function update(req:Request, res:Response) {
    const em = orm.em.fork();
    const id = parseInt(req.params.id)
    const input = req.body.inputS
    try{
        const inscripcionToUpdate = await em.findOneOrFail(Inscripcion, { id })
        if (!inscripcionToUpdate){
            return res.status(404).json({ mensaje: 'Inscripcion no encontrada' });
        }
        em.assign(inscripcionToUpdate, input)
        await em.flush()
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ mensaje: 'Inscripcion actualizado con éxito', data: inscripcionToUpdate});
    } catch (error:any){
        console.error('Error al actualizar inscripcion:', error);
        return res.status(500).json({ mensaje: error.message });
    }
}

async function remove(req:Request, res:Response){
    const em = orm.em.fork();
    const id = parseInt(req.params.id)
    try{
        const inscripcion = await em.findOne(Inscripcion, { id })
        if (!inscripcion){
            return res.status(404).json({ mensaje: 'Inscripcion no encontrada' });
        }
        await em.removeAndFlush(inscripcion)
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ Message: 'inscripcion eliminada con éxito.' });
    } catch (error){
        console.error('Error al eliminar inscripcion:', error);
        return res.status(500).json({ mensaje: 'Error al eliminar la inscripcion.' });
    }
}

export{inputS,findAll,findOne,add,update,remove}