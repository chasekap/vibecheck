import _ from "lodash";
import React from "react";
import Wordcloud from "wordcloud";
import { Grid, Search } from "semantic-ui-react";
import "./index.css";
import "semantic-ui-css/semantic.min.css";

const initialSearchState = {
    isLoading: false,
    results: [],
    value: "",
    timeout: 0,
};

class SimpCloud extends React.Component {
    componentDidUpdate() {
        const list = this.props.words;
        Wordcloud(this.refs["my-canvas"], {
            list: list,
            color: "#000000",
            fontFamily: "Tahoma, Geneva, sans-serif",
            drawOutOfBound: false,
        });
    }

    render() {
        if (this.props.word_vis == true) {
            return (
                <div>
                    <div
                        id="html-canvas"
                        ref="my-canvas"
                        style={{
                            width: this.props.words.length * 8,
                            height: this.props.words.length * 8,
                        }}
                    />
                </div>
            );
        } else {
            return <div ref="my-canvas" />;
        }
    }
}

class InterestingText extends React.Component {
    render() {
        if (this.props.text_vis) {
            return (
                <Grid container>
                    <Grid.Row style={{ padding: "40pt 0 0 0" }} centered>
                        <button
                            className="ui icon button mini"
                            onClick={this.props.refreshText}
                            style={{ background: "white", padding: "0 0 0 0" }}
                        >
                            <i className="undo icon"></i>
                        </button>
                    </Grid.Row>
                    <Grid.Row
                        fixed="true"
                        centered
                        style={{ padding: "10pt 0 0 0" }}
                    >
                        <div style={{ padding: "0 0 0 5pt" }}>
                            {this.props.int_text}
                        </div>
                    </Grid.Row>
                </Grid>
            );
        } else {
            return (
                <Grid.Row
                    centered
                    style={{ padding: "100pt 0 0 0" }}
                ></Grid.Row>
            );
        }
    }
}
class ContentSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialSearchState;
        this.state.avg_sentiment =
            "(mean sentiment score, (-1 to +1 inclusive) )";
        this.state.sentiment_string = "TBD";

        this.interesting_text = "";
        this.text_vis = false;
        this.int_texts = [];
        this.word_cloud = [];
        this.word_vis = false;
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ value });
        this.setState({ word_vis: false, word_cloud: [] });

        if (this.timeout) clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            if (this.state.value.length < 1)
                return this.setState(initialSearchState);

            this.getData(value);
        }, 1500);
    };

    render() {
        return (
            <Grid container>
                <Grid.Row centered style={{ padding: "50pt 0 0 0" }}>
                    <div className="logo">vibecheck</div>
                </Grid.Row>
                <Grid.Row centered style={{ padding: "50pt 0 0 0" }}>
                    <Search
                        className="search-bar"
                        loading={this.state.isLoading}
                        placeholder="what's on your mind?"
                        onSearchChange={_.debounce(
                            this.handleSearchChange,
                            500,
                            { leading: true }
                        )}
                        value={this.state.value}
                        open={false}
                        {...this.props}
                    />
                </Grid.Row>
                <Grid.Row centered style={{ padding: "20pt 0 0 0" }}>
                    <div className="header">
                        {"Sentiment Score: " + this.state.avg_sentiment}
                    </div>
                </Grid.Row>
                <Grid.Row centered style={{ padding: "5pt 0 0 0" }}>
                    <div className="header">
                        {"Vibes: " + this.state.sentiment_string}
                    </div>
                </Grid.Row>
                <Grid.Row centered style={{ padding: "5pt 0 0 0" }}>
                    <InterestingText
                        text_vis={this.state.text_vis}
                        int_text={this.state.interesting_text}
                        refreshText={this.refreshText.bind(this)}
                    />
                </Grid.Row>
                <Grid.Row centered style={{ padding: "50pt 0 0 0" }}>
                    <SimpCloud
                        words={this.state.word_cloud}
                        word_vis={this.state.word_vis}
                    />
                </Grid.Row>
            </Grid>
        );
    }

    getData(search) {
        this.setState({ isLoading: true });
        fetch(
            `/search/${search}/${this.props.options.reddit}/${this.props.options.twitter}/${this.props.options.news}`
        )
            .then((res) => res.json())
            .then((data) => {
                this.setState({ isLoading: false });
                console.log(data);
                let avg_sent = data.avg_sentiment; //data.avg_sentiment
                let samples = data.sample;
                let sent_string = "neutral";
                if (avg_sent >= 0.05) {
                    sent_string = "positive";
                } else if (avg_sent <= -0.05) {
                    sent_string = "negative";
                }
                this.setState({
                    avg_sentiment: avg_sent,
                    sentiment_string: sent_string,
                    interesting_text: samples[0],
                    text_vis: true,
                    int_texts: samples,
                    word_cloud: data.word_count,
                    word_vis: true,
                });
            });
    }
    refreshText() {
        let index = Math.floor(
            Math.random() * (this.state.int_texts.length - 1)
        );
        this.setState({
            interesting_text: this.state.int_texts[index],
        });
    }
}

export default ContentSearch;
