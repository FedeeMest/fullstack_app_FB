import { Repository} from "../shared/repository.js";
import { Materia } from "./materia.entity.js";
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'


export class MateriaRepository implements Repository <Materia> {
    public async findAll(): Promise<Materia[] | undefined> {
        throw new Error("Method not implemented.");
    }
    public async findOne(item: { id: string; }): Promise<Materia | undefined> {
        throw new Error("Method not implemented.");
    }
    public async add(item: Materia): Promise<Materia | undefined> {
        throw new Error("Method not implemented.");
    }
    public async update(id: string, item: Materia): Promise<Materia | undefined> {
        throw new Error("Method not implemented.");
    }
    public async delete(item: { id: string; }): Promise<Materia | undefined> {
        throw new Error("Method not implemented.");
    }
}