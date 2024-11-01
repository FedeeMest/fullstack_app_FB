import { Cascade, Collection, OneToMany, Property } from "@mikro-orm/core";
import { Inscripcion } from "../inscripcion/inscripcion.entity";
import { BaseEntity } from "../shared/db/baseEntity.entity";

export class Materia extends BaseEntity{

    @Property({nullable:true})
    nombre!: string

    @Property({nullable:true})
    horas_anuales!: number

    @Property({nullable:true})
    modalidad!: string

    @Property({nullable:true})
    id?: number
}