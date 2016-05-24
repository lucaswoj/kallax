// @flow

const React = require('react');
const MarkdownView = require('../core/Views/MarkdownView');
const GitHubIssue = require('./GitHubIssue');

module.exports = class GitHubIssueView extends React.Component<void, Props, void> {

    constructor(props: Props) {
        super(props);
        this.props.value.on('change', this.forceUpdate.bind(this));
    }

    render() {
        return <div style={{display: this.props.value.isRead ? 'none' : 'visible'}} tabIndex={-1} className="GitHubIssueView callout" onKeyPress={this.onKeyPress.bind(this)}>
            <h2>{this.props.value.title}</h2>
            <MarkdownView value={this.props.value.body} />
        </div>;
    }

    onKeyPress(event: SyntheticKeyboardEvent) {
        if (event.key === 'Enter') {
            this.props.value.isRead = true;
        }
    }

};

type Props = {
    value: GitHubIssue;
}
