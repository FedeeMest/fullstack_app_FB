import { Repository } from "../shared/repository.js";
import { Plan } from "./plan.entity.js";

const planes = [
    new Plan("Plan 2008","a02bbeb1-3769-4221-beb1-d7a3aeba7dad"),
    new Plan("Plan 2023","a02b91bc-3769-4221-beb1-beb1aeba7dad")
]

export class PlanRepository implements Repository<Plan> {

    public findAll(): Plan[] | undefined {
        return planes
    }
    public findOne(item: {id: string}): Plan | undefined {
        return planes.find((plan) => plan.id === item.id);
    }

    public add(item: Plan): Plan | undefined {
        planes.push(item);
        return item;
    }

    public update(item: Plan): Plan | undefined {
        const planIndx = planes.findIndex((plan)=> plan.id === item.id);
        if (planIndx !== -1) {
            Object.assign(planes[planIndx], item);
        }
        return planes[planIndx];
    }


    public delete(item: {id: string}): Plan | undefined {
        const planIndx = planes.findIndex((plan) => plan.id === item.id);

        if (planIndx !== -1) {
            const deletedPlan = planes[planIndx];
            planes.splice(planIndx, 1)[0];
            return deletedPlan
        }
    }
} 