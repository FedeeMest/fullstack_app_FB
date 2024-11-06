import { PrimaryKey } from "@mikro-orm/core";

export abstract class BaseEntity {
    @PrimaryKey()
    id?: number;

    /*
    @Property({type: 'dateTimeType'})
    createdAt = new Date();
    @Property({type: 'dateTimeType', onUpdate: () => new Date()})
    
    */
}
