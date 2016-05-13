// @flow

/* eslint-disable no-unused-vars */

type AsyncIterator<T> = {
    next: () => Promise<{done: boolean, value: T}>;
}
