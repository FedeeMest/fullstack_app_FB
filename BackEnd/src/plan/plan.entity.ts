import crypto from "node:crypto"

export class Plan {
    constructor(
        public nombre: string,
        public id = crypto.randomUUID()
    ) {}
}

