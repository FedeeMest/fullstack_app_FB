import { Repository} from "../shared/repository.js";
import { Materia } from "./materia.entity.js";

const materias = [ 
    new Materia("1","Matematica",20, "anual"), 
    new Materia("2","Lengua", 10, "anual"), 
    new Materia("3","Biologia",8, "cuatrimestral")
     ]

export class MateriaRepository implements Repository <Materia> {
    public findAll(): Materia[] | undefined {
        return materias;
    }
    public findOne(item: { id: string; }): Materia | undefined {
        return materias.find((materia)=> materia.id_materia === item.id)
    }
    public add(item: Materia): Materia | undefined {
        materias.push(item);
        return item;
    }
    public update(item: Materia): Materia | undefined {
        const materiaIndx = materias.findIndex((materia)=> materia.id_materia === item.id_materia)
        if (materiaIndx !== -1){
            Object.assign(materias[materiaIndx], item)
        }
        return materias[materiaIndx]
    }
    public delete(item: { id: string; }): Materia | undefined {
        const materiaIndx = materias.findIndex((materia)=> materia.id_materia === item.id)
        if (materiaIndx !== -1){
            const deletedMateria = materias[materiaIndx]
            materias.splice(materiaIndx, 1)[0]
            return deletedMateria        
        }
    }
}