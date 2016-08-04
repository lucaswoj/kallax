// @flow

class Model<Props: {id: string}> {

    props: Props;
    id: string;

    constructor(props: Props) {
        this.props = props;
        this.id = props.id;
    }

}

module.exports = Model;
