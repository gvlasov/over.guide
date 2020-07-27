import HeroDto from "data/dto/HeroDto";

export default class Topic {
    private readonly parts: HeroDto[];

    constructor(parts: HeroDto[]) {
        this.parts = parts;
    }

    toString() {
        return this.parts
            .map(part => 'hero-' + part.dataName)
            .join('_')
    };
}

