import crypto from "node:crypto"

export class Final {
    constructor (
    public materia: string,
    public nota: number,
    public fecha: string,
    public id = crypto.randomUUID()
    ) {} 
}