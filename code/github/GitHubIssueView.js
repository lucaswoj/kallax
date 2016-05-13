// @flow

const React = require('react');
const MarkdownView = require('../core/views/MarkdownView');
const GitHubIssue = require('./GitHubIssue');

type Props = {
    value: GitHubIssue
};

module.exports = class GitHubIssueView extends React.Component<void, Props, void> {

    render() {
        return <div className="GitHubIssueView outline">
            <h2>{this.props.value.title}</h2>
            <MarkdownView value={this.props.value.body} />
        </div>;
    }

};
