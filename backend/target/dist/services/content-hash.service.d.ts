export declare class ContentHashService {
    private crypto;
    hash<T>(contentCarrier: T, strip?: (T: any) => any): string;
}
