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
        const output = [];
        for (let i = 0; i < 20; i++) {
            output.push(<PromiseView promise={this.props.array.get(i)} render={this.props.renderElement} />);
        }
        return <div>{output}</div>;
    }



};
