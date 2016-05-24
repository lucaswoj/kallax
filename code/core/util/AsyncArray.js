const _ = require('lodash');

class AsyncArray<T> {

    getValuePromise: (index: number) => Promise<T>;
    lengthPromise: Promise<number>;

    constructor(getValuePromise: (index: number) => Promise<T>, lengthPromise: Promise<number>) {
        this.getValuePromise = getValuePromise;
        this.lengthPromise = lengthPromise;
    }

    fetch(fetchLength: number, callback: (error: Error, values: Array<T>, done: boolean) => boolean) {
        const values = [];

        this.lengthPromise.then((length) => {
            fetchLength = Math.min(fetchLength, length);
            let fetchLengthRemaining = fetchLength;
            _.times(fetchLength, (index) => {
                this.getValuePromise(index).then((value: GitHubIssue) => {
                    values[index] = value;
                    callback(null, values, --fetchLengthRemaining > 0);
                }, callback);
            });
        });
    }
}

module.exports = AsyncArray;
