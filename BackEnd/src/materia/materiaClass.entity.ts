import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Materia } from "./materia.entity";
import { BaseEntity } from '../shared/db/baseEntity.entity';

@Entity()
export class MateriaClass extends BaseEntity {

    @Property({nullable:true, unique:true})
    nombre!: string

    @Property({nullable:true})
    horas_anuales!: number

    @Property({nullable:true})
    modalidad!:string
        
}
