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
            Object.defineProperty(this, 'length', {value: length});
        };

        // Create a lazy "fetch" method
        this.fetch = (index: number) => {
            this.refresh();
            return this.fetch(index);
        };

        // Create a lazy "length" property
        Object.defineProperty(this, 'length', {
            configurable: true,
            get: () => {
                this.refresh();
                return this.length;
            }
        });
    }

    fetchRange(startIndex: number, endIndex: number): Promise<Array<T>> {
        return Promise.all(_.range(startIndex, endIndex).map((index) => this.fetch(index)));
    }

    fetchAll(): Promise<Array<T>> {
        if (!this.length) this.refresh();
        return this.length.then((length) => this.fetchRange(0, length));
    }

}

module.exports = ModelArray;
