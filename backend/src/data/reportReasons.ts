import ReportReasonId from "data/ReportReasonId";
import ReportReasonDto from "data/dto/ReportReasonDto";

const data = [
    {
        id: ReportReasonId.Spam,
        name: 'Spam',
        label: 'spam',
        dataName: 'spam',
        description: 'Exists only to promote product or service',
    },
    {
        id: ReportReasonId.NotEducational,
        name: 'Not educational',
        label: 'not educationial',
        dataName: 'not-educational',
        description: 'Doesn\'t contain any demonstrative examples and/or explanations',
    },
    {
        id: ReportReasonId.OffensiveLanguage,
        name: 'Offensive language',
        label: 'rude or abusive',
        dataName: 'offensive-language',
        description: 'Is unnecessarily offensive',
    },
]
const map = new Map<ReportReasonId, ReportReasonDto>()
data.forEach(
    d => {
        map.set(
            d.id,
            {
                id: d.id,
                name: d.name,
                label: d.label,
                dataName: d.dataName,
                description: d.description,
            }
        )
    }
)
export default map
