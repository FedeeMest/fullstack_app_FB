import {Entity,Property} from '@mikro-orm/core'
import { usuario } from '../shared/usuario/usuario.entity.js'


@Entity()
export class Alumno extends usuario {

    @Property({nullable: false})
    plan!:string

    @Property({nullable: false})
    legajo!: number

    /* @PrimaryKey({nullable: false})
    id!: number

    @Property({nullable: false})
    usuario!: string

    @Property({nullable: false})
    contraseña!: string

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