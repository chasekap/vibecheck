import _ from "lodash";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Wordcloud from "wordcloud";
import {
    Dropdown,
    Menu,
    Grid,
    Search,
    Container,
    Header,
} from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
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

class SimpCloud extends React.Component {

    componentDidUpdate() {
    
      const list = this.props.words;
      Wordcloud(
        this.refs["my-canvas"],
        {list: list,color: '#000000',fontFamily:'Tahoma, Geneva, sans-serif',drawOutOfBound:false}

      );
      
    }

    render() {
      if (this.props.word_vis == true){
      return (<div>
        <div id="html-canvas" ref="my-canvas" style={{width:this.props.words.length * 8,height:this.props.words.length * 8}}/>
      </div>)
      }
      else{
          return(
          <div ref="my-canvas"/>)
      }
    }
}

class Page extends React.Component {
    constructor(props) {  //this is now the parent component of HeaderMenu and Search
        super(props);

        this.state = {reddit: true, 
                      twitter: false, 
                      amount: 1000, 
                      date: 'week'};
      }
      updateReddit(){
          this.setState({
            reddit: !this.state.reddit
          });
        }
      updateTwitter(){
            this.setState({
              twitter: !this.state.twitter
            });
      }

    render() {
        return (
            <Router>
                <div>
                    <HeaderMenu options={this.state} upRed={this.updateReddit.bind(this)} upTwit={this.updateTwitter.bind(this)}/>
                    <Switch>
                        <Route exact path="/">
                            <ContentSearch options={this.state} />
                        </Route>
                        <Route path="/trends">
                            <ContentTrends />
                        </Route>
                        <Route path="/info">
                            <ContentInfo />
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
               <Menu.Item
                class="icon"> 
               <div class="ui simple dropdown">
                   <i class="cog icon"></i>
    <div class="menu">
      <div onClick={this.props.upRed} class="item" > <span style={{color: red ?'#000000':'#aaaaaa'}}>Reddit <i class="mini reddit icon"></i></span> </div> 
      <div onClick={this.props.upTwit} class="item" > <span  style={{color: twit ?'#000000':'#aaaaaa'}}>Twitter <i class="mini twitter icon"></i></span> </div>  
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
class InterestingText extends React.Component {
    render() {
        if (this.props.text_vis) {
            return (
                <>
                    <Grid.Row
                        fixed="true"
                        centered
                        style={{ padding: "20pt 0 0 0" }}
                    >
                        <div style={{ padding: "0 0 0 5pt" }}>
                            {this.props.int_text}
                        </div>
                    </Grid.Row>
                    <Grid.Row style={{ padding: "10pt 0 0 0" }} centered>
                        <button
                            className="ui icon button mini"
                            onClick={this.props.refreshText}
                            style={{ background: "white", padding: "0 0 0 0" }}
                        >
                            <i className="undo icon"></i>
                        </button>
                    </Grid.Row>
                </>
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
        this.search_loading = false;
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value });
        this.setState({ word_vis: false, word_cloud: [] });

        if (this.timeout) clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            if (this.state.value.length < 1)
                return this.setState(initialSearchState);

            this.getData(value);

            this.setState({
                isLoading: false,
            });
        }, 1500);
    };

    render() {
        return (
            <Grid container>
                <Grid.Row centered style={{ padding: "0 -20pt 0 0" }}>
                    <SimpCloud
                        words={this.state.word_cloud}
                        word_vis={this.state.word_vis}
                    />
                </Grid.Row>

                <Grid.Row centered style={{ padding: "50pt 0 0 0" }}>
                    <div className="logo">vibecheck</div>
                </Grid.Row>
                <Grid.Row centered style={{ padding: "50pt 0 0 0" }}>
                    <Search
                        className="search-bar"
                        loading={this.state.search_loading}
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
                    text_vis={this.state.text_vis}	                  int_text={this.state.interesting_text}
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
        this.state.search_loading = true;
        fetch(`/search/${search}/${this.props.options.reddit}/${this.props.options.twitter}`)
            .then((res) => res.json())
            .then((data) => {
                this.state.search_loading = false;
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
class ContentInfo extends React.Component {
    render() {
        return (
            <Grid container>
                <Grid.Row centered style={{ padding: "50pt 0 0 0" }}>
                    <Container fluid textAlign="left">
                        <Header as="h2">
                            The Nature of vibecheck's Content
                        </Header>
                        <p>
                            With the goal of analysing information gathered from
                            the public discussions on the open web,{" "}
                            <em>vibecheck</em> does not filter the data that is
                            analysed and delivered to users upon the search of a
                            query. However, this means that disagreeable,
                            inappropriate, false, inflammatory, or unacceptable
                            language may be analysed and may appear when a
                            search is performed. Furthermore, this kind of data
                            may appear for search topics that may seem free of
                            objectionable discussion. Please be advised that
                            this tool will search the entirety of the sites that
                            it indexes and that anything that appears upon the
                            completion of a search is not necesarily
                            representative of the views or opinions of this
                            site's creators. In fact, all data shown upon a
                            search is generated by users from the sites that{" "}
                            <em>vibecheck</em> indexes; no results have been
                            created or modified by the developers of this site.
                            <em> Proceed with caution.</em>
                        </p>

                        <Header as="h2">The Sentiment Score</Header>
                        <p>
                            At times, the sentiment score may seem to return
                            strange or annoyingly-neutral results. This is
                            normal; we're taking into account any comment that
                            the tool finds during processing, so a plethora of
                            negative sentiment may end up canceled out by a
                            plethora of positive sentiment, leaving you with a
                            fairly neutral score. Additonally, you may find that
                            the score and results change between multiple
                            searches of the same query, even within a few
                            minutes of each other. This is also normal; the
                            primary cause of this variance are the interfaces
                            (APIs) we're using to gather data from platforms. A
                            search of a term on a certain platform will often
                            yield differing results due to a variety of
                            limitations present in the API that allows us to
                            obtain this data, so the same search may lead to the
                            analysis of different datasets.
                        </p>

                        <Header as="h2">Privacy Policy</Header>
                        <p>
                            We care about the privacy of our users. Thus, we
                            collect the minimum amount of information required
                            to keep this site working as intended. Each search
                            and its results are recorded; however, no personally
                            identifying nformation is associated with any of
                            these searches. Furthermore, we collect no
                            personally identifying information upon any other
                            action taken on the site, nor do we use cookies.
                        </p>
                    </Container>
                </Grid.Row>
            </Grid>
        );
    }
}
class ContentTrends extends React.Component {
    render() {
        return (
            <div>
                Trends
            </div>
        );
    }
}

ReactDOM.render(<Page />, document.getElementById("root"));