import {Request, Response, NextFunction} from 'express';
import { MateriaRepository } from './materia.repository.js';
import { Materia } from './materia.entity.js';

const repository = new MateriaRepository();
function inputS (req: Request, res: Response, next: NextFunction) {
    req.body.inputS = {
        nombre: req.body.nombre,
        horas_anuales: req.body.horas_anuales,
        modalidad: req.body.modalidad,
    }
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    })

    next();
}


async function findAll(req: Request, res: Response) {
    res.status(200).json(await repository.findAll());
}


async function findOne (req:Request, res:Response) {
    const id = req.params.id
    const materia = await repository.findOne({ id })
    if (!materia) {
        return res.status(404).json({Error:"Materia no encontrada"});
    }
    return res.status(200).json(materia);
}


async function add(req: Request, res: Response): Promise<Response> {
    const input = req.body.inputS;

    try {
        // Crear una nueva instancia de Materia usando los datos recibidos
        const nuevoMateria = new Materia(input.nombre, input.horas_anuales, input.modalidad);
        
        // Llamar al repositorio para agregar la nueva materia
        const materia = await repository.add(nuevoMateria);
        
        // Si todo sale bien, devolver el objeto creado con un código 201 (Created)
        return res.status(201).json(materia);

    } catch (error: any) {
        // Manejo de errores, incluyendo el error de duplicado de entrada
        if (error.message.includes('Ya existe una materia con el nombre')) {
            // Código de estado 409 (Conflict) para entradas duplicadas
            return res.status(409).json({ message: error.message });
        } 
        
        // Cualquier otro error es tratado como un error interno del servidor (500)
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}


async function update(req:Request, res:Response) {
    const materia = await repository.update(req.params.id, req.body.inputS)
    if (!materia) { 
        return res.status(404).json({Error:"Materia no encontrada"});
    }
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(200).json(materia); 
}


async function remove(req:Request, res:Response){
    const id = req.params.id
    const materia = await repository.delete({ id })
 
    if (!materia) { 
        return res.status(404).json({Error:"Materia no encontrada"}); 
    } 
    return res.status(200).json({Message: "Materia eliminada"});
}

export{inputS,findAll,findOne,add,update,remove}