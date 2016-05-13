// @flow

const React = require('react');

type Props = {
    error: Error;
};

module.exports = class ErrorView extends React.Component<void, Props, void> {

    render() {
        return <div>Error! {this.props.error}</div>;
    }

};
