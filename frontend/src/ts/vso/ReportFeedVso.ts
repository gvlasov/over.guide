import FeedVso from "@/ts/vso/FeedVso";
import ReportReadDto from "data/dto/ReportReadDto";
import ReportReadVso from "@/ts/vso/ReportReadVso";
import ReportPageDto from "data/dto/ReportPageDto";
import Backend from "@/ts/Backend";

export default class ReportFeedVso extends FeedVso<ReportReadDto, ReportReadVso, ReportPageDto> {

    dto2Vso(dto: ReportReadDto) {
        return new ReportReadVso(dto)
    }

    vsoId(vso: ReportReadVso): number {
        return vso.id
    }

    get unhandledReports(): ReportReadVso[] {
        return this.items.filter(report => !report.handled)
    }

    get feed(): (ids: number[]) => Promise<ReportPageDto> {
        return (ids: number[]) => {
            return Backend.instance.searchReportsPaginated(ids)
        }
    }

}
