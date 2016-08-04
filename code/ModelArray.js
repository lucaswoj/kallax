// @flow

const {EventEmitter} = require('events');
const _ = require('lodash');

class ModelArray<T> extends EventEmitter {

    fetch: (index: number) => Promise<T>;
    refresh: () => void;
    length: Promise<number>;

    constructor(refresh: () => {fetch: (index: number) => Promise<T>, length: Promise<number>}) {
        super();

        this.refresh = () => {
            const {fetch, length} = refresh();
            this.fetch = fetch;
            this.length = length;
        };

        this.refresh();
    }

    fetchSlice(startIndex: number, endIndex: number): Promise<Array<T>> {
        return Promise.all(_.range(startIndex, endIndex).map((index) => this.fetch(index)));
    }

    fetchAll(): Promise<Array<T>> {
        return this.length.then((length) => this.fetchSlice(0, length));
    }

}

module.exports = ModelArray;
