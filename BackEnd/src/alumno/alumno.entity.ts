import { BaseEntity } from "../shared/db/baseEntity.entity"
import {Entity,Property,PrimaryKey} from '@mikro-orm/core'


@Entity()
export class Alumno extends BaseEntity {

    @PrimaryKey({nullable:true})
    id?: number

    @Property({nullable:true})
    nombre!: string

    @Property({nullable:true})
    apellido!: string

    @Property({nullable:true})
    plan!:string

    @Property({nullable:true})
    mail!:string

    @Property({nullable:true})
    direccion!:string

    @Property({nullable:true})
    fechaN!: Date

    @Property({nullable:true})
    legajo!: number


}