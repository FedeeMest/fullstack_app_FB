import { Alumno } from "../alumno/alumno.entity.js";
import { Repository} from "../shared/repository.js";
import { Inscripcion } from "./inscripcion.entity.js";
import { Materia } from "../materia/materia.entity.js";

const alumno1 = new Alumno("Juan", "Perez", "2002", "juancitoperez@gmail.com","salta 1234", "14/08/2000","a02b9bb1-3769-4221-beb1-d7a3aeba7dad")
const alumno2 = new Alumno("Raul", "Lopez", "2004", "raullopez@gmail.com","dorrego 1234", "28/02/2004","a02b91bc-3769-4221-beb1-beb1aeba7dad")

const materia1 = new Materia("Matematica",20, "anual","a02b9bb1-3769-4221-beb1-d7a3aeba7dbd")
const materia2 = new Materia("Lengua", 10, "anual","a02b91bc-3769-5221-beb1-beb1aeba7dad")

const alumnos = [alumno1,alumno2]
const materias = [materia1,materia2]


const inscripciones = [ 
    new Inscripcion(alumno1, materia1, "2021-10-10", "a04b9bb1-3769-4221-beb1-d7a3aeba7dbd"), 
    new Inscripcion(alumno2, materia2, "2023-10-10", "a02b9zb1-3769-4221-beb1-d7a3aeba7dbd"), 
     ]

export class InscripcionRepository implements Repository <Inscripcion> {
    public findAll(): Inscripcion[] | undefined {
        return inscripciones;
    }
    public findOne(item: { id: string; }): Inscripcion | undefined {
        return inscripciones.find((inscripcion)=> inscripcion.id === item.id)
    }
    public add(item: Inscripcion): Inscripcion | undefined {
        inscripciones.push(item);
        return item;
    }
    public update(item: Inscripcion): Inscripcion | undefined {
        const inscripcionIndx = inscripciones.findIndex((inscripcion)=> inscripcion.id === item.id)
        if (inscripcionIndx !== -1){
            Object.assign(inscripciones[inscripcionIndx], item)
        }
        return inscripciones[inscripcionIndx]
    }
    public delete(item: { id: string; }): Inscripcion | undefined {
        const inscripcionIndx = inscripciones.findIndex((inscripcion)=> inscripcion.id === item.id)
        if (inscripcionIndx !== -1){
            const deletedInscripcion = inscripciones[inscripcionIndx]
            inscripciones.splice(inscripcionIndx, 1)[0]
            return deletedInscripcion     
        }
    }
}