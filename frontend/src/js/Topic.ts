import Hero from "data/dto/Hero";

export default class Topic {
    private readonly parts: Hero[];

    constructor(parts: Hero[]) {
        this.parts = parts;
    }

    toString() {
        return this.parts
            .map(part => 'hero-' + part.dataName)
            .join('_')
    };
}

