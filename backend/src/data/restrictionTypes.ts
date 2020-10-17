import RestrictionTypeId from "data/RestrictionTypeId";
import RestrictionTypeDto from "data/dto/RestrictionTypeDto";
import PostTypeId from "data/PostTypeId";

const data = [
    {
        id: RestrictionTypeId.GuideCreationBan,
        labelFormat: 'Forbid creating guides',
    },
    {
        id: RestrictionTypeId.ForceGuidePrivate,
        labelFormat: 'Force private on this guide',
        postTypeRestriction: [PostTypeId.Guide]
    },
    {
        id: RestrictionTypeId.CommentCreationBan,
        labelFormat: 'Forbid creating comments',
    },
    {
        id: RestrictionTypeId.ReportingBan,
        labelFormat: 'Forbid reporting',
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
            }
        )
    }
)
export default map
