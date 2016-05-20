// @flow

const React = require('react');
const ErrorView = require('./ErrorView');
const LoadingView = require('./LoadingView');
const eachAsyncIterator = require('../util/eachAsyncIterator');

const MAX_LENGTH = 20;

module.exports = class ListView<T> extends React.Component<void, Props<T>, State<T>> {

    state: State<T>;

    constructor(props: Props) {
        super(props);
        this.state = {values: [], done: false};
    }

    componentDidMount() {
        eachAsyncIterator(
            this.props.values,

            // value callback
            (value: T, index: number) => {
                if (this.state.done || index >= MAX_LENGTH) return true;
                this.setState(Object.assign(this.state, {
                    values: this.state.values.concat(value)
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
            {this.state.values.map((value: T, index: number) =>
                <div key={index} ref={index} onKeyDown={this.onKeyDown.bind(this, index)}>
                    {this.props.renderValue(value, index)}
                </div>
            )}
            {this.state.done ? null : <LoadingView />}
            {this.state.error ? <ErrorView error={this.state.error} /> : null}
        </div>;
    }

    onKeyDown(index: number, event: SyntheticKeyboardEvent) {
        if (event.key === 'ArrowDown' && this.focus(index + 1)) {
            event.preventDefault();
        } else if (event.key === 'ArrowUp' && this.focus(index - 1)) {
            event.preventDefault();
        }
    }

    focus(index: number): boolean {
        const element = this.refs[index];
        if (!element) return false;

        element.querySelector('[tabindex]').focus();
        return true;
    }
};

type Props<T> = {
    renderValue: (row: T, index: number) => React.Element;
    values: AsyncIterator<T>;
}

type State<T> = {
    values: Array<T>;
    done: boolean;
    error?: Error;
}
