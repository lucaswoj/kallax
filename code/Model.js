// @flow

class Model<Props: {id: string}> {

    props: Props;
    id: string;

    // TODO make sure props are deduped across instances with equal ids using
    // a WeakMap

    constructor(props: Props) {
        this.props = props;
        this.id = props.id;
    }

}

module.exports = Model;
