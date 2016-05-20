// @flow

const React = require('react');
const MarkdownView = require('../core/Views/MarkdownView');
const GitHubIssue = require('./GitHubIssue');

module.exports = class GitHubIssueView extends React.Component {

    props: {
        value: GitHubIssue
    };

    state: void;

    render() {
        return <div tabIndex={-1} className="GitHubIssueView callout">
            <h2>{this.props.value.title}</h2>
            <MarkdownView value={this.props.value.body} />
        </div>;
    }

};
