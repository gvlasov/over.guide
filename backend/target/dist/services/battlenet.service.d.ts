import { HttpService } from '@nestjs/common';
export declare class BattlenetService {
    private readonly httpService;
    private querystring;
    constructor(httpService: HttpService);
    obtainToken(code: string): Promise<string>;
    userInfo(token: string): Promise<any>;
}
