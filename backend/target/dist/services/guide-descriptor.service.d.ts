import { GuideDescriptor } from "src/database/models/GuideDescriptor";
import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import { Sequelize } from "sequelize-typescript";
import { ContentHashService } from "src/services/content-hash.service";
export declare class GuideDescriptorService {
    private readonly sequelize;
    private readonly contentHashService;
    constructor(sequelize: Sequelize, contentHashService: ContentHashService);
    isEmpty(dto: GuideDescriptorDto): boolean;
    getExact(dto: GuideDescriptorDto): Promise<GuideDescriptor | null>;
    getIncluding(dto: GuideDescriptorDto): Promise<GuideDescriptor[]>;
    private buildQuery;
    obtainExact(guideDescriptorDto: GuideDescriptorDto): Promise<GuideDescriptor>;
    private static validateAbilitiesCorrespondToHeroes;
    private static buildQueryPart;
    private static validateAbilitiesNumber;
}
