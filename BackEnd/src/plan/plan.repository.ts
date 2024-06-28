import { Repository } from "../shared/repository";
import { Plan } from "./plan.entity";

const planes = [
    new Plan("Plan 2008", []),
    new Plan("Plan 2023",[])
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