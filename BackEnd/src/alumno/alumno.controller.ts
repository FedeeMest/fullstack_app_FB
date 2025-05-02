import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Alumno } from './alumno.entity.js';
import { Inscripcion } from '../inscripcion/inscripcion.entity.js';
import bcrypt from 'bcryptjs';

// Middleware para procesar los datos de entrada
function inputS(req: Request, res: Response, next: NextFunction) {
    // Formatear la fecha de nacimiento al formato ISO sin la hora
    const fechaSinHora = req.body.fecha_n ? new Date(req.body.fecha_n).toISOString().split('T')[0] : '';
    
    // Crear un objeto con los datos de entrada
    req.body.inputS = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        plan: req.body.plan,
        mail: req.body.mail,
        direccion: req.body.direccion,
        fecha_n: fechaSinHora,
        usuario: req.body.usuario,
        password: req.body.password
    };

    console.log('Datos procesados en el middleware:', req.body.inputS);
    // Eliminar campos no definidos del objeto
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    });

    // Pasar al siguiente middleware
    next();
}

// Controlador para obtener todos los alumnos
async function findAll(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    try {
        // Obtener todos los alumnos de la base de datos
        const alumnos = await em.find(Alumno, {});
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json(alumnos); // Devolver la lista de alumnos
    } catch (error) {
        console.error('Error al obtener alumnos:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al obtener la lista de alumnos.' }); // Devolver un error 500
    }
}

// Controlador para obtener un alumno por ID
async function findOne(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const id = parseInt(req.params.id, 10); // Obtener el ID del alumno desde los parámetros
    try {
        // Buscar el alumno en la base de datos
        const alumno = await em.findOneOrFail(Alumno, { id });
        if (!alumno) {
            // Si no se encuentra, devolver un error 404
            return res.status(404).json({ Error: 'Alumno no encontrado.' });
        }
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json(alumno); // Devolver el alumno encontrado
    } catch (error) {
        console.error('Error al buscar el alumno:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al buscar el alumno.' }); // Devolver un error 500
    }
}

// Controlador para obtener un alumno por legajo
async function findLegajo(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const legajo = parseInt(req.params.legajo, 10); // Obtener el legajo desde los parámetros
    if (isNaN(legajo)) {
        // Validar que el legajo sea un número
        return res.status(400).json({ Error: 'Legajo inválido.' });
    }
    try {
        // Buscar el alumno en la base de datos por legajo
        const alumno = await em.findOne(Alumno, { legajo });
        if (!alumno) {
            // Si no se encuentra, devolver un error 404
            return res.status(404).json({ Error: 'Alumno no encontrado.' });
        }
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json(alumno); // Devolver el alumno encontrado
    } catch (error) {
        console.error('Error al buscar alumno por legajo:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al buscar el alumno por legajo.' }); // Devolver un error 500
    }
}

// Controlador para obtener las inscripciones de un alumno por su ID
async function findInscripcionesByAlumnoId(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const alumnoId = parseInt(req.params.id, 10); // Obtener el ID del alumno desde los parámetros
    if (isNaN(alumnoId)) {
        // Validar que el ID sea un número
        return res.status(400).json({ Error: 'ID de alumno inválido.' });
    }
    try {
        // Buscar las inscripciones del alumno en la base de datos
        const inscripciones = await em.find(Inscripcion, { alumno: { id: alumnoId } });
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json(inscripciones); // Devolver las inscripciones encontradas
    } catch (error) {
        console.error('Error al obtener inscripciones:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al obtener las inscripciones.' }); // Devolver un error 500
    }
}

// Controlador para agregar un nuevo alumno
async function add(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const input = req.body.inputS; // Obtener los datos procesados por el middleware
    try {
        // Verificar que la contraseña no esté vacía
        if (!input.password) {
            return res.status(400).json({ Error: 'La contraseña es requerida.' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10); // Generar un salt
        const hashedPassword = await bcrypt.hash(input.password, salt); // Encriptar la contraseña
        console.log('Contraseña hasheada antes de guardar:', hashedPassword); // Loguear la contraseña encriptada

        // Obtener el legajo más alto y asignar el siguiente
        const [alumnoConMaxLegajo] = await em.find(Alumno, {}, { orderBy: { legajo: 'DESC' }, limit: 1 });
        const maxLegajo = alumnoConMaxLegajo ? alumnoConMaxLegajo.legajo + 1 : 1;

        // Crear el nuevo alumno con la contraseña encriptada
        const rol = 'alumno';
        const nuevoAlumno = em.create(Alumno, { ...input, password: hashedPassword, legajo: maxLegajo, rol: rol });

        console.log('Objeto alumno antes de guardar:', nuevoAlumno); // Loguear el objeto alumno antes de guardar

        // Guardar el alumno en la base de datos
        await em.persistAndFlush(nuevoAlumno);

        console.log('Alumno guardado en la base de datos:', nuevoAlumno); // Loguear el alumno después de guardar

        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(201).json({ Message: 'Alumno creado con éxito', data: nuevoAlumno }); // Devolver el alumno creado
    } catch (error) {
        console.error('Error al agregar alumno:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al agregar el alumno.' }); // Devolver un error 500
    }
}

// Controlador para actualizar un alumno existente
async function update(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const id = parseInt(req.params.id, 10); // Obtener el ID del alumno desde los parámetros
    const input = req.body.inputS; // Obtener los datos procesados por el middleware
    try {
        // Buscar el alumno en la base de datos
        const alumno = await em.findOneOrFail(Alumno, { id });
        if (!alumno) {
            // Si no se encuentra, devolver un error 404
            return res.status(404).json({ Error: 'Alumno no encontrado.' });
        }
        em.assign(alumno, input); // Asignar los nuevos datos al alumno
        await em.flush(); // Guardar los cambios en la base de datos
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json({ Message: 'Alumno actualizado con éxito', data: alumno }); // Devolver el alumno actualizado
    } catch (error) {
        console.error('Error al actualizar alumno:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al actualizar el alumno.' }); // Devolver un error 500
    }
}

// Controlador para eliminar un alumno
async function remove(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const id = parseInt(req.params.id, 10); // Obtener el ID del alumno desde los parámetros
    try {
        // Buscar el alumno en la base de datos
        const alumno = await em.findOne(Alumno, { id });
        if (!alumno) {
            // Si no se encuentra, devolver un error 404
            return res.status(404).json({ Error: 'Alumno no encontrado.' });
        }
        await em.removeAndFlush(alumno); // Eliminar el alumno de la base de datos
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json({ Message: 'Alumno eliminado con éxito.' }); // Confirmar la eliminación
    } catch (error) {
        console.error('Error al eliminar alumno:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al eliminar el alumno.' }); // Devolver un error 500
    }}

    // Controlador para cambiar la contraseña de un alumno
    async function changePassword(req: Request, res: Response) {
        const em = orm.em.fork(); // Crear un EntityManager para la consulta
        const id = parseInt(req.params.id, 10); // Obtener el ID del alumno desde los parámetros
        const { currentPassword, newPassword } = req.body; // Obtener las contraseñas del cuerpo de la solicitud
        const userRole = req.user?.rol; // Obtener el rol del usuario desde el token (asegúrate de que el middleware de autenticación lo agregue)
    
        try {
            // Buscar el alumno en la base de datos
            const alumno = await em.findOne(Alumno, { id });
            if (!alumno) {
                // Si no se encuentra, devolver un error 404
                return res.status(404).json({ Error: 'Alumno no encontrado.' });
            }
    
            // Si el rol es "alumno", verificar la contraseña actual
            if (userRole === 'alumno') {
                const isMatch = await bcrypt.compare(currentPassword, alumno.password);
                if (!isMatch) {
                    // Si no coincide, devolver un error 400
                    return res.status(400).json({ Error: 'La contraseña actual es incorrecta.' });
                }
            }
    
            // Encriptar la nueva contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
    
            // Actualizar la contraseña del alumno
            alumno.password = hashedPassword;
            await em.flush(); // Guardar los cambios en la base de datos
    
            res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
            return res.status(200).json({ Message: 'Contraseña actualizada con éxito.' }); // Confirmar la actualización
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error); // Loguear el error
            return res.status(500).json({ Error: 'Error al cambiar la contraseña.' }); // Devolver un error 500
        }
    }


// Exportar las funciones para usarlas en las rutas
export { add, findAll, findLegajo, findInscripcionesByAlumnoId, findOne, remove, update, inputS, changePassword };