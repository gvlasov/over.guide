import PostTypeId from "data/PostTypeId";
import ReportReasonId from "data/ReportReasonId";
import UserDto from "data/dto/UserDto";
import {ExistingGuideHeadDto} from "data/dto/GuideHeadDto";
import AliveCommentReadDto from "data/dto/AliveCommentReadDto";
import SentenceReadDto from "data/dto/SentenceReadDto";

export default interface ReportReadDto {
    readonly id: number
    readonly postTypeId: PostTypeId
    readonly postId: number
    readonly reportReasonId: ReportReasonId
    readonly reporter: UserDto
    readonly post: AliveCommentReadDto | ExistingGuideHeadDto
    readonly createdAt: string
    readonly handled: boolean
    readonly sidesStats: {
        accuser: {
            reportsCreatedCount: number
            reportsApprovedCount: number
        }
        defendant: {
            currentSentences: SentenceReadDto[]
            previousSentences: SentenceReadDto[]
        }
    }
}
