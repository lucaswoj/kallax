// @flow

const React = require('react');
const LazyPromiseArray = require('../LazyPromiseArray');
const PromiseView = require('./PromiseView');
const _ = require('lodash');

type Props<T> = {
    value: LazyPromiseArray<T>;
    render: (value: T) => React.Element;
}

module.exports = class ArrayView<T> extends React.Component<void, Props<T>, void> {

    render() {
        const promiseArray: Promise<Array<T>> = Promise.all(_.range(0, 20).map((i) => this.props.value.get(i)));
        return <PromiseView
            value={promiseArray}
            render={(array: Array<T>) => <div>{array.map(this.props.render)}</div>}
        />;
    }

};
