import { Request, Response, NextFunction } from 'express';
import { Inscripcion } from './inscripcion.entity.js';
import { orm } from '../shared/db/orm.js';
import { Alumno } from '../alumno/alumno.entity.js';
import { Materia } from '../materia/materia.entity.js';

const em = orm.em;

function inputS(req: Request, res: Response, next: NextFunction) {
    req.body.inputS = {
        alum_id: req.body.alum_id,  // Cambia esto para usar alumno_id directamente
        mat_id: req.body.mat_id,  // Cambia esto para usar materia_id directamente
        fecha: req.body.fecha,
    };
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    });

    next();
}

async function findAll(req: Request, res: Response) {
    try {
        const inscripciones = await em.find(Inscripcion, {});
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json(inscripciones);
    } catch (error: any) {
        res.header('Access-Control-Allow-Origin', '*');
        res.status(500).json({ mensaje: error.message });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const inscripcion = await em.findOneOrFail(Inscripcion, { id });
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({ mensaje: 'Inscripcion encontrada', data: inscripcion });
    } catch (error: any) {
        res.status(500).json({ mensaje: error.message });
    }
}

async function add(req: Request, res: Response) { 
    try {
        const input = req.body.inputS;
        
        // Validamos que se pasen los IDs
        if (!input.alum_id || !input.mat_id) {
            return res.status(400).json({ error: "Se requieren alumno_id y materia_id" });
        }

        // Buscamos las entidades correspondientes
        const alumno = await em.findOne(Alumno, { id: input.alum_id });
        const materia = await em.findOne(Materia, { id: input.mat_id });

        // Verificamos que las entidades existan
        if (!alumno || !materia) {
            return res.status(404).json({ error: "Alumno o Materia no encontrada" });
        }
        
        const nuevaInscripcion = em.create(Inscripcion, {
            alum_id: input.alumno_id,
            mat_id: input.materia_id,
            alumno: alumno,  // Asignamos la instancia de Alumno
            materia: materia,  // Asignamos la instancia de Materia
            fecha: input.fecha,
        });
        
        await em.flush();
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(201).json({ Inscripcion_Creada: nuevaInscripcion });
    } catch (error: any) {
        return res.status(500).json({ mensaje: error.message });
    }
}


async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const inscripcionToUpdate = await em.findOneOrFail(Inscripcion, { id });
        em.assign(inscripcionToUpdate, req.body.inputS);
        await em.flush();
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({ mensaje: 'Inscripcion actualizada', data: inscripcionToUpdate });
    } catch (error: any) {
        res.status(500).json({ mensaje: error.message });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const inscripcion = em.getReference(Inscripcion, id);
        await em.removeAndFlush(inscripcion);
        res.header('Access-Control-Allow-Origin', '*');
        res.status(204).send(); // Cambié a 204 No Content para indicar que se eliminó correctamente
    } catch (error: any) {
        res.status(500).json({ mensaje: error.message });
    }
}

export { inputS, findAll, findOne, add, update, remove };
