// @flow

const React = require('react');

module.exports = class ErrorView extends React.Component {

    props: {
        error: Error;
    };

    state: void;

    render() {
        return <pre>{this.props.error.stack}</pre>;
    }

};
