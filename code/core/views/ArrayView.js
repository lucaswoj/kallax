// @flow

const React = require('react');
const ErrorView = require('./ErrorView');
const LoadingView = require('./LoadingView');
const _ = require('lodash');
const AsyncIteratorUtil = require('../util/AsyncIteratorUtil');

const MAX_LENGTH = 200;

module.exports = class ArrayView<T> extends React.Component<void, Props<T>, State<T>> {

    state: State<T>;

    constructor(props: Props) {
        super(props);
        this.state = {elements: [], done: false};
    }

    componentDidMount() {
        AsyncIteratorUtil.each(
            this.props.value,

            // value callback
            (value: T, index: number) => {
                if (this.state.done || index >= MAX_LENGTH) return true;
                this.setState(_.extend(this.state, {
                    elements: this.state.elements.concat(value)
                }));
                return false;
            },

            // done callback
            () => this.setState(_.extend(this.state, {done: true})),

            // error callback
            (error: Error) => {
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
    ElementView: typeof React.Component;
    value: AsyncIterator<T>;
}

type State<T> = {
    elements: Array<T>;
    done: boolean;
    error?: Error;
}
