import _ from "lodash";
import React from "react";
import ReactDOM from "react-dom";

import { Menu, Grid, Search } from "semantic-ui-react";

import "./index.css";
import "semantic-ui-css/semantic.min.css";

const initialSearchState = { 
    isLoading: false, 
    results: [], 
    value: "", 
    timeout: 0,
};

const initialMenuState = { 
    activeItem: "search",
};

class SearchPage extends React.Component {
    render() {
        return (
            <div>
                <HeaderMenu />
                <ContentSearch />
            </div>
        );
    }
}

class HeaderMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialMenuState
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state;
        return (
            <Menu>
                <Menu.Item
                    name="search"
                    active={activeItem === "search"}
                    onClick={this.handleItemClick}
                >
                    Search
                </Menu.Item>

                <Menu.Item
                    name="trends"
                    active={activeItem === "trends"}
                    onClick={this.handleItemClick}
                >
                    Trends
                </Menu.Item>
            </Menu>
        );
    }
}

class ContentSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialSearchState
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value });

        if(this.timeout) 
            clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            if (this.state.value.length < 1) 
                return this.setState(initialSearchState);

            getData(value)

            this.setState({
                isLoading: false,
            });
        }, 300);
    };

    render() {
        return (
            <Grid container>
                <Grid.Row centered style={{ padding: "150pt 0 0 0" }}>
                    <div className="logo">vibecheck</div>
                </Grid.Row>
                <Grid.Row centered style={{ padding: "50pt 0 0 0" }}>
                    <Search
                        className="search-bar"
                        loading={ this.state.isLoading }
                        placeholder="what's on your mind?"
                        onSearchChange={_.debounce(
                            this.handleSearchChange,
                            500,
                            { leading: true }
                        )}
                        value={ this.state.value }
                        open={ false }
                        {...this.props}
                    />
                </Grid.Row>
            </Grid>
        );
    }
}

function getData(search) {
    fetch(`/search/${search}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
        });
}

ReactDOM.render(<SearchPage />, document.getElementById("root"));