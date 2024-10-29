import {Request, Response, NextFunction} from 'express';
import { AlumnoRepository } from './alumno.repository.js';
import { Alumno } from './alumno.entity.js';

const repository = new AlumnoRepository();




function inputS (req: Request, res: Response, next: NextFunction) {
    const fechaSinHora = req.body.fechaN ? new Date(req.body.fechaN).toISOString().split('T')[0] : '';
    req.body.inputS = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        plan: req.body.plan,
        mail: req.body.mail,
        direccion: req.body.direccion,
        fechaN: fechaSinHora,
    }
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    })

    next();
}




async function findAll(req: Request, res: Response) {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json(await repository.findAll());
}




async function findOne (req:Request, res:Response) {
    const id = req.params.id
    const alumno = await repository.findOne({ id })
    if (!alumno) {
        return res.status(404).json({Error:"Alumno no encontrado"});
    }
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(200).json(alumno);
}




async function findLegajo (req: Request, res: Response) {
    const legajo = parseInt(req.params.legajo, 10); // Convierte el legajo a número

    // Valida que legajo sea un número
    if (isNaN(legajo)) {
        return res.status(400).json({ Error: "Legajo inválido" });
    }

    try {
        const alumno = await repository.findByLegajo(legajo); // Llama a tu método de repositorio

        // Si no se encuentra el alumno, devuelve un error 404
        if (!alumno) {
            return res.status(404).json({ Error: "Alumno no encontrado" });
        }

        // Devuelve el alumno encontrado
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json(alumno);
    } catch (error) {
        // Maneja el error de la consulta
        return res.status(500).json({ Error: "Error al buscar el alumno" });
    }
};




async function findInscripcionesByAlumnoId (req: Request, res: Response) {
    console.log("ID recibido en la solicitud:", req.params.id); // Agrega este log
    const alumnoId = parseInt(req.params.id, 10);

    if (isNaN(alumnoId)) {
        return res.status(400).json({ Error: "ID de alumno inválido" });
    }

    try {
        const inscripciones = await repository.findInscripcionesByAlumnoId(alumnoId);

        if (!inscripciones) {
            return res.status(404).json({ Error: "No se encontraron inscripciones para este alumno" });
        }

        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json(inscripciones);
    } catch (error) {
        console.error('Error al obtener inscripciones:', error);
        return res.status(500).json({ Error: "Error al obtener las inscripciones" });
    }
}




async function add (req:Request, res:Response) { 
    const input = req.body.inputS;
    const maxLegajo = await repository.getMaxLegajo();
    const nuevoLegajo = maxLegajo + 1;
    const nuevoAlumno = new Alumno (input.nombre,input.apellido,input.plan,input.mail,input.direccion,input.fechaN,nuevoLegajo);
    const alumno = await repository.add(nuevoAlumno);
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(201).json({message: 'Character created', data:alumno});
}




async function update(req:Request, res:Response) {
    const alumno = await repository.update(req.params.id, req.body.inputS)

    if (!alumno) { 
        return res.status(404).json({Error:"Alumno no encontrado"});
    }
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(200).json({message: 'Alumno Actualizado con exito', data:alumno}); 
}




async function remove(req:Request, res:Response){
    const id = req.params.id
    const alumno = await repository.delete({ id })
 
    if (!alumno) { 
        return res.status(404).json({Error:"Alumno no encontrado"}); 
    } 
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(200).json({Message: "Alumno eliminado"});
}

export{inputS,findAll,findOne,add,update,remove,findInscripcionesByAlumnoId,findLegajo}