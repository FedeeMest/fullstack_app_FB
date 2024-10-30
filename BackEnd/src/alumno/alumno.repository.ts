import { Repository } from "../shared/repository.js";
import { Alumno } from "./alumno.entity.js";
import { Inscripcion } from "../inscripcion/inscripcion.entity.js";
import { pool } from "../shared/db/conn.mysql.js";
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class AlumnoRepository implements Repository<Alumno> {
    public async findAll(): Promise<Alumno[] | undefined> {
        try {
            const [alumnos] = await pool.query("SELECT * FROM alumnos");
            return alumnos as Alumno[];
        } catch (error) {
            console.error('Error al obtener todos los alumnos:', error);
            throw new Error('Error al realizar la consulta en la base de datos.');
        }
    }

    public async findOne(item: { id: string; }): Promise<Alumno | undefined> {
        const id = Number.parseInt(item.id);
        try {
            const [alumnos] = await pool.query<RowDataPacket[]>("SELECT * FROM alumnos WHERE id = ?", [id]);
            if (alumnos.length === 0) {
                return undefined;
            }
            const alumno = alumnos[0] as Alumno;
            return alumno;
        } catch (error) {
            console.error('Error al buscar un alumno por ID:', error);
            throw new Error('Error al realizar la consulta en la base de datos.');
        }
    }

    public async getMaxLegajo(): Promise<number> {
        try {
            const [rows] = await pool.query<RowDataPacket[]>("SELECT MAX(legajo) AS maxLegajo FROM alumnos");
            const maxLegajo = rows[0]?.maxLegajo ?? 0;
            return Number(maxLegajo);
        } catch (error) {
            console.error('Error al obtener el máximo legajo:', error);
            throw new Error('Error al realizar la consulta en la base de datos.');
        }
    }

    public async findByLegajo(legajo: number): Promise<Alumno | null> {
        try {
            const [rows] = await pool.query<RowDataPacket[]>(`
                SELECT a.*
                FROM alumnos AS a
                WHERE a.legajo = ?`, [legajo]);
            if (rows.length === 0) {
                return null;
            }
            return { ...rows[0] } as Alumno;
        } catch (error) {
            console.error('Error al buscar por legajo:', error);
            throw new Error('Error al realizar la consulta en la base de datos.');
        }
    }

    public async findInscripcionesByAlumnoId(alumnoId: number): Promise<Inscripcion[] | undefined> {
        try {
            const [inscripciones] = await pool.query<RowDataPacket[]>(
                `SELECT * FROM inscripciones WHERE alumno_id = ?`, [alumnoId]
            );
            if (inscripciones.length === 0) {
                return undefined;
            }
            return inscripciones as Inscripcion[];
        } catch (error) {
            console.error('Error al obtener inscripciones:', error);
            throw new Error('Error al realizar la consulta en la base de datos.');
        }
    }

    public async add(alumnoInput: Alumno): Promise<Alumno | undefined> {
        try {
            const { id, ...alumnoRow } = alumnoInput;
            const [result] = await pool.query<ResultSetHeader>('INSERT INTO alumnos SET ?', [alumnoRow]);
            alumnoInput.id = result.insertId;
            return alumnoInput;
        } catch (error) {
            console.error('Error al agregar un alumno:', error);
            throw new Error('Error al agregar el alumno.');
        }
    }

    public async update(id: string, alumnoInput: Alumno): Promise<Alumno | undefined> {
        const alumnoId = Number.parseInt(id);
        try {
            const { ...alumnoRow } = alumnoInput;
            await pool.query('UPDATE alumnos SET ? WHERE id = ?', [alumnoRow, alumnoId]);
            return await this.findOne({ id });
        } catch (error) {
            console.error('Error al actualizar el alumno:', error);
            throw new Error('Error al actualizar el alumno.');
        }
    }

    public async delete(item: { id: string; }): Promise<Alumno | undefined> {
        try {
            const alumnoToDelete = await this.findOne(item);
            if (!alumnoToDelete) {
                throw new Error(`Alumno con ID ${item.id} no encontrado.`);
            }
            const alumnoId = Number.parseInt(item.id);
            const [result] = await pool.query<ResultSetHeader>('DELETE FROM alumnos WHERE id = ?', [alumnoId]);
            if (result.affectedRows === 0) {
                throw new Error(`No se pudo eliminar el alumno con ID ${item.id}.`);
            }
            return alumnoToDelete;
        } catch (error: any) {
            console.error('Error al eliminar el alumno:', error);
            throw new Error(error.message || 'Error al eliminar el alumno.');
        }
    }
}
