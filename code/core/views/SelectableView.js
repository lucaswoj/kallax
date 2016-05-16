// @flow

const React = require('react');

module.exports = class SelectableView extends React.Component<void, {children?: React.Children}, void> {

    render() {
        return <div className='SelectableView' tabIndex={-1}>
            {this.props.children}
        </div>;
    }

};
