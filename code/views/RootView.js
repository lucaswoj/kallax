// @flow

const React = require('react');
const View = require('./View');
const FS = require('fs');
const MarkdownView = require('./MarkdownView');

module.exports = class RootView extends View {

    render() {
        return <div style={{maxWidth: 960, margin: '0 auto', padding: '40px 80px'}}>
            <MarkdownView isMarkdownX={true} value={FS.readFileSync('./code/index.md', 'utf8')} />
        </div>;
    }

};
