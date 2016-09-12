// @flow

const _ = require('lodash');
const {EventEmitter} = require('events');

class LazyPromiseArray<T> extends EventEmitter {

    _hardRefresh: () => void;
    _needsHardRefresh: boolean = true;
    _get: (index: number) => Promise<T>;
    _getLength: () => Promise<number>;

    constructor(refresh: (refreshCount: number) => {get: (index: number) => Promise<T>, getLength: () => Promise<number>}) {
        super();

        let refreshCount = 0;
        this._hardRefresh = () => {
            const {get, getLength} = refresh(refreshCount++);
            this._get = _.memoize(get);
            this._getLength = _.memoize(getLength);
            this._needsHardRefresh = false;
        };
    }

    refresh() {
        delete this._get;
        delete this._getLength;
        this._needsHardRefresh = true;
        this.emit('change');
    }

    get(index: number): Promise<T> {
        if (this._needsHardRefresh) this._hardRefresh();
        return this.length.then((length) => {
            return (index >= length || index < 0) ? Promise.reject('Out of bounds access') : this._get(index);
        });
    }

    slice(startIndex: number = 0, endIndex?: number): LazyPromiseArray<T> {
        const array = new LazyPromiseArray(() => ({
            get: (i: number) => this.get(i + startIndex),
            getLength: () => Promise.resolve(endIndex || this.length).then((endIndex) => endIndex - startIndex)
        }));
        this.on('change', array.refresh.bind(array));
        return array;
    }

    then(callback: (array: Array<T>) => void, errorCallback?: (error: Error) => void) {
        this.length.then((length: number) => {
            Promise.all(_.range(0, length).map(this.get.bind(this))).then(callback, errorCallback);
        });
    }

    get length(): Promise<number> {
        if (this._needsHardRefresh) this._hardRefresh();
        return this._getLength();
    }

}

module.exports = LazyPromiseArray;
