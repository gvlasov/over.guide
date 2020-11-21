import PatchDto from "data/dto/PatchDto";

const data = [
    {
        id: 1,
        name: 'First patch',
        date: '2020-11-21 00:00:00',
    },
]
const map = new Map<number, PatchDto>()
data.forEach(
    d => {
        map.set(
            d.id,
            {
                id: d.id,
                name: d.name,
                date: d.date,
            }
        )
    }
)
export default map
