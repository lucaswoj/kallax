// @flow

const React = require('react');
const View = require('../core/View');
const FS = require('fs');
const MarkdownView = require('../core/views/MarkdownView');
const Path = require('path');

module.exports = class KallaxView extends View {

    render() {
        return <div className='KallaxView'>
            <MarkdownView
                isMarkdownX
                value={FS.readFileSync(Path.join(__dirname, 'index.md'), 'utf8')}
            />
        </div>;
    }

};
