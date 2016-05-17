// @flow

const React = require('react');
const ArrayView = require('./ArrayView');
const SelectableView = require('./SelectableView');

module.exports = class SelectableArrayView<T> extends React.Component<void, Props<T>, void> {

    subviews: {[index: number]: SelectableView} = {};

    render() {

        return <ArrayView {...this.props} renderSubview={(subvalue: T, index: number) =>
            <SelectableView
                ref={(subview) => { this.subviews[index] = subview; }}
                onKey={{
                    'ArrowDown': () => this.subviews[index + 1] && this.subviews[index + 1].select(),
                    'ArrowUp': () =>   this.subviews[index - 1] && this.subviews[index - 1].select()
                }}
            >
                {this.props.renderSubview(subvalue, index)}
            </SelectableView>
        } />;
    }
};

type Props<T> = {
    renderSubview: (subvalue: T, index: number) => React.Element;
    value: AsyncIterator<T>;
}
