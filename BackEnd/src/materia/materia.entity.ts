import crypto from "node:crypto"

export class Materia {
    constructor(
        public nombre: string,
        public horas_anuales: number,
        public modalidad: string,
        public id = crypto.randomUUID()
    ){}
}