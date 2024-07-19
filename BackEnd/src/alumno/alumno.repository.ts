import { Repository} from "../shared/repository.js";
import { Alumno } from "./alumno.entity.js";

const alumnos = [ 
    new Alumno("Juan", "Perez", "2002", "juancitoperez@gmail.com","salta 1234", "14/08/2000","a02b9bb1-3769-4221-beb1-d7a3aeba7dad"), 
    new Alumno("Raul", "Lopez", "2004", "raullopez@gmail.com","dorrego 1234", "28/02/2004","a02b91bc-3769-4221-beb1-beb1aeba7dad"), 
    new Alumno("Pedro", "Gomez", "2003", "gomezzpedro@gmail.com","santiago 1414", "24/01/1998","beb191bc-3769-4221-beb1-d7a3aeba7dad")
     ]

export class AlumnoRepository implements Repository <Alumno> {
    public findAll(): Alumno[] | undefined {
        return alumnos;
    }
    public findOne(item: { id: string; }): Alumno | undefined {
        return alumnos.find((alumno)=> alumno.id === item.id)
    }
    public add(item: Alumno): Alumno | undefined {
        alumnos.push(item);
        return item;
    }
    public update(item: Alumno): Alumno | undefined {
        const alumnoIndx = alumnos.findIndex((alumno)=> alumno.id === item.id)
        if (alumnoIndx !== -1){
            Object.assign(alumnos[alumnoIndx], item)
        }
        return alumnos[alumnoIndx]
    }
    public delete(item: { id: string; }): Alumno | undefined {
        const alumnoIndx = alumnos.findIndex((alumno)=> alumno.id === item.id)
        if (alumnoIndx !== -1){
            const deletedAlumno = alumnos[alumnoIndx]
            alumnos.splice(alumnoIndx, 1)[0]
            return deletedAlumno        
        }
    }
}