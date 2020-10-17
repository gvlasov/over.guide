export type InfiniteHandlerState = {
    complete: () => void,
    error: () => void,
    loaded: () => void,
    reset: () => void
};
