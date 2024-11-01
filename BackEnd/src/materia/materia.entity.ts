import { Entity , Property,PrimaryKey} from "@mikro-orm/core";
import { Inscripcion } from "../inscripcion/inscripcion.entity";
import { BaseEntity } from "../shared/db/baseEntity.entity";

@Entity()
export class Materia extends BaseEntity{

    @PrimaryKey({nullable:true})
    id?: number

    @Property({nullable:true, unique:true})
    nombre!: string

    @Property({nullable:true})
    horas_anuales!: number

    @Property({nullable:true})
    modalidad!: string

}