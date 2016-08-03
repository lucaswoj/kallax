// @flow

const {app} = require('electron').remote;
const Path = require('path');
const FS = require('fs');

// TODO make a subclass of Model

const pagesDir = Path.join(app.getAppPath(), 'data');

module.exports = class KallaxPage {

    static getPages() {
        return FS.readdirSync(pagesDir).map(this.getPageFromFile.bind(this));
    }

    static getInitialActivePage() {
        return this.getPages()[0];
    }

    static getPageFromFile(file) {
        return new KallaxPage({
            title: Path.basename(file, '.md'),
            body: FS.readFileSync(Path.join(pagesDir, file), 'utf8')
        });
    }

    title: string;
    body: string;

    constructor({title, body}: {title: string, body: string}) {
        this.title = title;
        this.body = body;
    }

};
