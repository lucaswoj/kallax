// @flow

const React = require('react');
const MarkdownComponent = require('../core/components/MarkdownComponent');
const GitHubIssue = require('./GitHubIssue');

type Props = {
    value: GitHubIssue
};

module.exports = class GitHubIssueComponent extends React.Component<void, Props, void> {

    render() {
        return <div tabIndex={-1} className="GitHubIssueComponent callout">
            <h2>{this.props.value.title}</h2>
            <MarkdownComponent value={this.props.value.body} />
        </div>;
    }

};
