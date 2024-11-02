import { Entity , Property , ManyToOne, PrimaryKey} from "@mikro-orm/core";
import { Alumno } from "../alumno/alumno.entity.js";
import { Materia } from "../materia/materia.entity.js";


@Entity()
export class Inscripcion {
    @PrimaryKey()
    id!: number;

    @Property({ columnType: 'int', nullable: false })
    alum_id!: number;  // Atributo para almacenar el ID del alumno

    @Property({ columnType: 'int', nullable: false })
    mat_id!: number;  // Atributo para almacenar el ID de la materia

    @ManyToOne(() => Alumno)
    alumno!: Alumno;  // Relación para acceder al alumno

    @ManyToOne(() => Materia)
    materia!: Materia;  // Relación para acceder a la materia

    @Property({ nullable: true })
    fecha!: string;  // Atributo para almacenar la fecha
}
