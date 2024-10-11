import { Inscripcion } from "../inscripcion/inscripcion.entity";

export class Alumno {
    constructor(
        public nombre: string,
        public apellido: string,
        public plan:string,
        public mail:string,
        public direccion:string,
        public fechaN:string,
        public legajo:number,
        public id?: number
    ){}
}