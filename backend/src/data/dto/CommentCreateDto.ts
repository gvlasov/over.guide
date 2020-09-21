import EntityTypeId from "data/EntityTypeId";

export default interface CommentCreateDto {
    readonly parentId: number;
    readonly parentType: EntityTypeId;
    readonly content: string
}
