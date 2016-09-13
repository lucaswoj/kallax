// @flow

const React = require('react');
const KallaxArray = require('../KallaxArray');
const PromiseView = require('./PromiseView');
const LoadingView = require('./LoadingView');
const ErroredView = require('./ErroredView');
const bind = require('autobind-decorator');
const _ = require('lodash');

type Props<T> = {
    array: KallaxArray<T>;
    renderElement: (value: T) => React.Element;
}

type State = {
    length?: number;
    endIndex: number;
}

module.exports = class ArrayView<T> extends React.Component<void, Props<T>, State> {

    props: Props<T>;
    state: State;

    childViewCache: Array<React.Element>;
    averageChildViewHeight: number = 100;
    element: Element;

    constructor(props: Props<T>) {
        super(props);
        this.state = {endIndex: 20};

        this.childViewCache = [];
        this.props.array.on('change', () => {
            this.childViewCache = [];
            this.forceUpdate();
        });
    }

    render() {
        if (this.childViewCache.length < this.state.endIndex) {
            for (let i = this.childViewCache.length; i < this.state.endIndex; i++) {
                this.childViewCache[i] = <PromiseView
                    key={i}
                    promise={this.props.array.get(i)}
                    render={this.props.renderElement}
                    renderLoading={() => <div style={{height: this.averageChildViewHeight}}><LoadingView /></div>}
                    renderErrored={() => <div style={{height: this.averageChildViewHeight}}><ErroredView /></div>}
                />;
            }
        }

        return (
            <div
                style={{height: this.state.length == null ? '200%' : this.state.length * this.averageChildViewHeight}}
                ref={(element) => { this.element = element; }}
            >{this.childViewCache}</div>
        );

    }

    @bind
    onViewportUpdate() {
        if (this.element && this.state.length !== undefined) {
            const visibleHeight = window.innerHeight - this.element.getBoundingClientRect().top;
            this.setState({
                endIndex: _.clamp(
                    Math.ceil(visibleHeight / this.averageChildViewHeight),
                    this.state.endIndex,
                    this.state.length || 0
                )
            });

            const childNodes = this.element.childNodes;
            const sampleCount = Math.min(childNodes.length, 100);
            let sampleHeightSum = 0;
            for (let i = 0; i < sampleCount; i++) {
                const sampleIndex = _.random(0, childNodes.length - 1);
                sampleHeightSum += ((childNodes[sampleIndex]: any): Element).getBoundingClientRect().height;
            }
            this.averageChildViewHeight = sampleHeightSum / sampleCount;
        }
    }

    componentDidMount() {
        this.props.array.length.then((length) => this.setState({length: length}));
        window.addEventListener('scroll', this.onViewportUpdate);
        window.addEventListener('resize', this.onViewportUpdate);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onViewportUpdate);
        window.removeEventListener('resize', this.onViewportUpdate);
    }

};
