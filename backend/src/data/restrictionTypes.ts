import RestrictionTypeId from "data/RestrictionTypeId";
import RestrictionTypeDto from "data/dto/RestrictionTypeDto";
import PostTypeId from "data/PostTypeId";

const data = [
    {
        id: RestrictionTypeId.GuideCreationBan,
        labelFormat: 'Forbid creating guides',
        defenderLabel: 'You can\'t create guides'
    },
    {
        id: RestrictionTypeId.ForceGuidePrivate,
        labelFormat: 'Force private on this guide',
        defenderLabel: 'You can\'t make guide %s public',
        postTypeRestriction: [PostTypeId.Guide]
    },
    {
        id: RestrictionTypeId.CommentCreationBan,
        labelFormat: 'Forbid creating comments',
        defenderLabel: 'You can\'t comment',
    },
    {
        id: RestrictionTypeId.ReportingBan,
        labelFormat: 'Forbid reporting',
        defenderLabel: 'You can\'t report offences',
    },
]
const map = new Map<RestrictionTypeId, RestrictionTypeDto>()
data.forEach(
    d => {
        map.set(
            d.id,
            {
                id: d.id,
                labelFormat: d.labelFormat,
                postTypeRestriction: d.postTypeRestriction,
                defenderLabel: d.defenderLabel,
            }
        )
    }
)
export default map
