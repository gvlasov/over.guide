import { Sequelize } from "sequelize-typescript";
import ReportQueryDto from "data/dto/ReportQueryDto";
import ReportPageDto from "data/dto/ReportPageDto";
export declare class ReportSearchService {
    private readonly sequelize;
    private static pageSize;
    constructor(sequelize: Sequelize);
    search(query: ReportQueryDto): Promise<ReportPageDto>;
}
