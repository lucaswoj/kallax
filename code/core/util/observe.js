module.exports = function<T> (input: T, callback: (key: string, value: any) => void): T {

    return new Proxy(input, {
        set: function (object, key, value) {
            object[key] = value;
            if (!isSetter(object, key)) {
                callback(key, value);
            }
            return true;
        }
    });

};

function isSetter(object, key) {
    return getPropertyDescriptor(object, key).set;
}

function getPropertyDescriptor(object, key) {
    while (true) {
        const descriptor = Object.getOwnPropertyDescriptor(object, key);
        if (descriptor) return descriptor;

        object = Object.getPrototypeOf(object);
        if (!object) return null;
    }
}
