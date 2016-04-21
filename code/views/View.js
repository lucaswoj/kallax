const React = require('react');
const _ = require('lodash');

module.exports = class View<UnboundDefaultProps, Props, State> extends React.Component<UnboundDefaultProps, Props, State> {

    static bindProps<BoundDefaultProps>(props: BoundDefaultProps): typeof View<UnboundDefaultProps & BoundDefaultProps, Props, State> {
        const UnboundView = this;

        return class BoundView extends UnboundView {
            static defaultProps = _.extend(props, UnboundView.defaultProps);
        };
    }

};
