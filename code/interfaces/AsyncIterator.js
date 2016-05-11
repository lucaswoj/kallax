// @flow

type AsyncIterator<T> = {
    value: ?T;
    done: boolean;
    next: () => Promise<AsyncIterator<T>>;
}
