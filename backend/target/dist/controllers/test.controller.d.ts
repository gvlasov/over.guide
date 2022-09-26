import PickContextDto from "data/dto/PickContextDto";
import { TokenService } from "src/services/token.service";
export declare class TestController {
    private readonly service;
    constructor(service: TokenService);
    test(context: PickContextDto): string;
}
