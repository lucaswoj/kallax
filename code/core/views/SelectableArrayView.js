// @flow

const React = require('react');
const ArrayView = require('./ArrayView');

module.exports = class SelectableArrayView<T> extends React.Component<void, Props<T>, void> {

    render() {
        return <ArrayView ref='element' value={this.props.value} renderSubview={(subvalue: T, index: number) => {
            return <div onKeyDown={this.onSubviewKeyDown.bind(this, index)}>
                {this.props.renderSubview(subvalue, index)}
            </div>;
        }} />;
    }

    onSubviewKeyDown(index: number, event: SyntheticKeyboardEvent) {
        if (event.key === 'ArrowDown' && this.focus(index + 1)) {
            event.preventDefault();
        } else if (event.key === 'ArrowUp' && this.focus(index - 1)) {
            event.preventDefault();
        }
    }

    focus(index: number): boolean {
        const element = this.refs.element.getSubelement(index);
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
