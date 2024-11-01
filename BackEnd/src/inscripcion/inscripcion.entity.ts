import { Entity , Property , ManyToOne} from "@mikro-orm/core";
import { Alumno } from "../alumno/alumno.entity";
import { Materia } from "../materia/materia.entity";
import { BaseEntity } from "../shared/db/baseEntity.entity";

@Entity()
export class Inscripcion extends BaseEntity {
    @ManyToOne(() => Alumno)
    alumno_id!: number;
    
    @ManyToOne(() => Materia)
    materia_id!: number

    @Property({nullable: true})
    fecha!: string

    @Property({nullable: true})
    id? : number

}