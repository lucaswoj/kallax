// @flow

const {app} = require('electron').remote;
const Path = require('path');
const FS = require('fs');
const Model = require('../Model');

const pagesDir = Path.join(app.getAppPath(), 'data');

module.exports = class KallaxPage extends Model {

    props: {
        id: string;
        title: string;
        body: string;
    };

    static getPages() {
        return FS.readdirSync(pagesDir).map(this.getPageFromFile.bind(this));
    }

    static getInitialActivePage() {
        return this.getPages()[0];
    }

    static getPageFromFile(file) {
        return new KallaxPage({
            id: file,
            title: Path.basename(file, '.md'),
            body: FS.readFileSync(Path.join(pagesDir, file), 'utf8')
        });
    }

};
