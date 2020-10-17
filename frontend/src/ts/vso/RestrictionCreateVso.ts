import RestrictionTypeId from "data/RestrictionTypeId";
import RestrictionTypeDto from "data/dto/RestrictionTypeDto";
import restrictionTypes from 'data/restrictionTypes.ts'
import RestrictionCreateDto from "data/dto/RestrictionCreateDto";

export default class RestrictionCreateVso {

    public typeId: RestrictionTypeId;
    private readonly objectId: number | null;
    public durationDays?: number

    constructor(
        typeId: RestrictionTypeId,
        objectId: number | null,
        durationDays?: number
    ) {
        this.typeId = typeId
        this.objectId = objectId
        this.durationDays = durationDays
    }

    get type(): RestrictionTypeDto {
        const type = restrictionTypes.get(this.typeId);
        if (type === void 0) {
            throw new Error()
        }
        return type
    }

    toDto(): RestrictionCreateDto {
        if (this.durationDays === void 0) {
            throw new Error('durationDays requried')
        }
        const start = new Date()
        const end = new Date(start)
        end.setDate(end.getDate() + this.durationDays)
        return {
            typeId: this.typeId,
            objectId: this.objectId,
            start: start.toISOString(),
            end: end.toISOString(),
        }
    }

}
