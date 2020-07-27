import MapDto from "data/dto/MapDto";
import MapType from "data/MapType";
import MapName from "data/MapName";

const data = [
    {
        id: 1,
        name: 'Busan',
        dataName: 'busan',
        type: MapType.Control,
    },
    {
        id: 2,
        name: 'Ilios',
        dataName: 'ilios',
        type: MapType.Control
    },
    {
        id: 3,
        name: 'Lijang Tower',
        dataName: 'lijang-tower',
        type: MapType.Control,
    },
    {
        id: 4,
        name: 'Nepal',
        dataName: 'nepal',
        type: MapType.Control,
    },
    {
        id: 5,
        name: 'Oasis',
        dataName: 'oasis',
        type: MapType.Control,
    },
    {
        id: 6,
        name: 'Hanamura',
        dataName: 'hanamura',
        type: MapType.Assault,
    },
    {
        id: 7,
        name: 'Horizon Lunar Colony',
        dataName: 'horizon-lunar-colony',
        type: MapType.Assault,
    },
    {
        id: 8,
        name: 'Paris',
        dataName: 'paris',
        type: MapType.Assault,
    },
    {
        id: 9,
        name: 'Temple of Anubis',
        dataName: 'temple-of-anubis',
        type: MapType.Assault,
    },
    {
        id: 10,
        name: 'Volskaya Industries',
        dataName: 'volskaya-industries',
        type: MapType.Assault,
    },
    {
        id: 11,
        name: 'Dorado',
        dataName: 'dorado',
        type: MapType.Escort,
    },
    {
        id: 12,
        name: 'Havana',
        dataName: 'havana',
        type: MapType.Escort,
    },
    {
        id: 13,
        name: 'Junkertown',
        dataName: 'junkertown',
        type: MapType.Escort,
    },
    {
        id: 14,
        name: 'Rialto',
        dataName: 'rialto',
        type: MapType.Escort,
    },
    {
        id: 15,
        name: 'Route 66',
        dataName: 'route-66',
        type: MapType.Escort,
    },
    {
        id: 16,
        name: 'Watchpoint: Gibraltar',
        dataName: 'watchpoint-gibraltar',
        type: MapType.Escort,
    },
    {
        id: 17,
        name: 'Blizzard World',
        dataName: 'blizzard-world',
        type: MapType.Hybrid,
    },
    {
        id: 18,
        name: 'Eichenwalde',
        dataName: 'eichenwalde',
        type: MapType.Hybrid,
    },
    {
        id: 19,
        name: 'Hollywood',
        dataName: 'hollywood',
        type: MapType.Hybrid,
    },
    {
        id: 20,
        name: 'King\'s Row',
        dataName: 'kings-row',
        type: MapType.Hybrid,
    },
    {
        id: 21,
        name: 'Numbani',
        dataName: 'numbani',
        type: MapType.Hybrid,
    },
]
const map = new Map<string, MapDto>()
data.forEach(
    d => {
        map.set(
            d.dataName,
            {
                id: d.id,
                name: d.name as MapName,
                dataName: d.dataName,
                type: d.type
            }
        )
    }
)
export default map
