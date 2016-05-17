// @flow

const React = require('react');
const ErrorView = require('./ErrorView');
const LoadingView = require('./LoadingView');
const AsyncIteratorUtil = require('../util/AsyncIteratorUtil');

const MAX_LENGTH = 20;

module.exports = class ArrayView<T> extends React.Component<void, Props<T>, State<T>> {

    state: State<T>;

    constructor(props: Props) {
        super(props);
        this.state = {subvalues: [], done: false};
    }

    componentDidMount() {
        AsyncIteratorUtil.each(
            this.props.value,

            // value callback
            (value: T, index: number) => {
                if (this.state.done || index >= MAX_LENGTH) return true;
                this.setState(Object.assign(this.state, {
                    subvalues: this.state.subvalues.concat(value)
                }));
                return false;
            },

            // done callback
            () => this.setState(Object.assign(this.state, {done: true})),

            // error callback
            (error: Error) => {
                console.error(error);
                this.setState(Object.assign(this.state, {error}));
            }
        );
    }

    componentWillUnmount() {
        this.setState(Object.assign(this.state, {done: true}));
    }

    render() {
        return <div>
            {this.state.subvalues.map((subvalue: T, index: number) =>
                <div key={index}>{this.props.renderSubvalue(subvalue, index)}</div>
            )}
            {this.state.done ? null : <LoadingView />}
            {this.state.error ? <ErrorView error={this.state.error} /> : null}
        </div>;
    }
};

type Props<T> = {
    renderSubvalue: (subvalue: T, index: number) => React.Element;
    value: AsyncIterator<T>;
}

type State<T> = {
    subvalues: Array<T>;
    done: boolean;
    error?: Error;
}
