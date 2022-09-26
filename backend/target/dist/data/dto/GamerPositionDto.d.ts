export declare type GamerPositionDataName = 'player' | 'teammate' | 'enemy';
export declare type GamerPositionPlural = 'Players' | 'Teammates' | 'Enemies';
export default interface GamerPositionDto {
    readonly id: number;
    readonly dataName: GamerPositionDataName;
    readonly plural: GamerPositionPlural;
}
