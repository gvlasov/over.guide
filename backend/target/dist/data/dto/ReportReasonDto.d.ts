import ReportReasonId from "data/ReportReasonId";
export default interface ReportReasonDto {
    readonly id: ReportReasonId;
    readonly name: string;
    readonly label: string;
    readonly dataName: string;
    readonly description: string;
}
