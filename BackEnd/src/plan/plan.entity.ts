import { Materia}  from "../materia/materia.entity";
import crypto from "node:crypto"

export class Plan {
    constructor(
        public nombre: string,
        public materias: Materia[],
        public id = crypto.randomUUID()
    ) {}
}

