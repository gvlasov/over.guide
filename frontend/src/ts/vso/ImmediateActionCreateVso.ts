import ImmediateActionCreateDto from "data/dto/ImmediateActionCreateDto";
import ImmediateActionTypeId from "data/ImmediateActionTypeId";
import immediateActionTypes from "data/immediateActionTypes";
import ImmediateActionTypeDto from "data/dto/ImmediateActionTypeDto";

export default class ImmediateActionCreateVso {

    public typeId: ImmediateActionTypeId;
    private objectId: number | null;

    constructor(dto: ImmediateActionCreateDto) {
        this.typeId = dto.typeId
        this.objectId = dto.objectId
    }

    get type(): ImmediateActionTypeDto {
        const type = immediateActionTypes.get(this.typeId);
        if (type === void 0) {
            throw new Error()
        }
        return type
    }

    toDto(): ImmediateActionCreateDto {
        return {
            objectId: this.objectId,
            typeId: this.typeId,
        }
    }

}
