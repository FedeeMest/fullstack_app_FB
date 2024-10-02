import { Repository} from "../shared/repository.js";
import { Materia } from "./materia.entity.js";
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'


export class MateriaRepository implements Repository <Materia> {
    public async findAll(): Promise<Materia[] | undefined> {
        const [materias] = await pool.query("select * from materias");
        return materias as Materia[];
    }


    public async findOne(item: { id: string; }): Promise<Materia | undefined> {
        const id = Number.parseInt(item.id);
        const [materias] = await pool.query<RowDataPacket[]>("select * from materias where id = ?", [id]);
        if(materias.length === 0) {
            return undefined;
        }
        const materia = materias[0] as Materia;
        return materia
    }


    public async add(materiaInput: Materia): Promise<Materia | undefined> {
        const {id,...materiaRow} = materiaInput;
        const [result]= await pool.query<ResultSetHeader>('insert into materias set ?', [materiaRow])
        materiaInput.id = result.insertId
        return materiaInput;
    }


    public async update(id: string, materiaInput: Materia): Promise<Materia | undefined> {
        console.log(materiaInput);
        const materiaId = Number.parseInt(id);
        const {...materiaRow} = materiaInput;
        await pool.query('update materias set ? where id = ?', [materiaRow, materiaId]);
        return await this.findOne({ id });
    }

    
    public async delete(item: { id: string; }): Promise<Materia | undefined> {
        try {
            const materiaToDelete = await this.findOne(item);
            const materiaId = Number.parseInt(item.id);
            await pool.query('delete from materias where id = ?', [materiaId]);
            return materiaToDelete;
        } catch (error: any) {
            throw new Error('unable to delete materia');
        }
    }
}