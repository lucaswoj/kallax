// @flow

const React = require('react');
const LazyPromiseArray = require('../LazyPromiseArray');
const PromiseView = require('./PromiseView');

type Props<T> = {
    array: LazyPromiseArray<T>;
    renderElement: (value: T) => React.Element;
}

module.exports = class ArrayView<T> extends React.Component<void, Props<T>, void> {

    render() {
        return <PromiseView
            promise={this.props.array.slice(0, 20)}
            render={(array: Array<T>) => <div>{array.map(this.props.renderElement)}</div>}
        />;
    }

};
