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
        throw new Error("Method not implemented.");
    }
    public async add(item: Alumno): Promise<Alumno | undefined> {
        throw new Error("Method not implemented.");
    }
    public async update(item: Alumno): Promise<Alumno | undefined> {
        throw new Error("Method not implemented.");
    }
    public async delete(item: { id: string; }): Promise<Alumno | undefined> {
        throw new Error("Method not implemented.");
    }
}