import {Inject, Injectable} from '@nestjs/common';
import {Op} from "sequelize";
import {Sequelize} from "sequelize-typescript";
import {SEQUELIZE} from "src/constants";
import ReportQueryDto from "data/dto/ReportQueryDto";
import {Report} from "src/database/models/Report";
import {User} from "src/database/models/User";
import ReportPageDto from "data/dto/ReportPageDto";


@Injectable()
export class ReportSearchService {
    private static pageSize: number = 10

    constructor(
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
    ) {
    }

    async search(query: ReportQueryDto): Promise<ReportPageDto> {
        const nextReports =
            await Report.scope(['defaultScope', 'withContent']).findAll(
                {
                    subQuery: false,
                    include: [
                        {
                            model: User,
                            as: 'reporter',
                        }
                    ],
                    where: {
                        id: {
                            [Op.notIn]: query.clientAlreadyHasReportIds,
                        },
                        handled: 0,
                    },
                    limit: ReportSearchService.pageSize + 1,
                    order: [['createdAt', 'DESC']]
                });
        return {
            reports: nextReports
                .slice(0, ReportSearchService.pageSize)
                .map(report => report.toDto()),
            hasNextPage: nextReports.length > ReportSearchService.pageSize,
        } as ReportPageDto
    }

}
