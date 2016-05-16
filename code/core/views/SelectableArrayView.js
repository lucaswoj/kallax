// @flow

const React = require('react');
const ArrayView = require('./ArrayView');
const SelectableView = require('./SelectableView');

module.exports = class SelectableArrayView<T> extends React.Component<void, Props<T>, void> {

    render() {
        return <ArrayView {...this.props} renderElement={(element: T, index: number) => {
            return <SelectableView>
                {this.props.renderElement(element, index)}
            </SelectableView>;
        }} />;
    }
};

type Props<T> = {
    renderElement: (element: T, index: number) => React.Element;
    value: AsyncIterator<T>;
}
