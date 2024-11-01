import {Request, Response, NextFunction} from 'express';
import { Materia } from './materia.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em

function inputS (req: Request, res: Response, next: NextFunction) {
    req.body.inputS = {
        nombre: req.body.nombre,
        horas_anuales: req.body.horas_anuales,
        modalidad: req.body.modalidad,
    };
    
    // Eliminar propiedades indefinidas
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    });

    next();
}

async function findAll(req: Request, res: Response) {
    try{
        const materias = await em.find(Materia, {})
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json(materias);
    } catch (error:any){
    res.status(500).json({ mensaje: error.message });
    }
}

async function findOne (req:Request, res:Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const materia = await em.findOneOrFail(Materia,{ id })
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({ mensaje: 'Materia encontrado', data: materia});
    } catch (error:any){
        res.status(500).json({ mensaje: error.message })
    }
}

async function add (req:Request, res:Response) { 
    try{
        const materia = em.create(Materia, req.body.inputS)
        await em.flush()
        res.header('Access-Control-Allow-Origin', '*');
        res.status(201).json({ mensaje: 'Materia creado', data: materia});
    } catch (error:any){
        res.status(500).json({ mensaje: error.message });
    }
}

async function update(req:Request, res:Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const materiaToUpdate = await em.findOneOrFail(Materia, { id })
        em.assign(materiaToUpdate, req.body.inputS)
        await em.flush()
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({ mensaje: 'Materia actualizado', data: materiaToUpdate});
    } catch (error:any){
        res.status(500).json({ mensaje: error.message });
    }
}

async function remove(req:Request, res:Response){
    try{
        const id = Number.parseInt(req.params.id)
        const materia = em.getReference(Materia, id)
        await em.removeAndFlush(materia)
    } catch (error:any){
        res.status(500).json({ mensaje: error.message });
    }
}


export { inputS, findAll, findOne, add, update, remove };
