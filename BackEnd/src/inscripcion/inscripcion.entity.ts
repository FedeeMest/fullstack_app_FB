import { Entity , Property , ManyToOne} from "@mikro-orm/core";
import { Alumno } from "../alumno/alumno.entity";
import { Materia } from "../materia/materia.entity";
import { BaseEntity } from "../shared/db/baseEntity.entity";

@Entity()
export class Inscripcion extends BaseEntity {
    @ManyToOne(() => Alumno)
    alumno!: Alumno;
    
    @ManyToOne(() => Materia)
    materia!: Materia

    @Property({nullable: true})
    fecha!: string

    @Property({nullable: true})
    id? : number

}