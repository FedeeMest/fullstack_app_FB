import {Request, Response, NextFunction} from 'express';
import { Inscripcion } from './inscripcion.entity.js';
import { orm } from '../shared/db/orm.js';
import { Alumno } from '../alumno/alumno.entity.js';
import { Materia } from '../materia/materia.entity.js';

const em = orm.em

function inputS (req: Request, res: Response, next: NextFunction) {
    req.body.inputS = {
        fecha: req.body.fecha,
    }
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    })

    next();
}


async function findAll(req: Request, res: Response) {
    try{
        const inscripciones = await em.find(Inscripcion, {})
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json(inscripciones);
    }catch (error:any){
        res.header('Access-Control-Allow-Origin', '*');
    res.status(500).json({ mensaje: error.message });
    }
}


async function findOne (req:Request, res:Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const inscripcion = await em.findOneOrFail(Inscripcion,{ id })
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({ mensaje: 'inscripcion encontrado', data: inscripcion});
    } catch (error:any){
        res.status(500).json({ mensaje: error.message })
    }
}

async function add (req:Request, res:Response) { 
    try {
        const input = req.body.inputS;
        const alumno = await em.findOne(Alumno, { id: input.alumno.id });
        const materia = await em.findOne(Materia, { id: input.materia.id });
        if (!alumno || !materia) {
            return res.status(404).json({ Error: "Alumno o Materia no encontrada" });
        }
        const nuevaInscripcion = em.create(Inscripcion, {alumno: alumno,materia: materia,fecha: req.body.inputS});
        await em.flush();
        delete req.body.inputS.alumno;
        delete req.body.inputS.materia;
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(201).json({ Inscripcion_Creada: nuevaInscripcion });
    } catch (error: any) {
        return res.status(500).json({ mensaje: error.message });
    }
}

async function update(req:Request, res:Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const inscripcionToUpdate = await em.findOneOrFail(Inscripcion, { id })
        em.assign(inscripcionToUpdate, req.body.inputS)
        await em.flush()
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({ mensaje: 'Inscripcion actualizado', data: inscripcionToUpdate});
    } catch (error:any){
        res.status(500).json({ mensaje: error.message });
    }
}


async function remove(req:Request, res:Response){
    try{
        const id = Number.parseInt(req.params.id)
        const inscripcion = em.getReference(Inscripcion, id)
        await em.removeAndFlush(inscripcion)
        res.header('Access-Control-Allow-Origin', '*');
    } catch (error:any){
        res.status(500).json({ mensaje: error.message });
    }
}

export{inputS,findAll,findOne,add,update,remove}