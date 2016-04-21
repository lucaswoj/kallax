// @flow

const React = require('react');
const View = require('./View');
const MarkdownView = require('./MarkdownView');
const GitHubIssue = require('../models/GitHubIssue');

type Props = {
    value: GitHubIssue
};

module.exports = class GitHubIssueView extends View<void, Props, void> {

    render() {
        return <div>
            <h2>{this.props.value.title}</h2>
            <MarkdownView value={this.props.value.body} />
        </div>;
    }

};
