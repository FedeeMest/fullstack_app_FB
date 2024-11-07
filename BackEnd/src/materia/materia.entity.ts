import { Entity , Property,PrimaryKey} from "@mikro-orm/core";


@Entity()
export class Materia{

    @PrimaryKey({nullable: false})
    id!: number

    @Property({nullable:true, unique:true})
    nombre!: string

    @Property({nullable:true})
    horas_anuales!: number

    @Property({nullable:true})
    modalidad!: string

}