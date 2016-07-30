// @flow

const React = require('react');

module.exports = class KallaxSidebarView extends React.Component {

    render() {
        return <div className="KallaxSidebarView" ref="sidebar">

            <div draggable className="resize-handle" onDrag={(event) => {
                if (event.pageX === 0) return;
                this.refs.sidebar.style.width = event.pageX + "px";
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
