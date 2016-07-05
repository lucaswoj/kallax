// @flow

const AsyncArray = require('../../../code/core/util/AsyncArray');
const assert = require('assert');
const {it, describe} = require('mocha');

describe('AsyncArray', () => {
    it('should fetch items', (callback) => {
        const array = createAsyncArray(({times}) => times);

        array.fetchValues(0, 3, (error: ?Error, values: Array<number>) => {
            assert(!error);
            assert.deepEqual(values, [1, 2, 3]);
            callback();
        });
    });

    it('should fetch items once', (callback) => {
        const array = createAsyncArray(({times}) => times);

        array.fetchValues(0, 3, (error: ?Error, values: Array<number>) => {
            assert(!error);
            assert.deepEqual(values, [1, 2, 3]);

            array.fetchValues(0, 3, (error: ?Error, values: Array<number>) => {
                assert(!error);
                assert.deepEqual(values, [1, 2, 3]);
                callback();
            });
        });
    });

    it('should refetch items after a refresh', (callback) => {
        const array = createAsyncArray(({fetchTimes, fetchFetchTimes}) => {
            return fetchFetchTimes * 10 + fetchTimes;
        });

        array.fetchValues(0, 3, (error: ?Error, values: Array<number>) => {
            assert(!error);
            assert.deepEqual([11, 12, 13], values);
            array.refresh();

            array.fetchValues(0, 3, (error: ?Error, values: Array<number>) => {
                assert(!error);
                assert.deepEqual([21, 22, 23], values);
                callback();
            });
        });
    });
});

function createAsyncArray(createValue) {
    let fetchFetchTimes = 0;
    let times = 0;
    return new AsyncArray((callback) => {
        fetchFetchTimes++;
        let fetchTimes = 0;
        callback(null, (index, callback) => {
            fetchTimes++;
            times++;
            setTimeout(((options) => {
                callback(null, createValue(options));
            }).bind(this, {fetchFetchTimes, fetchTimes, times, index}));
        });
    });
}
