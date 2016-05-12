// @flow

const React = require('react');
const View = require('../View');

module.exports = class LoadingView extends View<void, void, void> {

    render() {
        return <div className="LoadingView" />;
    }

};
