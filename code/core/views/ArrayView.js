// @flow

const React = require('react');
const View = require('../View');
const ErrorView = require('./ErrorView');
const LoadingView = require('./LoadingView');
const _ = require('lodash');

const MAX_LENGTH = 200;

module.exports = class ArrayView<T> extends View<void, Props<T>, State<T>> {

    constructor(props: Props) {
        super(props);
        this.state = {elements: [], done: false};
    }

    componentDidMount() {
        const value = this.props.value;
        const iterator = value.next ? value : value[Symbol.iterator]();

        visitIterator(
            iterator,
            (iterator, index) => {
                if (this.state.done || iterator.done || index >= MAX_LENGTH) {
                    this.setState(_.extend(this.state, {done: true}));
                    return true;
                } else {
                    this.setState(_.extend(this.state, {
                        elements: this.state.elements.concat(iterator.value)
                    }));
                    return false;
                }
            },
            (error) => {
                console.error(error);
                this.setState(_.extend(this.state, {error}));
            }
        );
    }

    componentWillUnmount() {
        this.setState(_.extend({done: true}, this.state));
    }

    render() {
        return <div>
            {this.renderElements()}
            {this.state.done ? null : <LoadingView />}
            {this.state.error ? <ErrorView error={this.state.error} /> : null}
        </div>;
    }

    renderElements() {
        return this.state.elements.map((element, i) => {
            return <this.props.ElementView value={element} key={i} />;
        });
    }
};

type Props<T> = {
    ElementView: typeof View;
    value: Iterator<T> | AsyncIterator<T> | Iterable<T>;
}

type State<T> = {
    elements: Array<T>;
    done: boolean;
    error: Error;
}

function visitIterator(iterator, visitor, errorCallback, index = 0) {
    const nextIterator = iterator.next();

    if (nextIterator.then) {
        nextIterator.then(inner, errorCallback);
    } else {
        inner(nextIterator);
    }

    function inner(iterator) {
        if (!visitor(iterator, index) && !iterator.done) {
            visitIterator(iterator, visitor, errorCallback, index + 1);
        }
    }
}
