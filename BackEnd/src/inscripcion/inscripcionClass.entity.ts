import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Inscripcion } from "./inscripcion.entity";
import { BaseEntity } from '../shared/db/baseEntity.entity';

@Entity()
export class InscripcionClass extends BaseEntity {

    @Property({nullable:true})
    fecha!:string

}