import {Entity,Property} from '@mikro-orm/core'
import { Usuario } from '../shared/usuario/usuario.entity.js'


@Entity()
export class Alumno extends Usuario {

    @Property({nullable: false})
    plan!:string

    @Property({nullable: false})
    legajo!: number

    /* @PrimaryKey({nullable: false})
    id!: number

    @Property({nullable: false})
    usuario!: string

    @Property({nullable: false})
    password!: string

    @Property({nullable: false})
    nombre!:string

    @Property({nullable: false})
    apellido!: number

    @Property({nullable: false})
    mail!:string

    @Property({nullable: false})
    fecha_n!: string

    @Property({nullable: false})
    direccion!:string
 */
}