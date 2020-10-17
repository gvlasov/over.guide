import RestrictionTypeId from "data/RestrictionTypeId";

export default interface RestrictionCreateDto {
    readonly typeId: RestrictionTypeId
    readonly objectId: number|null
    readonly start: string
    readonly end: string
}
