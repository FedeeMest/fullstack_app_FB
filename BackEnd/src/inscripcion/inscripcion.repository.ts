import { Repository} from "../shared/repository.js";
import { Inscripcion } from "./inscripcion.entity.js";
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class InscripcionRepository implements Repository <Inscripcion> {
    public async findAll(): Promise<Inscripcion[] | undefined> {
        throw new Error("Method not implemented.");
    }
    public async findOne(item: { id: string; }): Promise<Inscripcion | undefined> {
        throw new Error("Method not implemented.");
    }
    public async add(item: Inscripcion): Promise<Inscripcion | undefined> {
        throw new Error("Method not implemented.");
    }
    public async update(id: string, item: Inscripcion): Promise<Inscripcion | undefined> {
        throw new Error("Method not implemented.");
    }
    public async delete(item: { id: string; }): Promise<Inscripcion | undefined> {
        throw new Error("Method not implemented.");
    }
}