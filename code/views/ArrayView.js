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
    length: number;
    endIndex: number;
}

module.exports = class ArrayView<T: {id: number | string}> extends React.Component<void, Props<T>, State<T>> {

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
        if (this.element) {
            const height = Array.prototype.reduce.call(this.element.childNodes, (sum, element) => sum + element.offsetHeight, 0);
            this.averageElementHeight = height / this.element.childNodes.length;
        } else {
            this.averageElementHeight = 200;
        }

        for (let i = this.renderedElements.length - 1; i < this.state.endIndex; i++) {
            this.renderedElements[i] = this.renderElement(i, this.props.array.get(i));
        }

        const height = this.state.length == null ? '200%' : this.state.length * this.averageElementHeight;

        return (
            <div
                style={{height: height}}
                ref={(element) => this.element = element}
            >{this.renderedElements}</div>
        );

    }

    renderElement(key, element) {
        return <PromiseView
            key={key}
            promise={element}
            render={this.props.renderElement}
            renderLoading={this.renderLoadingElementBound}
            renderErrored={this.renderErroredElementBound}
        />
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

    onScroll(event) {
        if (this.element) {
            const endIndex = Math.ceil((window.innerHeight - this.element.getBoundingClientRect().top) / this.averageElementHeight);
            this.setState({endIndex: Math.max(endIndex, this.state.endIndex)});
        }
    }

    shouldComponentUpdate(nextProps: State, nextState: State) {
        return (nextState.endIndex > this.state.endIndex || (this.state.length == null && nextState.length != null));
    }

};
