// @flow

const React = require('react');
const View = require('./View');
const PromiseView = require('./PromiseView');

type Props<T> = {
    ElementView: typeof View;
    value: Array<T>
}

class ArrayView<T> extends View<void, Props<T>, void> {
    render() {
        const ElementView = this.props.ElementView;
        return <div>{
            this.props.value.map((element, i) => {
                return <ElementView key={i} value={element} />;
            })
        }</div>;
    }
}

type PromiseProps<T> = {
    ElementView: typeof View;
    value: (
        Array<T> |
        Array<Promise<T>> |
        Promise<Array<T>> |
        Promise<Array<Promise<T>>>
    )
}

module.exports = class PromiseArrayView<T> extends View<void, PromiseProps<T>, void> {
    render() {
        return <PromiseView value={this.props.value} ResolvedView={ArrayView.bindProps({
            ElementView: PromiseView.bindProps({
                ResolvedView: this.props.ElementView
            })
        })}/>;
    }
};
