import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import "antd/dist/antd.css";

import { Input } from "antd";
import { Row, Col } from "antd";
import { Layout, Menu, Breadcrumb } from "antd";

const { Header, Content, Footer } = Layout;
const { Search } = Input;

class ParentLayout extends React.Component {
    render() {
        return (
            <Layout style={{ height: "100vh", overflow: "auto" }}>
                <SearchFormContent />
            </Layout>
        );
    }
}

class SearchFormContent extends React.Component {
    render() {
        return (
            <Content>
                <div className="site-layout-content">
                    <Row
                        type="flex"
                        justify="center"
                        align="middle"
                        style={{ height: "100%" }}
                    >
                        <Col type="flex" justify="center" align="middle">
                            <Search
                                placeholder="what's on your mind?"
                                onSearch={(value) => getData(value)}
                                enterButton
                            />
                        </Col>
                    </Row>
                </div>
            </Content>
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

ReactDOM.render(
    <ParentLayout />, 
    document.getElementById("root")
);
