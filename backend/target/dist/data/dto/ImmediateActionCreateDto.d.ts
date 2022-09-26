import ImmediateActionTypeId from "data/ImmediateActionTypeId";
export default interface ImmediateActionCreateDto {
    readonly typeId: ImmediateActionTypeId;
    readonly objectId: number | null;
}
