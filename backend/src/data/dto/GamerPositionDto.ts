export type GamerPositionDataName = 'player' | 'ally' | 'enemy';
export type GamerPositionPlural = 'Players' | 'Allies' | 'Enemies';
export default interface GamerPositionDto {
    readonly id: number;
    readonly dataName: GamerPositionDataName;
    readonly plural: GamerPositionPlural;
}
