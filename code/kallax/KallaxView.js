// @flow

const React = require('react');
const FS = require('fs');
const MarkdownView = require('../core/views/MarkdownView');
const Path = require('path');

module.exports = class KallaxView extends React.Component {

    render() {
        const file = Path.join(__dirname, 'index.md');
        const value = FS.readFileSync(file, 'utf8').toString();
        return <div className='KallaxView'>
            <MarkdownView enableX value={value} />
        </div>;
    }

};
