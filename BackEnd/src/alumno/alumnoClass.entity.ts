import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Alumno } from "./alumno.entity";
import { BaseEntity } from '../shared/db/baseEntity.entity';

@Entity()
export class AlumnoClass extends BaseEntity {

    @Property({nullable:true})
    nombre!: string

    @Property({nullable:true})
    apellido!: string

    @Property({nullable:true})
    plan!:string

    @Property({nullable:true, unique:true})
    mail!:string

    @Property({nullable:true})
    direccion!:string

    @Property({nullable:true})
    fechaN!:string
        
}
