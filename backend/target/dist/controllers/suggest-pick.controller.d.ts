import { SuggestPickService } from "src/services/suggest-pick.service";
import PickContextDto from "data/dto/PickContextDto";
export declare class SuggestPickController {
    private readonly service;
    constructor(service: SuggestPickService);
    evaluate(context: PickContextDto): import("../data/dto/AlternativeDto").default[];
}
