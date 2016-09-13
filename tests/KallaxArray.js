// @flow

const {describe, it} = require('mocha');
const assert = require('assert');
const KallaxArray = require('../code/KallaxArray');
const sinon = require('sinon');

describe('KallaxArray', () => {

    describe('get', () => {

        function create() {
            return new KallaxArray((j) => ({
                get: (i) => Promise.resolve(j + i),
                length: () => Promise.resolve(3)
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

        it('should not call "hard refresh" function before first "get"', () => {
            const refresh = sinon.spy(() => ({
                get: () => Promise.resolve(null),
                length: () => Promise.resolve(0)
            }));
            const array = new KallaxArray(refresh);

            array.refresh();
            assert.equal(refresh.callCount, 0);
        });

        it('should call "hard refresh" function once per refresh with "get"', () => {
            const refresh = sinon.spy(() => ({
                get: () => Promise.resolve(5),
                length: () => Promise.resolve(0)
            }));
            const array = new KallaxArray(refresh);

            array.get(1);
            array.refresh();
            array.get(1);

            assert.equal(refresh.callCount, 2);
        });

        it('should call internal "get" function once per index per refresh', (callback) => {
            const get = sinon.spy(() => Promise.resolve(5));
            const array = new KallaxArray(() => ({
                get: get,
                length: () => Promise.resolve(3)
            }));

            array.get(1);
            array.get(1).then(() => {
                array.refresh();
                array.get(1);
                array.get(1).then(() => {
                    assert.equal(2, get.callCount);
                    callback();
                });
            });
        });

        describe('out-of-bounds access', () => {
            function test(index, callback) {
                const array = new KallaxArray(() => ({
                    get: () => Promise.resolve(5),
                    length: () => Promise.resolve(1)
                }));
                array.get(index).then(() => assert(false)).catch(() => {
                    callback();
                });
            }

            it('should throw an error for access < 0', (callback) => {
                test(-1, callback);
            });

            it('should throw an error for access > length', (callback) => {
                test(1, callback);
            });
        });

    });

    describe('length', () => {

        function create() {
            return new KallaxArray((j) => ({
                get: () => Promise.resolve(0),
                length: () => Promise.resolve(j)
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

        it('should call "hard refresh" function once per refresh with "length"', () => {
            const refresh = sinon.spy(() => ({
                get: () => Promise.resolve(null),
                length: () => Promise.resolve(0)
            }));
            const array = new KallaxArray(refresh);

            array.length;
            array.refresh();
            array.length;

            assert.equal(refresh.callCount, 2);
        });

        it('should call internal "get length" function once per refresh', () => {
            const length = sinon.spy(() => Promise.resolve(0));
            const array = new KallaxArray(() => ({
                get: () => Promise.resolve(null),
                length: length
            }));

            array.length;
            array.length;
            array.refresh();
            array.length;
            array.length;
            assert.equal(length.callCount, 2);
        });

    });

    describe('refresh', () => {

        it('should fire the change event', (callback) => {
            const array = new KallaxArray(() => ({
                get: () => Promise.resolve(null),
                length: () => Promise.resolve(0)
            }));

            array.on('change', callback);
            array.refresh();
        });

    });

    describe('slice', () => {

        function create() {
            return new KallaxArray(() => ({
                get: (i) => Promise.resolve(i),
                length: () => Promise.resolve(5)
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
                length: () => Promise.resolve(0)
            }));
            const array = new KallaxArray(refresh);

            array.slice();
            assert.equal(refresh.callCount, 0);
        });

    });

});
