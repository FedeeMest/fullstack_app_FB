import { Entity, Property, ManyToOne, PrimaryKey } from "@mikro-orm/core";
import { Alumno } from "../alumno/alumno.entity.js";
import { Materia } from "../materia/materia.entity.js";

@Entity()
export class Inscripcion {
    @PrimaryKey()
    id!: number;  // La única clave primaria y columna AUTO_INCREMENT

    @ManyToOne(() => Alumno)
    alumno!: Alumno;  // Relación para acceder al alumno

    @ManyToOne(() => Materia)
    materia!: Materia;  // Relación para acceder a la materia

    @Property({ nullable: true })
    fecha!: string;  // Atributo para almacenar la fecha
}
