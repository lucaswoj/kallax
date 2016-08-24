// @flow

const React = require('react');
const GithubNotification = require('../models/GithubNotification');

module.exports = class GithubNotificationView extends React.Component {

    props: {
        value: GithubNotification;
    }

    render() {
        return <div>
            <h2>{this.props.value.props.subject.title}</h2>
            <p>type: {this.props.value.props.subject.type}</p>
            <p>url: {this.props.value.props.subject.url}</p>
            <p>reason: {this.props.value.props.reason}</p>
            <br />
        </div>;
    }

};
