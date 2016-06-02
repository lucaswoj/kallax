const observe = require('../../../code/core/util/observe');
const assert = require('assert');

describe('createObervable', () => {

    it('should observe property changes', () => {

        const object = observe(
            {foo: 'bar'},
            (key) => {
                assert.equal(key, 'foo');
                assert.equal(object.foo, 'baz');

            }
        );

        object.foo = 'baz';
    });

    it('should observe prototype property changes', () => {

        const object = observe(
            Object.create({foo: 'bar'}),
            (key) => {
                assert.equal(key, 'foo');
                assert.equal(object.foo, 'baz');

            }
        );

        object.foo = 'baz';
    });

    it('should maintain instanceof compatability', () => {
        class Klass {}
        const object = observe(new Klass());
        assert(object instanceof Klass);

    });

});

describe('async', (callback) => {
    setTimeout(callback, 1000);
});
