// @flow

const {describe, it} = require('mocha');
const assert = require('assert');
const LazyPromiseArray = require('../code/LazyPromiseArray');
const sinon = require('sinon');

describe('LazyPromiseArray', () => {

    describe('values', () => {

        function create() {
            return new LazyPromiseArray((j) => ({
                get: (i) => Promise.resolve(j + i),
                getLength: () => Promise.resolve(0)
            }));
        }

        it('should return value', (callback) => {
            const array = create();

            array.get(1).then((value) => {
                assert.equal(value, 1);
                callback();
            });
        });

        it('should return refreshed value', () => {
            const array = create();

            array.refresh();

            array.get(1).then((value) => {
                assert.equal(value, 2);
            });
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

    describe('call count', () => {

        it('should not call "refresh" function before first access', () => {
            const refresh = sinon.spy(() => ({
                get: () => Promise.resolve(null),
                getLength: () => Promise.resolve(0)
            }));
            const array = new LazyPromiseArray(refresh);

            array.refresh();
            assert.equal(refresh.callCount, 0);
        });

        it('should call "refresh" function once per refresh with access', () => {
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
