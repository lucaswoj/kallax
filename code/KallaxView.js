// @flow

const React = require('react');
const KallaxPage = require('./KallaxPage');
const MarkdownView = require('./MarkdownView');

module.exports = class KallaxView extends React.Component {

    state: {
        sidebarWidth: number;
        activePage: KallaxPage;
    };

    props: {};

    constructor(props: {}) {
        super(props);
        this.state = {
            sidebarWidth: 200,
            activePage: KallaxPage.getInitialActivePage()
        };
    }

    render() {
        return <div className="KallaxView">
            {this.renderSidebar()}
            {this.renderActivePage()}
        </div>;
    }

    renderSidebar() {
        return <div className="sidebar" style={{width: this.state.sidebarWidth}}>

            <div draggable className="resize-handle" onDrag={(event) => {
                if (event.pageX !== 0) this.setState({sidebarWidth: event.pageX});
            }} />

            <h2>Pages</h2>
            <ul>{KallaxPage.getPages().map((page) => {
                return <li
                    key={page.title}
                    onClick={() => { this.setState({activePage: page}); }}
                    className={this.state.activePage.title === page.title ? 'active' : ''}
                >
                    {page.title}
                </li>;
            })}</ul>

        </div>;
    }

    renderActivePage() {
        return <div className="active-page">
            <MarkdownView value={this.state.activePage.body} />
        </div>;
    }

};
