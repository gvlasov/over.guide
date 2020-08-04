import GamerPositionDto from "data/dto/GamerPositionDto";
import GamerPositionId from "data/GamerPositionId";

const data = [
    {
        id: GamerPositionId.Players,
        dataName: 'player',
        plural: 'Players',
    },
    {
        id: GamerPositionId.Allies,
        dataName: 'ally',
        plural: 'Allies',
    },
    {
        id: GamerPositionId.Enemies,
        dataName: 'enemy',
        plural: 'Enemies',
    },
]
const map = new Map<GamerPositionId, GamerPositionDto>()
data.forEach(
    d => {
        map.set(
            d.id,
            {
                id: d.id,
                dataName: d.dataName,
                plural: d.plural,
            } as GamerPositionDto
        )
    }
)
export default map
