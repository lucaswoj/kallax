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
        this.emit('refresh');
    }

    get(index: number): Promise<T> {
        if (this._needsHardRefresh) this._hardRefresh();
        return this._get(index);
    }

    slice(startIndex: number = 0, endIndex?: number): Promise<Array<T>> {
        return Promise.resolve(endIndex || this.length).then((endIndex: number) => {
            return Promise.all(_.range(startIndex, endIndex).map(this.get.bind(this)));
        });
    }

    get length(): Promise<number> {
        if (this._needsHardRefresh) this._hardRefresh();
        return this._getLength();
    }

}

module.exports = LazyPromiseArray;
