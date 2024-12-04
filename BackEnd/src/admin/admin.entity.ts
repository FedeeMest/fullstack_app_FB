import {Entity,Property} from '@mikro-orm/core'
import { usuario } from '../shared/usuario/usuario.entity'

@Entity()
export class Admin extends usuario {

    @Property({nullable: false})
    numero!:string
}