import { Repository } from '../shared/repository.js';
import { Final } from './final.entity.js';

const finales = [
    new Final("Matematica", 10,"2021-09-01","a02b9bb1-3769-4221-beb1-d7a3aeba7dad"),
    new Final("Lengua", 8,"2021-09-02","a02b91bc-3769-4221-beb1-beb1aeba7dad"),
    new Final("Historia", 6,"2021-09-03","a02b91bc-3769-4221-beb1-d7a3beb17dad"),
    new Final("Geografia", 4,"2021-09-04","beb191bc-3769-4221-beb1-d7a3aeba7dad"),
    new Final("Biologia", 2,"2021-09-05","a02bbeb1-3769-4221-beb1-d7a3aeba7dad")
]


export class FinalRepository implements Repository<Final> {
    
    public findAll(): Final[] | undefined {
        return finales;
    }

    public findOne(item: {id: string}): Final | undefined {
        return finales.find((final) => final.id === item.id);
    }

    public add(item: Final): Final | undefined {
        finales.push(item);
        return item;
    }
    public update(item: Final): Final | undefined {
        const finalIndx = finales.findIndex((final) => final.id === item.id);
        if (finalIndx !== -1) {
        Object.assign(finales[finalIndx], item);
        }
        return finales[finalIndx];
        
    }

    public delete(item: {id: string}): Final | undefined {
        const finalIndx = finales.findIndex((final) => final.id === item.id);

        if (finalIndx !== -1) {
            const deletedFinal = finales[finalIndx];
            finales.splice(finalIndx, 1)[0];
            return deletedFinal
        }
    }
}