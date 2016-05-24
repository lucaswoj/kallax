// @flow

const React = require('react');
const ErrorView = require('./ErrorView');
const LoadingView = require('./LoadingView');
const AsyncArray = require('../util/AsyncArray');

module.exports = class ListView<T> extends React.Component<void, Props<T>, State<T>> {

    state: State<T>;

    constructor(props: Props) {
        super(props);
        this.state = {values: [], done: false};
    }

    componentDidMount() {
        this.props.values.fetch(20, (error: Error, values: Array<T>, done: boolean) => {
            if (error) {
                console.error(error.stack);
                this.setState(Object.assign(this.state, {error}));
            }

            this.setState(Object.assign(this.state, {values: values}));

            if (done || this.state.done) {
                this.setState(Object.assign(this.state, {done: true}));
            }
        });
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
        if (event.key === 'ArrowDown') {
            this.focus(index + 1);
            event.preventDefault();
        } else if (event.key === 'ArrowUp') {
            this.focus(index - 1);
            event.preventDefault();
        }
    }

    focus(index: number): boolean {
        const element = this.refs[index];
        if (!element) return false;

        const focusableElement = element.querySelector('[tabindex]');
        focusableElement.focus();
        focusableElement.scrollIntoView();
        return true;
    }
};

type Props<T> = {
    renderValue: (row: T, index: number) => React.Element;
    values: AsyncArray<T>;
}

type State<T> = {
    values: Array<T>;
    done: boolean;
    error?: Error;
}
