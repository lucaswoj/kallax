// @flow

const React = require('react');
const View = require('./View');
const PromiseView = require('./PromiseView');
const _ = require('lodash');

const MAX_LENGTH = 200;

type Props<T> = {
    ElementView: typeof View;
    value: Array<T>
}

class ArrayView<T> extends View<void, Props<T>, void> {
    render() {
        const length = Math.min(this.props.value.length, MAX_LENGTH);
        const ElementView = this.props.ElementView;
        return <div>{
            _.range(0, length).map((i) => {
                return <ElementView key={i} value={this.props.value[i]} />;
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
        return <PromiseView
            value={this.props.value}
            ResolvedView={ArrayView.bindProps({
                ElementView: PromiseView.bindProps({
                    ResolvedView: this.props.ElementView
                })
            })
        } />;
    }
};
