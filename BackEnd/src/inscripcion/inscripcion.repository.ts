import { Repository} from "../shared/repository.js";
import { Inscripcion } from "./inscripcion.entity.js";
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class InscripcionRepository implements Repository <Inscripcion> {
    public async findAll(): Promise<Inscripcion[] | undefined> {
        const [inscripciones] = await pool.query("select * from inscripciones");
        return inscripciones as Inscripcion[];
    }


    public async findOne(item: { id: string; }): Promise<Inscripcion | undefined> {
        const id = Number.parseInt(item.id);
        const [inscripciones] = await pool.query<RowDataPacket[]>("select * from inscripciones where id = ?", [id]);
        if(inscripciones.length === 0) {
            return undefined;
        }
        const inscripcion = inscripciones[0] as Inscripcion;
        return inscripcion
    }


    public async add(item: Inscripcion): Promise<Inscripcion | undefined> {
        console.log(item);
        const {id, ...inscripcionRow} = item;
        const [result] = await pool.query<ResultSetHeader>('insert into inscripciones set ?', [inscripcionRow]);
        item.id = result.insertId;
        return item;
    }


    public async update(id: string, item: Inscripcion): Promise<Inscripcion | undefined> {
        const inscripcionId = Number.parseInt(id);
        const {...inscripcionRow} = item;
        await pool.query('update inscripciones set ? where id = ?', [inscripcionRow, inscripcionId]);
        return await this.findOne({ id });
    }

    
    public async delete(item: { id: string; }): Promise<Inscripcion | undefined> {
        try {
            const inscripcionToDelete = await this.findOne(item);
            const inscripcionId = Number.parseInt(item.id);
            await pool.query('delete from inscripciones where id = ?', [inscripcionId]);
            return inscripcionToDelete;
        } catch (error: any) {
            throw new Error('unable to delete inscripcion');
        }
    }
}