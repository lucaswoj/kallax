// @flow

const React = require('react');
const ErrorView = require('./ErrorView');
const LoadingView = require('./LoadingView');
const AsyncIteratorUtil = require('../util/AsyncIteratorUtil');

const MAX_LENGTH = 20;

module.exports = class ArrayView<T> extends React.Component<void, Props<T>, State<T>> {

    state: State<T>;
    subelements: Array<React.Element> = [];

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
                <div key={index} ref={index} onKeyDown={this.onSubelementKeyDown.bind(this, index)}>
                    {this.props.renderSubview(subvalue, index)}
                </div>
            )}
            {this.state.done ? null : <LoadingView />}
            {this.state.error ? <ErrorView error={this.state.error} /> : null}
        </div>;
    }

    getSubelement(index: number): React.Element {
        return this.subelements[index];
    }

    onSubelementKeyDown(index: number, event: SyntheticKeyboardEvent) {
        if (event.key === 'ArrowDown' && this.focusSubelement(index + 1)) {
            event.preventDefault();
        } else if (event.key === 'ArrowUp' && this.focusSubelement(index - 1)) {
            event.preventDefault();
        }
    }

    focusSubelement(index: number): boolean {
        const element = this.refs[index];
        if (!element) return false;

        const focusableElement = element.querySelector('[tabindex]');
        if (!focusableElement) return false;

        element.querySelector('[tabindex]').focus();
        return true;
    }
};

type Props<T> = {
    renderSubview: (subvalue: T, index: number) => React.Element;
    value: AsyncIterator<T>;
}

type State<T> = {
    subvalues: Array<T>;
    done: boolean;
    error?: Error;
}
