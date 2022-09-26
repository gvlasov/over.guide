import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
interface DescriptorGeneratorConfig {
    numberOfHeroTags: AmountSpecifier;
    numberOfThematicTags: AmountSpecifier;
    abilitiesPerHero: AmountSpecifier;
}
declare type AmountSpecifier = [number, number] | number;
export default class DescriptorGenerator {
    private readonly config;
    constructor(config: DescriptorGeneratorConfig);
    generate(seed: number): GuideDescriptorDto;
    private getGroupAbilities;
    private resolveAmountSpecifier;
    private splitInto3Buckets;
    private randomIntFromInterval;
}
export {};
