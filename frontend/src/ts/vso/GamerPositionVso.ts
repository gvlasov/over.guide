import GamerPositionDto, {
    GamerPositionDataName,
    GamerPositionPlural
} from "data/dto/GamerPositionDto";
import gamerPositions from 'data/gamerPositions';
import GamerPositionId from "data/GamerPositionId";

export default class GamerPositionVso {

    public static Players = new GamerPositionVso(gamerPositions.get(GamerPositionId.Players) as GamerPositionDto);
    public static Teammates = new GamerPositionVso(gamerPositions.get(GamerPositionId.Teammates) as GamerPositionDto);
    public static Enemies = new GamerPositionVso(gamerPositions.get(GamerPositionId.Enemies) as GamerPositionDto);

    public id: GamerPositionId;
    public dataName: GamerPositionDataName;
    public plural: GamerPositionPlural;

    protected constructor(dto: GamerPositionDto) {
        this.id = dto.id
        this.dataName = dto.dataName
        this.plural = dto.plural
    }

    getPrevious(loop: boolean): GamerPositionVso | null {
        if (this.id === GamerPositionId.Players) {
            if (loop) {
                return GamerPositionVso.Enemies
            } else {
                return null
            }
        } else if (this.id === GamerPositionId.Teammates) {
            return GamerPositionVso.Players
        } else if (this.id === GamerPositionId.Enemies) {
            return GamerPositionVso.Teammates
        } else {
            throw new Error(`Unavailable GamerPositionId ${this.id}`)
        }
    }

    getNext(loop: boolean): GamerPositionVso | null {
        if (this.id === GamerPositionId.Players) {
            return GamerPositionVso.Teammates
        } else if (this.id === GamerPositionId.Teammates) {
            return GamerPositionVso.Enemies
        } else if (this.id === GamerPositionId.Enemies) {
            if (loop) {
                return GamerPositionVso.Players
            } else {
                return null
            }
        } else {
            throw new Error(`Unavailable GamerPositionId ${this.id}`)
        }
    }

    get isPlayer(): boolean {
        return this.id === GamerPositionVso.Players.id;
    }

    get isTeammate(): boolean {
        return this.id === GamerPositionVso.Teammates.id;
    }

    get isEnemy(): boolean {
        return this.id === GamerPositionVso.Enemies.id;
    }

}
