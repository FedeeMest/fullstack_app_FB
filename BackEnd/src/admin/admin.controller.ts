import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Admin } from './admin.entity.js';

function inputS(req: Request, res: Response, next: NextFunction) {
    const fechaSinHora = req.body.fecha_n ? new Date(req.body.fecha_n).toISOString().split('T')[0] : '';
    req.body.inputS = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        mail: req.body.mail,
        direccion: req.body.direccion,
        fecha_n: fechaSinHora,
        usuario: req.body.usuario,
        password: req.body.password
    };
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    });
    next();
}

async function findAll(req: Request, res: Response) {
    const em = orm.em.fork();
    try {
        const admin = await em.find(Admin, {});
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json(admin);
    } catch (error) {
        console.error('Error al obtener admins:', error);
        return res.status(500).json({ Error: 'Error al obtener la lista de admis.' });
    }
}

async function findOne(req: Request, res: Response) {
    const em = orm.em.fork();
    const id = parseInt(req.params.id, 10);
    try {
        const admin = await em.findOneOrFail(Admin, { id });
        if (!admin) {
            return res.status(404).json({ Error: 'Admin no encontrado.' });
        }
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json(admin);
    } catch (error) {
        console.error('Error al buscar el admin:', error);
        return res.status(500).json({ Error: 'Error al buscar el admin.' });
    }
}


async function add(req: Request, res: Response) {
    const em = orm.em.fork();
    const input = req.body.inputS;
    try {
        const [adminConMaxNumero] = await em.find(Admin, {}, { orderBy: { numero: 'DESC' }, limit: 1 });
        const maxNumero = adminConMaxNumero ? adminConMaxNumero.numero + 1 : 1
        const nuevoAdmin = em.create(Admin, { ...input, numero: maxNumero });
        await em.persistAndFlush(nuevoAdmin);
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(201).json({ Message: 'Admin creado con éxito', data: nuevoAdmin });
    } catch (error) {
        console.error('Error al agregar admin:', error);
        return res.status(500).json({ Error: 'Error al agregar el admin.' });
    }
}

async function update(req: Request, res: Response) {
    const em = orm.em.fork();
    const id = parseInt(req.params.id, 10);
    const input = req.body.inputS;
    try {
        const admin = await em.findOneOrFail(Admin, { id });
        if (!admin) {
            return res.status(404).json({ Error: 'Admin no encontrado.' });
        }
        em.assign(admin, input);
        await em.flush();
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ Message: 'Admin actualizado con éxito', data: admin });
    } catch (error) {
        console.error('Error al actualizar admin:', error);
        return res.status(500).json({ Error: 'Error al actualizar el admin.' });
    }
}

async function remove(req: Request, res: Response) {
    const em = orm.em.fork();
    const id = parseInt(req.params.id, 10);
    try {
        const admin = await em.findOne(Admin, { id });
        if (!admin) {
            return res.status(404).json({ Error: 'Admin no encontrado.' });
        }
        await em.removeAndFlush(admin);
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ Message: 'Admin eliminado con éxito.' });
    } catch (error) {
        console.error('Error al eliminar admin:', error);
        return res.status(500).json({ Error: 'Error al eliminar el admin.' });
    }
}

export { add, findAll, findOne, remove, update, inputS };
