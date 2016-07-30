// @flow

const React = require('react');

module.exports = class KallaxSidebarView extends React.Component {

    state: { width: number; };

    props: {};

    constructor(props: {}) {
        super(props);
        this.state = {width: 200};
    }

    render() {
        return <div className="KallaxSidebarView" style={{width: this.state.width}}>

            <div draggable className="resize-handle" onDrag={(event) => {
                if (event.pageX !== 0) this.setState({width: event.pageX});
            }} />

            <h2>Pages</h2>
            <ul>
                <li>One</li>
                <li>Two</li>
                <li>Three</li>
                <li>Four</li>
                <li>Five</li>
            </ul>
            <h2>Tags</h2>
            <ul>
                <li>Red</li>
                <li>Green</li>
                <li>Blue</li>
            </ul>
        </div>;
    }

};
