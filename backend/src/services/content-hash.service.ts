import {Injectable} from '@nestjs/common';

@Injectable()
export class ContentHashService {

    private crypto = require('crypto')

    hash<T>(contentCarrier: T, strip: (T) => any = () => {
    }): string {
        const carrierCopy = Object.assign({}, contentCarrier);
        strip(carrierCopy)
        return this.crypto.createHash('sha1').update(JSON.stringify(carrierCopy)).digest('base64');
    }

}
