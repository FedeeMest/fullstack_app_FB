import { Repository} from "../shared/repository.js";
import { Alumno } from "./alumno.entity.js";
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