// @flow

const React = require('react');

type Props = {
    error: Error;
};

module.exports = class ErrorComponent extends React.Component<void, Props, void> {

    render() {
        return <div>Error! {this.props.error}</div>;
    }

};
