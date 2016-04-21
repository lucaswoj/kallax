// @flow

const React = require('react');
const View = require('./View');

type Props = {
    error: Error;
};

module.exports = class ErrorView extends View<void, Props, void> {

    render() {
        return <div>Error! {this.props.error.toString()}</div>;
    }

};
