import {ModuleRef} from "@nestjs/core";
import {User} from "src/database/models/User";
import {GuideHead} from "src/database/models/GuideHead";
import {Report} from "src/database/models/Report";
import {Comment} from "src/database/models/Comment";
import PostTypeId from "data/PostTypeId";
import reportReasons from 'data/reportReasons'

export default async (moduleRef: ModuleRef) => {
    const reporter = await User.findOne()
    await GuideHead.findAll()
        .then(heads =>
            heads.map(h =>
                Report.create({
                    postId: h.guideId,
                    postTypeId: PostTypeId.Guide,
                    reporterId: reporter.id,
                    reportReasonId: reportReasons.get(h.guideId % reportReasons.size).id,
                    handled: 0,
                })
            )
        )
    await Comment.findAll()
        .then(heads =>
            heads.map(c =>
                Report.create({
                    postId: c.id,
                    postTypeId: PostTypeId.Comment,
                    reporterId: reporter.id,
                    reportReasonId: reportReasons.get(c.id % reportReasons.size).id,
                    handled: 0,
                })
            )
        )
}