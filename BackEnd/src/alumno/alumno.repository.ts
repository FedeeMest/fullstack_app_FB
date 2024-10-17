import { Repository} from "../shared/repository.js";
import { Alumno } from "./alumno.entity.js";
import { Inscripcion } from "../inscripcion/inscripcion.entity.js";
import { pool } from "../shared/db/conn.mysql.js";
import { ResultSetHeader, RowDataPacket } from 'mysql2'


export class AlumnoRepository implements Repository <Alumno> {
    public async findAll(): Promise<Alumno[] | undefined> {
        const [alumnos] = await pool.query("select * from alumnos");
        return alumnos as Alumno[];
    }


    public async findOne(item: { id: string; }): Promise<Alumno | undefined> {
        const id = Number.parseInt(item.id);
        const [alumnos] = await pool.query<RowDataPacket[]>("select * from alumnos where id = ?", [id]);
        if(alumnos.length === 0) {
            return undefined;
        }
        const alumno = alumnos[0] as Alumno;
        return alumno
    }


    public async getMaxLegajo(): Promise<number> {
        const [rows] = await pool.query<RowDataPacket[]>("SELECT MAX(legajo) AS maxLegajo FROM alumnos");
        const maxLegajo = rows[0]?.maxLegajo ?? 0;
        return Number(maxLegajo);
    }


    // Buscar alumno por legajo
    public async findByLegajo(legajo: number): Promise<Alumno & { inscripciones: Inscripcion[] } | null> {
        try {
            const [rows] = await pool.query<RowDataPacket[]>(`
                SELECT a.*, i.fecha, i.id AS inscripcion_id, i.materia_id
                FROM alumnos AS a
                LEFT JOIN inscripciones AS i ON a.id = i.alumno_id
                WHERE a.legajo = ?`, [legajo]);
    
            if (rows.length === 0) {
                return null; // No se encontró el alumno
            }
    
            // Agrupar las inscripciones
            const alumno = { ...rows[0] }; // Crear una copia del primer alumno encontrado
            alumno.inscripciones = rows.map(row => ({
                fecha: row.fecha,
                alumno_id: row.alumno_id,
                materia_id: row.materia_id,
                id: row.inscripcion_id,
            })).filter(ins => ins.fecha); // Filtrar inscripciones válidas
    
            return alumno as Alumno & { inscripciones: Inscripcion[] };
        } catch (error) {
            console.error('Error al buscar por legajo:', error);
            throw new Error('Error al realizar la consulta en la base de datos.');
        }
    }


    public async add(alumnoInput: Alumno): Promise<Alumno | undefined> {
        console.log(alumnoInput);
        const {id,...alumnoRow} = alumnoInput;
        const [result]= await pool.query<ResultSetHeader>('insert into alumnos set ?', [alumnoRow])
        alumnoInput.id = result.insertId
        return alumnoInput;
    }


    public async update(id: string, alumnoInput: Alumno): Promise<Alumno | undefined> {
        const alumnoId = Number.parseInt(id);
        const {...alumnoRow} = alumnoInput;
        await pool.query('update alumnos set ? where id = ?', [alumnoRow, alumnoId]);
        return await this.findOne({ id });
    }
    
    
    public async delete(item: { id: string; }): Promise<Alumno | undefined> {
        try {
            const alumnoToDelete = await this.findOne(item);
            const alumnoId = Number.parseInt(item.id);
            await pool.query('delete from alumnos where id = ?', [alumnoId]);
            return alumnoToDelete;
        } catch (error: any) {
            throw new Error('unable to delete alumno');
        }
    }
}