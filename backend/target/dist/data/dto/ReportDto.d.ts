import PostTypeId from "data/PostTypeId";
import ReportReasonId from "data/ReportReasonId";
export default interface ReportDto {
    readonly postTypeId: PostTypeId;
    readonly postId: number;
    readonly reportReasonId: ReportReasonId;
}
