import {Request, Response, NextFunction} from 'express';
import { Materia } from './materia.entity.js';
import { orm } from '../shared/db/orm.js';
import { Inscripcion } from '../inscripcion/inscripcion.entity.js';

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
    const em = orm.em.fork();
    try{
        const materias = await em.find(Materia, {})
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json(materias);
    } catch (error:any){
        console.error('Error al obtener materia:', error);
        return res.status(500).json({ mensaje: error.message });
    }
}

async function findOne (req:Request, res:Response) {
    const em = orm.em.fork();
    const id = Number.parseInt(req.params.id)
    try{
        const materia = await em.findOne(Materia, { id })
        if(!materia){
            return res.status(404).json({ mensaje: 'Materia no encontrado' })
        }
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json(materia);
    } catch (error:any){
        console.error('Error al buscar el materia:', error);
        return res.status(500).json({ mensaje: error.message })
    }
}

async function add (req:Request, res:Response) { 
    const em = orm.em.fork();
    const input = req.body.inputS

    try{
        const nuevaMateria = em.create(Materia, input)
        await em.persistAndFlush(nuevaMateria)
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(201).json({ mensaje: 'Materia creado', data: nuevaMateria});
    } catch (error:any){
        console.error('Error al agregar materia:', error);
        return res.status(500).json({ mensaje: error.message });
    }
}

async function update(req:Request, res:Response) {
    const em = orm.em.fork();
    const id = parseInt(req.params.id)
    const input = req.body.inputS

    try{
        const materia = await em.findOne(Materia, { id })
        if(!materia){
            return res.status(404).json({ mensaje: 'Materia no encontrado' })
        }
        em.assign(materia, input);
        await em.flush()
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ mensaje: 'Materia actualizado', data: materia});
    } catch (error:any){
        console.error('Error al actualizar materia:', error);
        return res.status(500).json({ mensaje: error.message });
    }
}

async function remove(req:Request, res:Response){
    const em = orm.em.fork();
    const id = Number.parseInt(req.params.id)
    try{ 
        const inscripciones = await em.count(Inscripcion, { materia: id });
        if (inscripciones > 0) {
            return res.status(400).json({ mensaje: 'No se puede eliminar la materia porque tiene inscripciones asociadas' });
        }
        const materia = await em.findOne(Materia, { id })
        if(!materia){
            return res.status(404).json({ mensaje: 'Materia no encontrado' })
        }

        await em.removeAndFlush(materia)
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ mensaje: 'Materia eliminado'});
    } catch (error:any){
        console.error('Error al eliminar materia:', error);
        return res.status(500).json({ mensaje: error.message });
    }
}


export { inputS, findAll, findOne, add, update, remove };
