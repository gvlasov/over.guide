import {ModuleRef} from "@nestjs/core";
import {User} from "src/database/models/User";
import {GuideHead} from "src/database/models/GuideHead";
import {Comment} from "src/database/models/Comment";
import PostTypeId from "data/PostTypeId";

export default async (moduleRef: ModuleRef) => {
    const contents = [
        'привет',
        'здорово',
        'а как играть на ане',
        'hello',
        'fuck you',
        'cool',
        'what is this guied I dont even',
        'i hate doomfist',
        'i am doomfist',
        'this is a good guide',
        'thanks',
        '1',
    ]
    const commenter = await User.findOne()
    const currentTime = new Date().toISOString()
    await GuideHead.findAll()
        .then(heads =>
            heads.map(async h => {
                    const comments = []
                    const commentCount = h.guideId % 10;
                    for (let i = 0; i < commentCount; i++) {
                        const parentId =
                            comments.length === 0 || Math.random() < 0.3
                                ? null
                                : comments[(h.guideId * 7) % comments.length].id;
                        const deleted = Math.random() < 0.04
                        comments.push(
                            await Comment.create({
                                parentId: parentId,
                                postId: h.guideId,
                                postType: PostTypeId.Guide,
                                content: contents[Math.round((contents.length - 1) * Math.random())],
                                authorId: commenter.id,
                                createdAt: currentTime,
                                updatedAt: currentTime,
                                deactivatedById: deleted ? commenter.id : null,
                                deactivatedAt: deleted ? currentTime : null,
                            })
                        )
                    }
                    return comments
                }
            )
        )
}