import PostTypeId from "data/PostTypeId";

export default interface PunishmentTypeDto {
    readonly id: number
    readonly labelFormat: string
    readonly postTypeRestriction?: PostTypeId[]
}
