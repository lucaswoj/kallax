// @flow

const React = require('react');
const View = require('./View');
const ErrorView = require('./ErrorView');
const LoadingView = require('./LoadingView');
const _ = require('lodash');

const MAX_LENGTH = 200;

module.exports = class AsyncIteratorView<T> extends View<void, Props<T>, State<T>> {

    constructor(props: Props) {
        super(props);

        const fetchNext = (itemIndex, iterator) => {
            iterator.next().then((iterator) => {
                const isDone = iterator.done || itemIndex >= MAX_LENGTH;
                this.setState({
                    elements: this.state.elements.concat(iterator.value),
                    done: isDone
                });
                if (!isDone) fetchNext(itemIndex + 1, iterator);
            }, (error) => {
                this.setState({
                    error,
                    elements: this.state.elements,
                    done: this.state.done
                });
            });
        };

        if (_.isArray(this.props.value)) {
            this.state = {elements: this.props.value, done: true};
        } else {
            this.state = {elements: [], done: false};
            fetchNext(0, this.props.value);
        }
    }

    render() {
        return <div>
            {this.state.elements.map((element:T, i) => {
                return <this.props.ElementView value={element} key={i} />;
            })}
            {!this.state.error && this.state.done ? <LoadingView /> : null }
            {this.state.error ? <ErrorView error={this.state.error} /> : null }
        </div>;
    }
};

type Props<T> = {
    ElementView: typeof View;
    value: AsyncIterator<T> | Array<T>;
}

type State<T> = {
    elements: Array<T>;
    done: boolean;
    error: Error;
}
