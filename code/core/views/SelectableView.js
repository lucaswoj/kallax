// @flow

const React = require('react');

module.exports = class SelectableView extends React.Component<DefaultProps, Props, void> {

    static defaultProps = {
        onKey: {}
    };

    element: HTMLCanvasElement;

    select() {
        this.refs.element.focus();
    }

    render() {
        return <div
            className='SelectableView'
            tabIndex={-1}
            onKeyDown={this.onKeyDown.bind(this)}
            ref="element"
        >
            {this.props.children}
        </div>;
    }

    onKeyDown(event: SyntheticKeyboardEvent) {
        if (this.props.onKey[event.key]) {
            this.props.onKey[event.key](event);
            event.preventDefault();
        }
    }

};

type Props = {
    children?: React.Children,
    onKey: {[key: string]: (event: SyntheticEvent) => void}
}

type DefaultProps = {
    onKey: {[key: string]: (event: SyntheticEvent) => void}
}
