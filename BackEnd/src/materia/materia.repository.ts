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
        const { id, ...materiaRow } = materiaInput;

        try {
            const [result] = await pool.query<ResultSetHeader>('INSERT INTO materias SET ?', [materiaRow]);
            materiaInput.id = result.insertId;
            return materiaInput;
        } catch (error: any) {
            // Manejo del error de entrada duplicada
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error(`Ya existe una materia con el nombre '${materiaInput.nombre}'`);
            }
            // Otros errores de base de datos
            throw new Error('Error al insertar la materia: ' + error.message);
        }
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