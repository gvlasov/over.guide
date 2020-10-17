import {Injectable} from '@nestjs/common';
import {Sentence} from "src/database/models/Sentence";
import ImmediateActionCreateDto from "data/dto/ImmediateActionCreateDto";
import {ImmediateAction} from "src/database/models/ImmediateAction";
import ImmediateActionTypeId from "data/ImmediateActionTypeId";
import {Guide} from "src/database/models/Guide";
import {Comment} from "src/database/models/Comment";
import {User} from "src/database/models/User";
import PostTypeId from "data/PostTypeId";
import {Report} from "src/database/models/Report";


@Injectable()
export class SentenceImmediateActionService {

    constructor() {
    }

    issueActions(
        issuer: User,
        sentence: Sentence,
        actions: ImmediateActionCreateDto[]
    ): Promise<ImmediateAction[]> {
        return Promise.all(
            actions.map(
                dto => {
                    let promise
                    if (dto.typeId === ImmediateActionTypeId.DeactivateAllGuides) {
                        promise = this.deactivateAllGuides(issuer, sentence)
                    } else if (dto.typeId === ImmediateActionTypeId.DeactivateGuide) {
                        promise = this.deactivateGuide(sentence, dto)
                    } else if (dto.typeId === ImmediateActionTypeId.DeleteAllGuideComments) {
                        promise = this.deleteAllGuideComments(sentence)
                    } else if (dto.typeId === ImmediateActionTypeId.DeleteComment) {
                        promise = this.deleteComment(sentence, dto)
                    } else if (dto.typeId === ImmediateActionTypeId.IgnoreAllCurrentReports) {
                        promise = this.ignoreAllCurrentReports(sentence)
                    } else if (dto.typeId === ImmediateActionTypeId.BanAccount) {
                        promise = this.banAccount(sentence)
                    } else if (dto.typeId === ImmediateActionTypeId.MakeGuidePrivate) {
                        promise = this.makeGuidePrivate(sentence, dto)
                    } else {
                        throw new Error('Unknown action type')
                    }
                    return promise
                        .then(success => {
                            if (success) {
                                return dto
                            } else {
                                return null
                            }
                        })
                }
            )
        )
            .then(dtos => {
                return ImmediateAction.bulkCreate(
                    dtos
                        .filter(dto => dto !== null)
                        .map(dto => {
                            return {
                                ...dto,
                                sentenceId: sentence.id,
                            }
                        })
                )
            })
            .then(() => void 0)
    }

    private deactivateAllGuides(issuer: User, sentence: Sentence): Promise<boolean> {
        return Guide.update(
            {
                deactivatedById: issuer.id,
                deactivatedAt: new Date().toISOString(),
            },
            {
                where: {
                    authorId: sentence.defenderId,
                    deactivatedById: null,
                    deactivatedAt: null,
                },
            }
        )
            .then(() =>
                Guide.findAll({
                    where: {
                        authorId: sentence.defenderId,
                    },
                    paranoid: false,
                })
            )
            .then(guides =>
                Report.update(
                    {
                        handled: 1,
                    },
                    {
                        where: {
                            postTypeId: PostTypeId.Guide,
                            postId: guides.map(g => g.id),
                            handled: 0,
                        },
                    }
                )
            )
            .then(() => true)
    }

    private deactivateGuide(sentence: Sentence, dto: ImmediateActionCreateDto): Promise<boolean> {
        return Guide.update(
            {
                deactivatedById: sentence.judgeId,
                deactivatedAt: new Date().toISOString(),
            },
            {
                where: {
                    authorId: sentence.defenderId,
                    id: dto.objectId,
                },
            }
        )
            .then(
                (guideUpdateResult) => {
                    return Report.update(
                        {
                            handled: 1,
                        },
                        {
                            where: {
                                postTypeId: PostTypeId.Guide,
                                postId: dto.objectId,
                                handled: 0,
                            }
                        }
                    )
                        .then(() => guideUpdateResult)
                }
            )
            .then(result => result[0] === 1)
    }

    private deleteAllGuideComments(sentence: Sentence): Promise<boolean> {
        return Comment.update(
            {
                deactivatedById: sentence.judgeId,
                deactivatedAt: new Date().toISOString()
            },
            {
                where: {
                    postType: PostTypeId.Guide,
                    authorId: sentence.defenderId,
                    deactivatedById: null,
                    deactivatedAt: null,
                }
            }
        )
            .then(() =>
                Comment.findAll({
                    where: {
                        postType: PostTypeId.Guide,
                        authorId: sentence.defenderId,
                    }
                })
            )
            .then(comments => {
                Report.update(
                    {
                        handled: 1,
                    },
                    {
                        where: {
                            postTypeId: PostTypeId.Comment,
                            postId: comments.map(c => c.id),
                            handled: 0,
                        }
                    }
                )
            })
            .then(() => true)
    }

    private deleteComment(sentence: Sentence, dto: ImmediateActionCreateDto): Promise<boolean> {
        return Comment.update(
            {
                deactivatedById: sentence.judgeId,
                deactivatedAt: new Date().toISOString()
            },
            {
                where: {
                    id: dto.objectId,
                    authorId: sentence.defenderId,
                    deactivatedById: null,
                    deactivatedAt: null,
                }
            }
        )
            .then((result) => {
                    if (result[0] === 1) {
                        return Report.update(
                            {
                                handled: 1,
                            },
                            {
                                where: {
                                    postTypeId: PostTypeId.Comment,
                                    postId: dto.objectId,
                                    handled: 0,
                                }
                            }
                        )
                            .then(() => result)
                    } else {
                        return new Promise((resolve) => {resolve(result)})
                    }
                }
            )
            .then(result => result[0] === 1)
    }

    private ignoreAllCurrentReports(sentence: Sentence): Promise<boolean> {
        return Report.update(
            {
                handled: 1,
            },
            {
                where: {
                    reporterId: sentence.defenderId,
                    handled: 0,
                }
            }
        )
            .then(() => true)
    }

    private banAccount(sentence: Sentence): Promise<boolean> {
        return User.update(
            {
                banned: 1,
            },
            {
                where: {
                    banned: 0,
                    id: sentence.defenderId,
                }
            }
        )
            .then(result => result[0] === 1)
    }

    private makeGuidePrivate(sentence: Sentence, dto: ImmediateActionCreateDto): Promise<boolean> {
        return Guide.update(
            {
                isPublic: 0
            },
            {
                where: {
                    id: dto.objectId,
                    authorId: sentence.defenderId,
                }
            }
        )
            .then(result => result[0] === 1)
    }
}
