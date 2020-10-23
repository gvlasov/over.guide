import ImmediateActionTypeId from "data/ImmediateActionTypeId";
import ImmediateActionTypeDto from "data/dto/ImmediateActionTypeDto";
import PostTypeId from "data/PostTypeId";

const data = [
    {
        id: ImmediateActionTypeId.DeactivateAllGuides,
        labelFormat: 'Deactivate all guides',
        defenderLabel: 'All your guides are deleted'
    },
    {
        id: ImmediateActionTypeId.DeleteAllGuideComments,
        labelFormat: 'Delete all guide comments',
        defenderLabel: 'All your comments to guides are deleted'
    },
    {
        id: ImmediateActionTypeId.DeactivateGuide,
        labelFormat: 'Deactivate this guide',
        defenderLabel: 'Your guide %s is deactivated',
        postTypeRestriction: [PostTypeId.Guide]
    },
    {
        id: ImmediateActionTypeId.DeleteComment,
        labelFormat: 'Delete this comment',
        defenderLabel: 'Your comment %s is deleted',
        postTypeRestriction: [PostTypeId.Comment]
    },
    {
        id: ImmediateActionTypeId.IgnoreAllCurrentReports,
        labelFormat: 'Ignore all current reports',
        defenderLabel: 'All reports you left are ignored',
    },
    {
        id: ImmediateActionTypeId.BanAccount,
        labelFormat: 'Ban account',
        defenderLabel: 'Your account is banned',
    },
    {
        id: ImmediateActionTypeId.MakeGuidePrivate,
        labelFormat: 'Make guide private',
        defenderLabel: 'Guide %s is changed from public to private',
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
                defenderLabel: d.defenderLabel,
                postTypeRestriction: d.postTypeRestriction,
            }
        )
    }
)
export default map
