import { Alumno } from "../alumno/alumno.entity";
import { Materia } from "../materia/materia.entity";

export class Inscripcion {
    constructor(
        public alumno: Alumno,
        public materia: Materia,
        public fecha: string,
        public id? : number
    ){}
}