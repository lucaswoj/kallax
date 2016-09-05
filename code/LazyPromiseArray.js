// @flow

const _ = require('lodash');

class LazyPromiseArray<T> {

    _hardRefresh: () => void;
    _needsHardRefresh: boolean = true;
    _get: (index: number) => Promise<T>;
    _getLength: () => Promise<number>;

    constructor(refresh: (refreshCount: number) => {get: (index: number) => Promise<T>, getLength: () => Promise<number>}) {
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
    }

    get(index: number): Promise<T> {
        if (this._needsHardRefresh) this._hardRefresh();
        return this._get(index);
    }

    get length(): Promise<number> {
        if (this._needsHardRefresh) this._hardRefresh();
        return this._getLength();
    }

}

module.exports = LazyPromiseArray;
