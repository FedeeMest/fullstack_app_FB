import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { Alumno } from '../alumno/alumno.entity.js';
import { Admin } from '../admin/admin.entity.js';

// Inicio de sesión
async function login(req: Request, res: Response) {
    const em = orm.em.fork();
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
        return res.status(400).json({ Error: 'Usuario o contraseña no proporcionados.' });
    }

    try {
        // Buscar en la tabla de Alumnos
        const alumno = await em.findOne(Alumno, { usuario, contraseña });
        if (alumno) {
            res.header('Access-Control-Allow-Origin', '*');
            return res.status(200).json({ Message: 'Inicio de sesión exitoso', role: 'alumno', data: alumno });
        }

        // Buscar en la tabla de Admins si no es un Alumno
        const admin = await em.findOne(Admin, { usuario, contraseña });
        if (admin) {
            res.header('Access-Control-Allow-Origin', '*');
            return res.status(200).json({ Message: 'Inicio de sesión exitoso', role: 'admin', data: admin });
        }

        return res.status(404).json({ Error: 'Usuario o contraseña incorrectos.' });
    } catch (error) {
        console.error('Error al realizar el inicio de sesión:', error);
        return res.status(500).json({ Error: 'Error interno del servidor.' });
    }
}

/* // Registro de un nuevo usuario Alumno
async function register(req: Request, res: Response) {
    const em = orm.em.fork();
    const { usuario, contraseña, nombre, apellido, mail, fecha_n, direccion, plan } = req.body;

    if (!usuario || !contraseña || !nombre || !apellido || !mail || !fecha_n || !direccion || !plan) {
        return res.status(400).json({ Error: 'Faltan datos requeridos para el registro.' });
    }

    try {
        // Verificar que el usuario no exista
        const usuarioExistente = await em.findOne(Alumno, { usuario });
        if (usuarioExistente) {
            return res.status(409).json({ Error: 'El usuario ya existe.' });
        }

        // Crear nuevo alumno
        const [alumnoConMaxLegajo] = await em.find(Alumno, {}, { orderBy: { legajo: 'DESC' }, limit: 1 });
        const maxLegajo = alumnoConMaxLegajo ? alumnoConMaxLegajo.legajo + 1 : 1;

        const nuevoAlumno = em.create(Alumno, {
            usuario,
            contraseña,
            nombre,
            apellido,
            mail,
            fecha_n,
            direccion,
            plan,
            legajo: maxLegajo,
        });
        await em.persistAndFlush(nuevoAlumno);

        res.header('Access-Control-Allow-Origin', '*');
        return res.status(201).json({ Message: 'Alumno registrado con éxito', data: nuevoAlumno });
    } catch (error) {
        console.error('Error al registrar alumno:', error);
        return res.status(500).json({ Error: 'Error interno del servidor.' });
    }
}
 */
export { login };
