// @flow

const {describe, it} = require('mocha');
const assert = require('assert');
const LazyPromiseArray = require('../code/LazyPromiseArray');
const sinon = require('sinon');

describe('LazyPromiseArray', () => {

    describe('get', () => {

        function create() {
            return new LazyPromiseArray((j) => ({
                get: (i) => Promise.resolve(j + i),
                getLength: () => Promise.resolve(0)
            }));
        }

        it('should return the correct value', (callback) => {
            const array = create();

            array.get(1).then((value) => {
                assert.equal(value, 1);
                callback();
            });
        });

        it('should return refreshed the correct value', () => {
            const array = create();

            array.refresh();

            array.get(1).then((value) => {
                assert.equal(value, 2);
            });
        });

    });

    describe('slice', () => {

        function create() {
            return new LazyPromiseArray(() => ({
                get: (i) => Promise.resolve(i),
                getLength: () => Promise.resolve(5)
            }));
        }

        it('should return the correct value with 0 arguments', (callback) => {
            const array = create();

            array.slice().then((array) => {
                assert.deepEqual(array, [0, 1, 2, 3, 4]);
                callback();
            });
        });

        it('should return the correct value with 1 argument', (callback) => {
            const array = create();

            array.slice(1).then((array) => {
                assert.deepEqual(array, [1, 2, 3, 4]);
                callback();
            });
        });

        it('should return the correct value with 2 arguments', (callback) => {
            const array = create();

            array.slice(1, 4).then((array) => {
                assert.deepEqual(array, [1, 2, 3]);
                callback();
            });
        });

        it('should not call "hard refresh" function before first "get"', () => {
            const refresh = sinon.spy(() => ({
                get: () => Promise.resolve(null),
                getLength: () => Promise.resolve(0)
            }));
            const array = new LazyPromiseArray(refresh);

            array.slice();
            assert.equal(refresh.callCount, 0);
        });

    });

    describe('length', () => {

        function create() {
            return new LazyPromiseArray((j) => ({
                get: () => Promise.resolve(0),
                getLength: () => Promise.resolve(j)
            }));
        }

        it('should return length', () => {
            const array = create();
            array.length.then((value) => {
                assert.equal(value, 0);
            });
        });

        it('should return refreshed length', () => {
            const array = create();
            array.refresh();
            array.length.then((value) => {
                assert.equal(value, 1);
            });
        });

    });

    describe('refresh', () => {

        it('should fire the refresh event', (callback) => {
            const array = new LazyPromiseArray(() => ({
                get: () => Promise.resolve(null),
                getLength: () => Promise.resolve(0)
            }));

            array.on('refresh', callback);
            array.refresh();
        });

        it('should not call "hard refresh" function before first "get"', () => {
            const refresh = sinon.spy(() => ({
                get: () => Promise.resolve(null),
                getLength: () => Promise.resolve(0)
            }));
            const array = new LazyPromiseArray(refresh);

            array.refresh();
            assert.equal(refresh.callCount, 0);
        });

        it('should call "hard refresh" function once per refresh access', () => {
            const refresh = sinon.spy(() => ({
                get: () => Promise.resolve(null),
                getLength: () => Promise.resolve(0)
            }));
            const array = new LazyPromiseArray(refresh);

            array.get(1);
            array.refresh();
            array.get(1);

            assert.equal(refresh.callCount, 2);
        });

        it('should call "get" function once per index per refresh', () => {
            const get = sinon.spy(() => Promise.resolve(null));
            const array = new LazyPromiseArray(() => ({
                get: get,
                getLength: () => Promise.resolve(0)
            }));

            array.get(1);
            array.get(1);
            array.refresh();
            array.get(1);
            array.get(1);

            assert.equal(get.callCount, 2);
        });

        it('should call "getLength" function once per refresh', () => {
            const length = Promise.resolve(0);
            const getLength = sinon.spy(() => length);
            const array = new LazyPromiseArray(() => ({
                get: () => Promise.resolve(null),
                getLength: getLength
            }));

            assert.equal(array.length, length);
            assert.equal(array.length, length);
            array.refresh();
            assert.equal(array.length, length);
            assert.equal(array.length, length);
            assert.equal(getLength.callCount, 2);
        });

    });

});
