import ThematicTagDto from "data/dto/ThematicTagDto";
import GuideTheme from "data/GuideTheme";

const data = [
    {
        id: GuideTheme.Psychology,
        name: 'Psychology',
        dataName: 'psychology'
    },
    {
        id: GuideTheme["Workshop training"],
        name: 'Workshop training',
        dataName: 'workshop-training',
    },
    {
        id: GuideTheme.Positioning,
        name: 'Positioning',
        dataName: 'positioning',
    },
    {
        id: GuideTheme["Game sense"],
        name: 'Game sense',
        dataName: 'game-sense',
    },
    {
        id: GuideTheme.Communication,
        name: 'Communication',
        dataName: 'communication',
    },
    {
        id: GuideTheme["Target priority"],
        name: 'Target priority',
        dataName: 'target-priority',
    },
    {
        id: GuideTheme.Aim,
        name: 'Aim',
        dataName: 'aim',
    },
    {
        id: GuideTheme.Learning,
        name: 'Learning',
        dataName: 'learning',
    },
    {
        id: GuideTheme.Principle,
        name: 'Principle',
        dataName: 'principle',
    },
    {
        id: GuideTheme.Techinque,
        name: 'Technique',
        dataName: 'technique',
    },
    {
        id: GuideTheme.Roles,
        name: 'Roles',
        dataName: 'Roles',
    },
]
const map = new Map<number, ThematicTagDto>()
data.forEach(
    d => {
        map.set(
            d.id,
            {
                id: d.id,
                name: d.name,
                dataName: d.dataName,
            }
        )
    }
)
export default map
