// @flow

const Async = require('async');

type FetchFetchValue<T> = (callback: Callback<FetchValue<T>>) => void;
type FetchValue<T> = (index: number, callback: Callback<T>) => void;

class AsyncArray<T> {

    fetchFetchValue: FetchFetchValue<T>;
    fetchValue: FetchValue<T>;

    constructor(fetchFetchValue: FetchFetchValue<T>) {
        this.fetchFetchValue = Async.memoize(fetchFetchValue.bind(this));
        this.fetchValue = Async.memoize(this.fetchValue.bind(this));
        this.refresh();
    }

    fetchValue(index: number, callback: Callback<T>) {
        this.fetchFetchValue((error, fetchValue) => {
            if (error) callback(error, (null: any));
            fetchValue(index, callback);
        });
    }

    refresh() {
        this.fetchFetchValue = Async.memoize(this.fetchFetchValue.unmemoized);
        this.fetchValue = Async.memoize(this.fetchValue.unmemoized);
    }

    fetchValues(index: number, length: number, callback: Callback<Array<T>>) {
        Async.times(
            length - index,
            (indexOffset, callback) => this.fetchValue(index + indexOffset, callback),
            callback
        );
    }

    // TODO: streamingFetchValues

}

module.exports = AsyncArray;
