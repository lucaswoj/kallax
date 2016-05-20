// @flow

const React = require('react');
const FS = require('fs');
const MarkdownView = require('../core/Views/MarkdownView');
const Path = require('path');
const {app} = require('electron').remote;

module.exports = class KallaxView extends React.Component {

    props: {};

    state: void;

    render() {
        const file = Path.join(app.getPath('appData'), 'Kallax', 'index.md');
        const value = FS.readFileSync(file, 'utf8').toString();
        return <div className='KallaxView'>
            <MarkdownView enableX value={value} />
        </div>;
    }

};
