// @flow

const React = require('react');
const ArrayView = require('./ArrayView');
const SelectableView = require('./SelectableView');

module.exports = class SelectableArrayView<T> extends React.Component<void, Props<T>, void> {

    render() {
        return <ArrayView {...this.props} renderSubvalue={(subvalue: T, index: number) => {
            return <SelectableView>
                {this.props.renderSubvalue(subvalue, index)}
            </SelectableView>;
        }} />;
    }
};

type Props<T> = {
    renderSubvalue: (subvalue: T, index: number) => React.Element;
    value: AsyncIterator<T>;
}
