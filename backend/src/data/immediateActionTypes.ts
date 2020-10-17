import ImmediateActionTypeId from "data/ImmediateActionTypeId";
import ImmediateActionTypeDto from "data/dto/ImmediateActionTypeDto";
import PostTypeId from "data/PostTypeId";

const data = [
    {
        id: ImmediateActionTypeId.DeactivateAllGuides,
        labelFormat: 'Deactivate all guides',
    },
    {
        id: ImmediateActionTypeId.DeleteAllGuideComments,
        labelFormat: 'Delete all guide comments',
    },
    {
        id: ImmediateActionTypeId.DeactivateGuide,
        labelFormat: 'Deactivate this guide',
        postTypeRestriction: [PostTypeId.Guide]
    },
    {
        id: ImmediateActionTypeId.DeleteComment,
        labelFormat: 'Delete this comment ',
        postTypeRestriction: [PostTypeId.Comment]
    },
    {
        id: ImmediateActionTypeId.IgnoreAllCurrentReports,
        labelFormat: 'Ignore all current reports',
    },
    {
        id: ImmediateActionTypeId.BanAccount,
        labelFormat: 'Ban account',
    },
    {
        id: ImmediateActionTypeId.MakeGuidePrivate,
        labelFormat: 'Make guide private',
        postTypeRestriction: [PostTypeId.Guide]
    },
]
const map = new Map<ImmediateActionTypeId, ImmediateActionTypeDto>()
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
