// @flow

const React = require('react');
const renderMarkdown = require('marked');
const FS = require('fs');
const Babel = require('babel-core');
const vm = require('vm');
const Path = require('path');

type Props = {
    value: string;
    enableX?: boolean;
}

module.exports = class MarkdownView extends React.Component<void, Props, void> {

    render() {
        if (this.props.enableX) {
            const jsSource = Babel.transform(this.props.value, this.getBabelOptions()).code;
            return vm.runInNewContext(jsSource, this.getContext());

        } else {
            /* eslint-disable react/no-danger */
            return <div dangerouslySetInnerHTML={{__html: renderMarkdown(this.props.value)}} />;
            /* eslint-enable react/no-danger */
        }
    }

    getBabelOptions() {
        const file = Path.join(__dirname, '../../../.babelrc');
        return JSON.parse(FS.readFileSync(file, 'utf8'));
    }

    getContext() {
        return {
            React: require('react'),
            ArrayView: require('./ArrayView'),
            SelectableArrayView: require('./SelectableArrayView'),
            GitHubIssue: require('../../github/GitHubIssue'),
            GitHubIssueView: require('../../github/GitHubIssueView')
        };
    }

};
