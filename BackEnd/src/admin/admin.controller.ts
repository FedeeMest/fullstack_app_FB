import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Admin } from './admin.entity.js';
import bcrypt from 'bcryptjs';

// Middleware para procesar los datos de entrada
function inputS(req: Request, res: Response, next: NextFunction) {
    // Formatear la fecha de nacimiento al formato ISO sin la hora
    const fechaSinHora = req.body.fecha_n ? new Date(req.body.fecha_n).toISOString().split('T')[0] : '';
    
    // Crear un objeto con los datos de entrada
    req.body.inputS = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        mail: req.body.mail,
        direccion: req.body.direccion,
        fecha_n: fechaSinHora,
        usuario: req.body.usuario,
        password: req.body.password
    };

    // Eliminar campos no definidos del objeto
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    });

    // Pasar al siguiente middleware
    next();
}

// Controlador para obtener todos los administradores
async function findAll(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    try {
        // Obtener todos los administradores de la base de datos
        const admin = await em.find(Admin, {});
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json(admin); // Devolver la lista de administradores
    } catch (error) {
        console.error('Error al obtener admins:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al obtener la lista de admins.' }); // Devolver un error 500
    }
}

// Controlador para obtener un administrador por ID
async function findOne(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const id = parseInt(req.params.id, 10); // Obtener el ID del administrador desde los parámetros
    try {
        // Buscar el administrador en la base de datos
        const admin = await em.findOneOrFail(Admin, { id });
        if (!admin) {
            // Si no se encuentra, devolver un error 404
            return res.status(404).json({ Error: 'Admin no encontrado.' });
        }
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json(admin); // Devolver el administrador encontrado
    } catch (error) {
        console.error('Error al buscar el admin:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al buscar el admin.' }); // Devolver un error 500
    }
}

// Controlador para agregar un nuevo administrador
async function add(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const input = req.body.inputS; // Obtener los datos procesados por el middleware
    try {
        // Obtener el administrador con el número más alto
        const [adminConMaxNumero] = await em.find(Admin, {}, { orderBy: { numero: 'DESC' }, limit: 1 });
        const maxNumero = adminConMaxNumero ? adminConMaxNumero.numero + 1 : 1; // Calcular el nuevo número

        const rol = 'admin'; // Asignar el rol de administrador

        // Generar un salt y encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(input.password, salt);
        console.log(hashedPassword); // Loguear la contraseña encriptada (solo para depuración)

        // Crear una nueva instancia de administrador
        const nuevoAdmin = em.create(Admin, { ...input, numero: maxNumero, rol: rol, password: hashedPassword });
        await em.persistAndFlush(nuevoAdmin); // Guardar el administrador en la base de datos
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(201).json({ Message: 'Admin creado con éxito', data: nuevoAdmin }); // Devolver el administrador creado
    } catch (error) {
        console.error('Error al agregar admin:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al agregar el admin.' }); // Devolver un error 500
    }
}

// Controlador para actualizar un administrador existente
async function update(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const id = parseInt(req.params.id, 10); // Obtener el ID del administrador desde los parámetros
    const input = req.body.inputS; // Obtener los datos procesados por el middleware
    try {
        // Buscar el administrador en la base de datos
        const admin = await em.findOneOrFail(Admin, { id });
        if (!admin) {
            // Si no se encuentra, devolver un error 404
            return res.status(404).json({ Error: 'Admin no encontrado.' });
        }
        em.assign(admin, input); // Asignar los nuevos datos al administrador
        await em.flush(); // Guardar los cambios en la base de datos
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json({ Message: 'Admin actualizado con éxito', data: admin }); // Devolver el administrador actualizado
    } catch (error) {
        console.error('Error al actualizar admin:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al actualizar el admin.' }); // Devolver un error 500
    }
}

// Controlador para eliminar un administrador
async function remove(req: Request, res: Response) {
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const id = parseInt(req.params.id, 10); // Obtener el ID del administrador desde los parámetros
    try {
        // Buscar el administrador en la base de datos
        const admin = await em.findOne(Admin, { id });
        if (!admin) {
            // Si no se encuentra, devolver un error 404
            return res.status(404).json({ Error: 'Admin no encontrado.' });
        }
        await em.removeAndFlush(admin); // Eliminar el administrador de la base de datos
        res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
        return res.status(200).json({ Message: 'Admin eliminado con éxito.' }); // Confirmar la eliminación
    } catch (error) {
        console.error('Error al eliminar admin:', error); // Loguear el error
        return res.status(500).json({ Error: 'Error al eliminar el admin.' }); // Devolver un error 500
    }
}

// Exportar las funciones para usarlas en las rutas
export { add, findAll, findOne, remove, update, inputS };