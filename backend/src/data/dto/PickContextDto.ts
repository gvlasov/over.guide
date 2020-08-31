import MapId from "data/MapId";
import HeroId from "data/HeroId";

interface PickContextDto {
    teammateComp: (HeroId | null)[]
    enemyComp: (HeroId | null)[]
    bans: HeroId[]
    map: MapId | null
}

export default PickContextDto;