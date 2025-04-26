import { Request, Response, NextFunction } from 'express';
import { Inscripcion } from './inscripcion.entity.js'; // Entidad Inscripcion para interactuar con la tabla de inscripciones
import { orm } from '../shared/db/orm.js'; // ORM para interactuar con la base de datos
import { Alumno } from '../alumno/alumno.entity.js'; // Entidad Alumno para buscar alumnos
import { Materia } from '../materia/materia.entity.js'; // Entidad Materia para buscar materias

// Middleware para procesar los datos de entrada
function inputS(req: Request, res: Response, next: NextFunction) {
    // Crear un objeto con los datos de entrada
    req.body.inputS = {
        alumno: req.body.alumno, // ID del alumno
        materia: req.body.materia, // ID de la materia
        fecha: req.body.fecha, // Fecha de inscripción
    };

    // Eliminar campos no definidos del objeto
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    });

    // Pasar al siguiente middleware
    next();
}

// Controlador para obtener todas las inscripciones
async function findAll(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    try {
        // Obtener todas las inscripciones de la base de datos
        const inscripciones = await em.find(Inscripcion, {});
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json(inscripciones); // Devolver la lista de inscripciones
    } catch (error: any) {
        console.error('Error al obtener inscripciones:', error); // Loguear el error
        return res.status(500).json({ mensaje: error.message }); // Devolver un error 500
    }
}

// Controlador para obtener una inscripción por ID
async function findOne(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const id = parseInt(req.params.id); // Obtener el ID de la inscripción desde los parámetros
    try {
        // Buscar la inscripción en la base de datos
        const inscripcion = await em.findOneOrFail(Inscripcion, { id });
        if (!inscripcion) {
            // Si no se encuentra, devolver un error 404
            return res.status(404).json({ mensaje: 'Inscripción no encontrada' });
        }
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json(inscripcion); // Devolver la inscripción encontrada
    } catch (error) {
        console.error('Error al buscar la inscripción:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al buscar la inscripción.' }); // Devolver un error 500
    }
}

// Controlador para agregar una nueva inscripción
async function add(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const input = req.body.inputS; // Obtener los datos procesados por el middleware
    try {
        // Validar que se hayan proporcionado los IDs de alumno y materia
        if (!input.alumno || !input.materia) {
            return res.status(400).json({ error: "Se requieren alumno y materia" });
        }

        // Buscar el alumno y la materia en la base de datos
        const alumno = await em.findOne(Alumno, { id: input.alumno });
        const materia = await em.findOne(Materia, { id: input.materia });

        // Validar que el alumno y la materia existan
        if (!alumno || !materia) {
            return res.status(404).json({ error: "Alumno o Materia no encontrada" });
        }

        // Crear una nueva inscripción
        const nuevaInscripcion = em.create(Inscripcion, {
            alumno,
            materia,
            fecha: input.fecha,
        });

        // Guardar la inscripción en la base de datos
        await em.persistAndFlush(nuevaInscripcion);
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(201).json({ mensaje: 'Inscripción creada con éxito', data: nuevaInscripcion }); // Devolver la inscripción creada
    } catch (error: any) {
        console.error('Error al agregar inscripción:', error); // Loguear el error
        return res.status(500).json({ mensaje: error.message }); // Devolver un error 500
    }
}

// Controlador para actualizar una inscripción existente
async function update(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const id = parseInt(req.params.id); // Obtener el ID de la inscripción desde los parámetros
    const input = req.body.inputS; // Obtener los datos procesados por el middleware
    try {
        // Buscar la inscripción en la base de datos
        const inscripcionToUpdate = await em.findOneOrFail(Inscripcion, { id });
        if (!inscripcionToUpdate) {
            // Si no se encuentra, devolver un error 404
            return res.status(404).json({ mensaje: 'Inscripción no encontrada' });
        }

        // Actualizar los datos de la inscripción
        em.assign(inscripcionToUpdate, input);
        await em.flush(); // Guardar los cambios en la base de datos
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json({ mensaje: 'Inscripción actualizada con éxito', data: inscripcionToUpdate }); // Devolver la inscripción actualizada
    } catch (error: any) {
        console.error('Error al actualizar inscripción:', error); // Loguear el error
        return res.status(500).json({ mensaje: error.message }); // Devolver un error 500
    }
}

// Controlador para eliminar una inscripción
async function remove(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const id = parseInt(req.params.id); // Obtener el ID de la inscripción desde los parámetros
    try {
        // Buscar la inscripción en la base de datos
        const inscripcion = await em.findOne(Inscripcion, { id });
        if (!inscripcion) {
            // Si no se encuentra, devolver un error 404
            return res.status(404).json({ mensaje: 'Inscripción no encontrada' });
        }

        // Eliminar la inscripción de la base de datos
        await em.removeAndFlush(inscripcion);
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json({ mensaje: 'Inscripción eliminada con éxito.' }); // Confirmar la eliminación
    } catch (error) {
        console.error('Error al eliminar inscripción:', error); // Loguear el error
        return res.status(500).json({ mensaje: 'Error al eliminar la inscripción.' }); // Devolver un error 500
    }
}

// Exportar las funciones para usarlas en las rutas
export { inputS, findAll, findOne, add, update, remove };