export default interface FeedPortionDto<T> {
    items: T[];
    hasNextPage: boolean;
}
