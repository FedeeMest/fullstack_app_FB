import {Request, Response, NextFunction} from 'express';
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

export{inputS,findAll,findOne,add,update,remove}