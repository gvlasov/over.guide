import PostTypeId from "data/PostTypeId";
import ReportReadDto from "data/dto/ReportReadDto";
import ReportReasonId from "data/ReportReasonId";
import UserVso from "@/ts/vso/UserVso";
import CommentVso from "@/ts/vso/CommentVso";
import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import {ExistingGuideHeadDto} from "data/dto/GuideHeadDto";
import {CommentReadDto} from "data/dto/CommentReadDto";
import PunishmentTypeDto from "data/dto/PunishmentTypeDto";

export default class ReportReadVso {
    readonly id: number
    readonly postTypeId: PostTypeId
    readonly postId: number
    readonly reportReasonId: ReportReasonId
    readonly createdAt: Date
    readonly reporter: UserVso;
    readonly post: CommentVso | ExistingGuideHeadVso
    handled: boolean

    constructor(dto: ReportReadDto) {
        this.id = dto.id
        this.postTypeId = dto.postTypeId
        this.postId = dto.postId
        this.reportReasonId = dto.reportReasonId
        this.createdAt = new Date(dto.createdAt)
        this.reporter = new UserVso(dto.reporter)
        this.handled = dto.handled
        if (dto.postTypeId === PostTypeId.Guide) {
            this.post = new ExistingGuideHeadVso(dto.post as ExistingGuideHeadDto)
        } else if (dto.postTypeId === PostTypeId.Comment) {
            this.post = new CommentVso(dto.post as CommentReadDto, [])
        } else {
            throw new Error(`Unsupported post type ${this.postTypeId}`)
        }
    }

    get defendant(): UserVso {
        if (this.postTypeId === PostTypeId.Guide) {
            return (this.post as ExistingGuideHeadVso).entry.author
        } else if (this.postTypeId === PostTypeId.Comment) {
            return (this.post as CommentVso).author;
        } else {
            throw new Error(`Unsupported post type ${this.postTypeId}`)
        }
    }

    canApply(punishmentType: PunishmentTypeDto) {
        const postTypeIds = punishmentType.postTypeRestriction;
        return postTypeIds === void 0 || postTypeIds.includes(this.postTypeId)
    }

}
