module.exports = function eachAsyncIterator(
        iterator: AsyncIterator<T>,
        callback: (value: T, index: number) => boolean,
        doneCallback: () => void,
        errorCallback: (error: Error) => void,
        index : number = 0
) {
    iterator.next().then((result: {value: T, done: boolean}) => {
        const {value, done} = result;
        if (!done && !callback(value, index)) {
            eachAsyncIterator(iterator, callback, doneCallback, errorCallback, index + 1);
        } else {
            doneCallback();
        }
    }, errorCallback);
};