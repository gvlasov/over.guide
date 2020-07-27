import ThematicTagDto from "data/dto/ThematicTagDto";

const data = [
    {
        id: 1,
        name: 'Psychology',
        dataName: 'psychology'
    },
    {
        id: 2,
        name: 'Workshop training',
        dataName: 'workshop-training',
    },
    {
        id: 3,
        name: 'Positioning',
        dataName: 'positioning',
    },
    {
        id: 4,
        name: 'Game sense',
        dataName: 'game-sense',
    },
    {
        id: 5,
        name: 'Communication',
        dataName: 'communication',
    },
    {
        id: 6,
        name: 'Target priority',
        dataName: 'target-priority',
    },
    {
        id: 7,
        name: 'Aim',
        dataName: 'aim',
    },
]
const map = new Map<string, ThematicTagDto>()
data.forEach(
    d => {
        map.set(
            d.dataName,
            {
                id: d.id,
                name: d.name,
                dataName: d.dataName,
            }
        )
    }
)
export default map
