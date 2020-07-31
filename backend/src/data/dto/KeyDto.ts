import KeyId from "data/KeyId";

export default interface KeyDto {
    readonly id: KeyId;
    readonly name: string;
    readonly dataName: string;
}
