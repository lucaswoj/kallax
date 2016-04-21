// @flow

const React = require('react');
const assert = require('assert');
const View = require('./View');
const ErrorView = require('./ErrorView');
const LoadingView = require('./LoadingView');

type Props<T> = {
    value: T | Promise<T>;
    ResolvedView: typeof View;
}

type State<T> = {
    value: ?T;
    state: 'loading' | 'error' | 'resolved';
    error: ?Error;
};

module.exports = class PromiseView<T> extends View<void, Props<T>, State<T>> {

    state: State<T>;

    constructor(props: Props<T>) {
        super(props);

        if (this.props.value instanceof Promise) {
            this.props.value.then((value: T) => {
                this.setState({value: value, state: 'resolved', error: null});
            }, (error: Error) => {
                this.setState({value: null, error: error, state: 'error'});
            });
            this.state = {value: null, error: null, state: 'loading'};

        } else {
            assert(this.props.value);
            this.state = {value: this.props.value, state: 'resolved', error: null};
        }
    }

    render() {
        const ResolvedView = this.props.ResolvedView;

        if (this.state.state === 'resolved') {
            return <ResolvedView value={this.state.value} />;

        } else if (this.state.state === 'loading') {
            return <LoadingView value={this.state.error} />;

        } else if (this.state.state === 'error') {
            return <ErrorView value={this.state.error} />;

        } else {
            throw new Error(`Unexpected state "${this.state.state}"`);
        }
    }

};
