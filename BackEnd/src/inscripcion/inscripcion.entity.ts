import { Entity , Property , ManyToOne, PrimaryKey} from "@mikro-orm/core";
import { Alumno } from "../alumno/alumno.entity.js";
import { Materia } from "../materia/materia.entity.js";


@Entity()
export class Inscripcion{
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => Alumno)
    alumno!: Alumno;
    
    @ManyToOne(() => Materia)
    materia!: Materia;

    @Property({ nullable: true })
    fecha!: string;

}