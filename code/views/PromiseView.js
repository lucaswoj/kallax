// @flow

const React = require('react');
const LoadingView = require('./LoadingView');
const ErroredView = require('./ErroredView');

type Props<T> = {
    promise: Promise<T>;
    render: (value: T) => React.Element;
    renderLoading?: (value: T) => React.Element;
    renderErrored?: (value: T) => React.Element;
}

type State<T> = {
    value?: T;
    state: 'loading' | 'errored' | 'resolved';
};

module.exports = class PromiseView<T> extends React.Component<void, Props<T>, State<T>> {

    state: State<T>;

    constructor(props: Props<T>) {
        super(props);

        this.state = {state: 'loading'};
        this.props.promise
            .then(
                (value: T) => this.setState({value: value, state: 'resolved'}),
                (error: Error) => {
                    this.setState({state: 'errored'});
                    throw error;
                }
            );
    }

    render() {
        if (this.state.state === 'resolved' && this.state.value != null) {
            return this.props.render(this.state.value);

        } else if (this.state.state === 'loading') {
            return this.props.renderLoading ? this.props.renderLoading() : <LoadingView />;

        } else {
            return this.props.renderErrored ? this.props.renderErrored() : <ErroredView />;
        }
    }

};
