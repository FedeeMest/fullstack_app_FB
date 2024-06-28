import { Repository } from '../shared/repository.js';
import { Horario } from '../comisiones/horario.entity.js'

const horarios = [
    new Horario ("lunes",18,"matematica","a02b9bb1-3769-4221-beb1-d7a3aeba7dad"),
    new Horario ("martes",20,"lengia","a02b91bc-3769-4221-beb1-beb1aeba7dad")
]


export class HorarioRepository implements Repository<Horario> {
    
    public findAll(): Horario[] | undefined {
        return horarios;
    }

    public findOne(item: {id: string}): Horario | undefined {
        return horarios.find((horario) => horario.id === item.id);
    }

    public add(item: Horario): Horario | undefined {
        horarios.push(item);
        return item;
    }
    public update(item: Horario): Horario | undefined {
        const finalIndx = horarios.findIndex((horario) => horario.id === item.id);
        if (finalIndx !== -1) {
        Object.assign(horarios[finalIndx], item);
        }
        return horarios[finalIndx];
        
    }

    public delete(item: {id: string}): Horario  | undefined {
        const finalIndx = horarios.findIndex((horario) => horario.id === item.id);

        if (finalIndx !== -1) {
            const deletedFinal = horarios[finalIndx];
            horarios.splice(finalIndx, 1)[0];
            return deletedFinal
        }
    }
}
