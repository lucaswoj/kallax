const assert = require('assert');
const tap = require('tap');
const observe = require('../../../code/core/util/observe');

tap.test('createObervable', (tap) => {

    tap.test('should observe property changes', (tap) => {

        const object = observe(
            {foo: 'bar'},
            (key) => {
                tap.equal(key, 'foo');
                tap.equal(object.foo, 'baz');
                tap.end();
            }
        );

        object.foo = 'baz';
    });

    tap.test('should observe prototype property changes', (tap) => {

        const object = observe(
            Object.create({foo: 'bar'}),
            (key) => {
                tap.equal(key, 'foo');
                tap.equal(object.foo, 'baz');
                tap.end();
            }
        );

        object.foo = 'baz';
    });

    tap.test('should maintain instanceof compatability', (tap) => {
        class Klass {}
        const object = observe(new Klass());
        assert(object instanceof Klass);
        tap.end();
    });

    tap.end();
});
