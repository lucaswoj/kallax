// @flow

const React = require('react');

type Props<T> = {
    value: T | Promise<T>;
    render: (value: T) => React.Element;
}

type State<T> = {
    value?: T;
    state: 'loading' | 'errored' | 'resolved';
};

module.exports = class PromiseView<T> extends React.Component<void, Props<T>, State<T>> {

    state: State<T>;

    constructor(props: Props<T>) {
        super(props);

        if (this.props.value instanceof Promise) {
            this.props.value.then((value: T) => {
                this.setState({value: value, state: 'resolved'});
            }, (error: Error) => {
                this.setState({state: 'errored'});
                throw error;
            });
            this.state = {state: 'loading'};

        } else {
            this.state = {value: this.props.value, state: 'resolved'};
        }
    }

    render() {
        if (this.state.state === 'resolved' && this.state.value != null) {
            return this.props.render(this.state.value);

        } else if (this.state.state === 'loading') {
            return <div className="loading">Loading</div>;

        } else {
            return <div className="errored">Errored</div>;
        }
    }

};
