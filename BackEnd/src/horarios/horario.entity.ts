import crypto from "node:crypto"

export class Horario {
    constructor(
    public dia: string,
    public hora: number,
    public materia: string,
    public id = crypto.randomUUID()
    ){}
}
