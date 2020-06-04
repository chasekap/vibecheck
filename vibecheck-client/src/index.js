import _ from "lodash";
import React from "react";
import ReactDOM from "react-dom";
import { Menu } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

import "./index.css";
import ContentSearch from "./search.js";
import ContentTrends from "./trends.js";
import ContentPolicies from "./policies.js";

const initialMenuState = {
    activeItem: "search",
};

class MainPage extends React.Component {
    constructor(props) {
        //this is now the parent component of HeaderMenu and Search
        super(props);

        this.state = {
            reddit: true,
            twitter: false,
            news: false,
            amount: 1000,
            date: "week",
        };
    }
    updateReddit() {
        this.setState({
            reddit: !this.state.reddit,
        });
    }
    updateTwitter() {
        this.setState({
            twitter: !this.state.twitter,
        });
    }
    updateNews() {
        this.setState({
            news: !this.state.news,
        });
    }

    render() {
        return (
            <Router>
                <div>
                    <HeaderMenu
                        options={this.state}
                        upRed={this.updateReddit.bind(this)}
                        upTwit={this.updateTwitter.bind(this)}
                        upNews={this.updateNews.bind(this)}
                    />
                    <Switch>
                        <Route exact path="/">
                            <ContentSearch options={this.state} />
                        </Route>
                        <Route path="/trends">
                            <ContentTrends />
                        </Route>
                        <Route path="/info">
                            <ContentPolicies />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

class HeaderMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialMenuState;
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        let red = this.props.options.reddit;
        let twit = this.props.options.twitter;
        let all_news = this.props.options.news;
        const { activeItem } = this.state;
        return (
            <Menu>
                <Menu.Item
                    as={Link}
                    to="/"
                    name="search"
                    active={activeItem === "search"}
                    onClick={this.handleItemClick}
                >
                    Search
                </Menu.Item>
                <Menu.Item
                    as={Link}
                    to="/trends"
                    name="trends"
                    active={activeItem === "trends"}
                    onClick={this.handleItemClick}
                >
                    Trends
                </Menu.Item>
                <Menu.Item class="icon">
                    <div class="ui simple dropdown">
                        <i class="cog icon"></i>
                        <div class="menu">
                            <div onClick={this.props.upRed} class="item">
                                {" "}
                                <span
                                    style={{
                                        color: red ? "#000000" : "#aaaaaa",
                                    }}
                                >
                                    Reddit <i class="mini reddit icon"></i>
                                </span>{" "}
                            </div>
                            <div onClick={this.props.upTwit} class="item">
                                {" "}
                                <span
                                    style={{
                                        color: twit ? "#000000" : "#aaaaaa",
                                    }}
                                >
                                    Twitter <i class="mini twitter icon"></i>
                                </span>{" "}
                            </div>
                            <div onClick={this.props.upNews} class="item">
                                {" "}
                                <span
                                    style={{
                                        color: all_news ? "#000000" : "#aaaaaa",
                                    }}
                                >
                                    News <i class=""></i>
                                </span>{" "}
                            </div>
                        </div>
                    </div>
                </Menu.Item>

                <Menu.Menu position="right">
                    <Menu.Item
                        as={Link}
                        to="/info"
                        name="info"
                        active={activeItem === "info"}
                        onClick={this.handleItemClick}
                    >
                        Warnings and Policies
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}

ReactDOM.render(<MainPage />, document.getElementById("root"));
