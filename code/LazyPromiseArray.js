// @flow

const {EventEmitter} = require('events');
const _ = require('lodash');

class LazyPromiseArray<T> extends EventEmitter {

    fetchAtIndex: (index: number) => Promise<T>;
    refresh: () => void;
    length: Promise<number>;

    constructor(refresh: () => {fetchAtIndex: (index: number) => Promise<T>, length: Promise<number>}) {
        super();

        this.refresh = () => {
            const {fetchAtIndex, length} = refresh();
            this.fetchAtIndex = fetchAtIndex;
            Object.defineProperty(this, 'length', {value: length});
        };

        // Create a lazy "fetchAtIndex" method
        this.fetchAtIndex = (index: number) => {
            this.refresh();
            return this.fetchAtIndex(index);
        };

        // Create a lazy "length" property
        // flow-disable-line
        Object.defineProperty(this, 'length', {
            configurable: true,
            get: () => {
                this.refresh();
                return this.length;
            }
        });
    }

    fetchSlice(startIndex: number, endIndex: number): Promise<Array<T>> {
        return Promise.all(_.range(startIndex, endIndex).map((index) => this.fetchAtIndex(index)));
    }

    fetch(): Promise<Array<T>> {
        if (!this.length) this.refresh();
        return this.length.then((length) => this.fetchSlice(0, length));
    }

}

module.exports = LazyPromiseArray;
