// @flow

const React = require('react');
const LazyPromiseArray = require('../LazyPromiseArray');
const PromiseView = require('./PromiseView');
const LoadingView = require('./LoadingView');
const ErroredView = require('./ErroredView');

type Props<T> = {
    array: LazyPromiseArray<T>;
    renderElement: (value: T) => React.Element;
}

type State = {
    length?: number;
    endIndex: number;
}

module.exports = class ArrayView<T> extends React.Component<void, Props<T>, State> {

    props: Props<T>;
    state: State;

    renderedElements: Array<React.Element>;
    averageElementHeight: number;
    containerElement: Element;

    renderLoadingElementBound: () => React.Element;
    renderErroredElementBound: () => React.Element;
    onScrollBound: () => void;

    constructor(props: Props<T>) {
        super(props);
        this.state = {endIndex: 20};

        this.renderedElements = [];
        this.props.array.on('change', () => {
            this.renderedElements = [];
            this.forceUpdate();
        });

        this.renderLoadingElementBound = this.renderLoadingElement.bind(this);
        this.renderErroredElementBound = this.renderErroredElement.bind(this);
        this.onScrollBound = this.onScroll.bind(this);
    }

    render() {
        if (this.containerElement) {
            const height = Array.prototype.reduce.call(this.containerElement.childNodes, (sum, element) => sum + element.offsetHeight, 0);
            this.averageElementHeight = height / this.containerElement.childNodes.length;
        } else {
            this.averageElementHeight = 200;
        }

        for (let i = this.renderedElements.length - 1; i < this.state.endIndex; i++) {
            this.renderedElements[i] = <PromiseView
                key={i}
                promise={this.props.array.get(i)}
                render={this.props.renderElement}
                renderLoading={this.renderLoadingElementBound}
                renderErrored={this.renderErroredElementBound}
            />;
        }

        const height = this.state.length == null ? '200%' : this.state.length * this.averageElementHeight;

        return (
            <div
                style={{height: height}}
                ref={(element) => { this.containerElement = element; }}
            >{this.renderedElements}</div>
        );

    }

    renderLoadingElement() {
        return <div style={{height: this.averageElementHeight}}><LoadingView /></div>;
    }

    renderErroredElement() {
        return <div style={{height: this.averageElementHeight}}><ErroredView /></div>;
    }

    componentDidMount() {
        this.props.array.length.then((length) => this.setState({length: length}));
        window.addEventListener('scroll', this.onScroll.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollBound);
    }

    onScroll() {
        if (this.containerElement) {
            const endIndex = Math.ceil((window.innerHeight - this.containerElement.getBoundingClientRect().top) / this.averageElementHeight);
            this.setState({endIndex: Math.max(endIndex, this.state.endIndex)});
        }
    }

    shouldComponentUpdate(nextProps: Props<T>, nextState: State) {
        return (nextState.endIndex > this.state.endIndex || (this.state.length == null && nextState.length != null));
    }

};
