import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Alumno } from './alumno.entity.js';
import { Inscripcion } from '../inscripcion/inscripcion.entity.js';

function inputS(req: Request, res: Response, next: NextFunction) {
    const fechaSinHora = req.body.fecha_n ? new Date(req.body.fecha_n).toISOString().split('T')[0] : '';
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
    Object.keys(req.body.inputS).forEach((key) => {
        if (req.body.inputS[key] === undefined) delete req.body.inputS[key];
    });
    next();
}

async function findAll(req: Request, res: Response) {
    const em = orm.em.fork();
    try {
        const alumnos = await em.find(Alumno, {});
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json(alumnos);
    } catch (error) {
        console.error('Error al obtener alumnos:', error);
        return res.status(500).json({ Error: 'Error al obtener la lista de alumnos.' });
    }
}

async function findOne(req: Request, res: Response) {
    const em = orm.em.fork();
    const id = parseInt(req.params.id, 10);
    try {
        const alumno = await em.findOneOrFail(Alumno, { id });
        if (!alumno) {
            return res.status(404).json({ Error: 'Alumno no encontrado.' });
        }
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json(alumno);
    } catch (error) {
        console.error('Error al buscar el alumno:', error);
        return res.status(500).json({ Error: 'Error al buscar el alumno.' });
    }
}

async function findLegajo(req: Request, res: Response) {
    const em = orm.em.fork();
    const legajo = parseInt(req.params.legajo, 10);
    if (isNaN(legajo)) {
        return res.status(400).json({ Error: 'Legajo inválido.' });
    }
    try {
        const alumno = await em.findOne(Alumno, { legajo });
        if (!alumno) {
            return res.status(404).json({ Error: 'Alumno no encontrado.' });
        }
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json(alumno);
    } catch (error) {
        console.error('Error al buscar alumno por legajo:', error);
        return res.status(500).json({ Error: 'Error al buscar el alumno por legajo.' });
    }
}

async function findInscripcionesByAlumnoId(req: Request, res: Response) {
    const em = orm.em.fork();
    const alumnoId = parseInt(req.params.id, 10);
    if (isNaN(alumnoId)) {
        return res.status(400).json({ Error: 'ID de alumno inválido.' });
    }
    try {
        const inscripciones = await em.find(Inscripcion, { alumno: { id: alumnoId } });
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json(inscripciones);
    } catch (error) {
        console.error('Error al obtener inscripciones:', error);
        return res.status(500).json({ Error: 'Error al obtener las inscripciones.' });
    }
}

async function add(req: Request, res: Response) {
    const em = orm.em.fork();
    const input = req.body.inputS;
    try {
        const [alumnoConMaxLegajo] = await em.find(Alumno, {}, { orderBy: { legajo: 'DESC' }, limit: 1 });
        const maxLegajo = alumnoConMaxLegajo ? alumnoConMaxLegajo.legajo + 1 : 1
        const nuevoAlumno = em.create(Alumno, { ...input, legajo: maxLegajo });
        await em.persistAndFlush(nuevoAlumno);
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(201).json({ Message: 'Alumno creado con éxito', data: nuevoAlumno });
    } catch (error) {
        console.error('Error al agregar alumno:', error);
        return res.status(500).json({ Error: 'Error al agregar el alumno.' });
    }
}

async function update(req: Request, res: Response) {
    const em = orm.em.fork();
    const id = parseInt(req.params.id, 10);
    const input = req.body.inputS;
    try {
        const alumno = await em.findOneOrFail(Alumno, { id });
        if (!alumno) {
            return res.status(404).json({ Error: 'Alumno no encontrado.' });
        }
        em.assign(alumno, input);
        await em.flush();
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ Message: 'Alumno actualizado con éxito', data: alumno });
    } catch (error) {
        console.error('Error al actualizar alumno:', error);
        return res.status(500).json({ Error: 'Error al actualizar el alumno.' });
    }
}

async function remove(req: Request, res: Response) {
    const em = orm.em.fork();
    const id = parseInt(req.params.id, 10);
    try {
        const alumno = await em.findOne(Alumno, { id });
        if (!alumno) {
            return res.status(404).json({ Error: 'Alumno no encontrado.' });
        }
        await em.removeAndFlush(alumno);
        res.header('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ Message: 'Alumno eliminado con éxito.' });
    } catch (error) {
        console.error('Error al eliminar alumno:', error);
        return res.status(500).json({ Error: 'Error al eliminar el alumno.' });
    }
}

export { add, findAll, findLegajo, findInscripcionesByAlumnoId, findOne, remove, update, inputS };
