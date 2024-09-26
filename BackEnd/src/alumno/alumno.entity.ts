import { Inscripcion } from "../inscripcion/inscripcion.entity"
import { BaseEntity } from "../shared/db/baseEntity.entity"
import {Entity,Property,ManyToMany,Cascade,ManyToOne,Rel,OneToMany, Collection} from '@mikro-orm/core'


@Entity()
export class Alumno extends BaseEntity {
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

    @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.alumno, {
        cascade: [Cascade.ALL],
    })
    inscripciones = new Collection<Inscripcion>(this)

    @Property({nullable:true})
    id?: number

}