import {Entity,Property,PrimaryKey} from '@mikro-orm/core'


@Entity()
export class Alumno {

    @PrimaryKey({nullable: false})
    id!: number

    @Property({nullable: false})
    nombre!: string

    @Property({nullable: false})
    apellido!: string

    @Property({nullable: false})
    plan!:string

    @Property({nullable: false})
    mail!:string

    @Property({nullable: false})
    direccion!:string

    @Property({nullable: false})
    fechaN!: string

    @Property({nullable: false})
    legajo!: number


}