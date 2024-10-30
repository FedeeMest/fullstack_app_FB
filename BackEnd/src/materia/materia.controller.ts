import { Request, Response, NextFunction } from 'express';
import { MateriaRepository } from './materia.repository.js';
import { Materia } from './materia.entity.js';

const repository = new MateriaRepository();

function inputS(req: Request, res: Response, next: NextFunction) {
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

async function findAll(req: Request, res: Response, next: NextFunction) {
    try {
        const materias = await repository.findAll();
        res.status(200).json(materias);
    } catch (error) {
        next(error); // Pasar el error al middleware
    }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    try {
        const materia = await repository.findOne({ id });
        if (!materia) {
            return res.status(404).json({ error: "Materia no encontrada" });
        }
        return res.status(200).json(materia);
    } catch (error) {
        next(error); // Pasar el error al middleware
    }
}

async function add(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const input = req.body.inputS;

    try {
        const nuevoMateria = new Materia(input.nombre, input.horas_anuales, input.modalidad);
        const materia = await repository.add(nuevoMateria);
        return res.status(201).json(materia);
    } catch (error: any) {
        if (error.message.includes('Ya existe una materia con el nombre')) {
            return res.status(409).json({ message: error.message });
        }
        next(error); // Pasar cualquier otro error al middleware
    }
    return res.status(500).json({ message: "Unexpected error" }); // Ensure a return statement
}

async function update(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    try {
        const materia = await repository.update(id, req.body.inputS);
        if (!materia) { 
            return res.status(404).json({ error: "Materia no encontrada" });
        }
        return res.status(200).json(materia); 
    } catch (error) {
        next(error); // Pasar el error al middleware
    }
}

async function remove(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    try {
        const materia = await repository.delete({ id });
        if (!materia) { 
            return res.status(404).json({ error: "Materia no encontrada" }); 
        } 
        return res.status(200).json({ message: "Materia eliminada" });
    } catch (error: any) {
        // Capturar el error específico para la eliminación
        if (error.message.includes('No se puede eliminar la materia porque tiene inscripciones asociadas')) {
            return res.status(400).json({ error: error.message });
        }
        // Pasar cualquier otro error al middleware
        next(error);
    }
}


export { inputS, findAll, findOne, add, update, remove };
