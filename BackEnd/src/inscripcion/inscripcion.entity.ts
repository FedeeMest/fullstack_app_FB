import { Entity , Property , ManyToOne, PrimaryKey} from "@mikro-orm/core";
import { Alumno } from "../alumno/alumno.entity";
import { Materia } from "../materia/materia.entity";
import { BaseEntity } from "../shared/db/baseEntity.entity";

@Entity()
export class Inscripcion extends BaseEntity {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => Alumno)
    alumno!: Alumno;
    
    @ManyToOne(() => Materia)
    materia!: Materia;

    @Property({ nullable: true })
    fecha!: string;

}