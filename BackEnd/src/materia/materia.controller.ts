import { Request, Response, NextFunction } from 'express';
import { Materia } from './materia.entity.js'; // Entidad Materia para interactuar con la tabla de materias
import { orm } from '../shared/db/orm.js'; // ORM para interactuar con la base de datos
import { Inscripcion } from '../inscripcion/inscripcion.entity.js'; // Entidad Inscripcion para verificar inscripciones asociadas
import { validarMateria } from '../utils/validarMateria.js';

// Middleware para procesar los datos de entrada
function inputS(req: Request, res: Response, next: NextFunction) {
    // Crear un objeto con los datos de entrada
    req.body.inputS = {
        nombre: req.body.nombre, // Nombre de la materia
        horas_anuales: req.body.horas_anuales, // Cantidad de horas anuales
        modalidad: req.body.modalidad, // Modalidad de la materia (presencial, virtual, etc.)
    };

    // Eliminar campos no definidos del objeto
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    });

    // Pasar al siguiente middleware
    next();
}

// Controlador para obtener todas las materias
async function findAll(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    try {
        // Obtener todas las materias de la base de datos
        const materias = await em.find(Materia, {});
        return res.status(200).json(materias); // Devolver la lista de materias
    } catch (error: any) {
        console.error('Error al obtener materias:', error); // Loguear el error
        return res.status(500).json({ mensaje: error.message }); // Devolver un error 500
    }
}

// Controlador para obtener una materia por ID
async function findOne(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const id = parseInt(req.params.id); // Obtener el ID de la materia desde los parámetros
    try {
        // Buscar la materia en la base de datos
        const materia = await em.findOneOrFail(Materia, { id });
        if (!materia) {
            // Si no se encuentra, devolver un error 404
            return res.status(404).json({ mensaje: 'Materia no encontrada' });
        }
        return res.status(200).json(materia); // Devolver la materia encontrada
    } catch (error) {
        console.error('Error al buscar la materia:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al buscar la materia.' }); // Devolver un error 500
    }
}

// Controlador para agregar una nueva materia
async function add(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const input = req.body.inputS; // Obtener los datos procesados por el middleware

    let materiaCheck = validarMateria(input.nombre); // Validar el nombre de la materia

    if (!materiaCheck) {
        return res.status(400).json({ mensaje: 'El nombre de la materia debe tener al menos 3 caracteres' });
    }
    try {
        // Verificar si ya existe una materia con el mismo nombre
        const materiaExistente = await em.findOne(Materia, { nombre: input.nombre });
        if (materiaExistente) {
            return res.status(400).json({ mensaje: 'Ya existe una materia con ese nombre' });
        }

        // Crear una nueva materia
        const nuevaMateria = em.create(Materia, input);
        await em.persistAndFlush(nuevaMateria); // Guardar la materia en la base de datos
        return res.status(201).json({ mensaje: 'Materia creada con éxito', data: nuevaMateria }); // Devolver la materia creada
    } catch (error: any) {
        console.error('Error al agregar materia:', error); // Loguear el error
        return res.status(500).json({ mensaje: error.message }); // Devolver un error 500
    }
}

// Controlador para actualizar una materia existente
async function update(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const id = parseInt(req.params.id); // Obtener el ID de la materia desde los parámetros
    const input = req.body.inputS; // Obtener los datos procesados por el middleware
    try {
        // Buscar la materia en la base de datos
        const materia = await em.findOne(Materia, { id });
        if (!materia) {
            // Si no se encuentra, devolver un error 404
            return res.status(404).json({ mensaje: 'Materia no encontrada' });
        }

        // Actualizar los datos de la materia
        em.assign(materia, input);
        await em.flush(); // Guardar los cambios en la base de datos
        return res.status(200).json({ mensaje: 'Materia actualizada con éxito', data: materia }); // Devolver la materia actualizada
    } catch (error: any) {
        console.error('Error al actualizar materia:', error); // Loguear el error
        return res.status(500).json({ mensaje: error.message }); // Devolver un error 500
    }
}

// Controlador para eliminar una materia
async function remove(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const id = parseInt(req.params.id); // Obtener el ID de la materia desde los parámetros
    try {
        // Verificar si la materia tiene inscripciones asociadas
        const inscripciones = await em.count(Inscripcion, { materia: id });
        if (inscripciones > 0) {
            return res.status(400).json({ mensaje: 'No se puede eliminar la materia porque tiene inscripciones asociadas' });
        }

        // Buscar la materia en la base de datos
        const materia = await em.findOne(Materia, { id });
        if (!materia) {
            // Si no se encuentra, devolver un error 404
            return res.status(404).json({ mensaje: 'Materia no encontrada' });
        }

        // Eliminar la materia de la base de datos
        await em.removeAndFlush(materia);
        return res.status(200).json({ mensaje: 'Materia eliminada con éxito' }); // Confirmar la eliminación
    } catch (error: any) {
        console.error('Error al eliminar materia:', error); // Loguear el error
        return res.status(500).json({ mensaje: error.message }); // Devolver un error 500
    }
}

// Exportar las funciones para usarlas en las rutas
export { inputS, findAll, findOne, add, update, remove };