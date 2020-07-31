import KeyId from "data/KeyId";
import KeyDto from "data/dto/KeyDto";

const data = [
    {
        id: KeyId.Space,
        name: 'Space',
        dataName: 'space'
    },
    {
        id: KeyId.E,
        name: 'E',
        dataName: 'e'
    },
    {
        id: KeyId.Q,
        name: 'Q',
        dataName: 'q'
    },
    {
        id: KeyId.Shift,
        name: 'Shift',
        dataName: 'shift'
    },
    {
        id: KeyId.Ctrl,
        name: 'Ctrl',
        dataName: 'ctrl'
    },
    {
        id: KeyId.LMB,
        name: 'LMB',
        dataName: 'lmb'
    },
    {
        id: KeyId.RMB,
        name: 'RMB',
        dataName: 'rmb'
    },
]
const map = new Map<KeyId, KeyDto>()
data.forEach(
    d => {
        const key: KeyDto = {
            id: d.id,
            name: d.name,
            dataName: d.dataName,
        }
        map.set(d.id, key)
    }
)
export default map
