import {Entity,Property} from '@mikro-orm/core'
import { Usuario } from '../shared/usuario/usuario.entity.js'


@Entity()
export class Alumno extends Usuario {

    @Property({nullable: false})
    plan!:string

    @Property({nullable: false})
    legajo!: number

}