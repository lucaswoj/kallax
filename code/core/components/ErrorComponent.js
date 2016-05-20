// @flow

const React = require('react');

module.exports = class ErrorComponent extends React.Component {

    props: {
        error: Error;
    };

    state: void;

    render() {
        return <div>Error! {this.props.error}</div>;
    }

};
