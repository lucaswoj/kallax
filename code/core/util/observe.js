module.exports = function<T> (input: {}, callback: (key: string) => void): T {

    const output = {};

    for (const key in input) {
        const descriptor = getPropertyDescriptor(input, key);

        if (descriptor.writable) {
            output[key] = {
                set: (value) => {
                    input[key] = value;
                    callback(key);
                    return value;
                },
                get: () => input[key],
                configurable: descriptor.configurable,
                enumerable: descriptor.enumerable
            };
        }
    }

    return Object.create(input, output);

};

function getPropertyDescriptor(object, key) {
    while (true) {
        const descriptor = Object.getOwnPropertyDescriptor(object, key);
        if (descriptor) return descriptor;

        object = Object.getPrototypeOf(object);
        if (!object) return null;
    }
}
