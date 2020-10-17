import ReportReadDto from "data/dto/ReportReadDto";

export default interface ReportPageDto {
    reports: ReportReadDto[]
    hasNextPage: boolean
}
