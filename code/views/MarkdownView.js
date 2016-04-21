// @flow

const React = require('react');
const renderMarkdown = require('marked');
const FS = require('fs');
const Babel = require('babel-core');
const vm = require('vm');
const View = require('./View');
const Path = require('path');

type Props = {
    value: string;
    isMarkdownX: string;
}

module.exports = class MarkdownView extends View<void, Props, void> {

    render() {
        if (this.props.isMarkdownX) {
            const jsxSource = '<div>' + renderMarkdown(this.props.value) + '</div>';
            const jsSource = Babel.transform(jsxSource, this.getBabelOptions()).code;
            return vm.runInNewContext(jsSource, this.getContext());

        } else {
            /* eslint-disable react/no-danger */
            return <div dangerouslySetInnerHTML={{__html: renderMarkdown(this.props.value)}} />;
            /* eslint-enable react/no-danger */
        }
    }

    getBabelOptions() {
        const file = Path.join(__dirname, '../../.babelrc');
        return JSON.parse(FS.readFileSync(file, 'utf8'));
    }

    getContext() {
        const React = require('react');
        const GitHubIssueView = require('./GitHubIssueView');
        const ArrayView = require('./ArrayView');
        const GitHubIssue = require('../models/GitHubIssue');

        return {React, ArrayView, GitHubIssue, GitHubIssueView};
    }

};
