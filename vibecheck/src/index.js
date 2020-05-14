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
                <LayoutHeader />
                <SearchFormContent />
                <LayoutFooter />
            </Layout>
        );
    }
}

class LayoutHeader extends React.Component {
    render() {
        return (
            <Header
                style={{
                    position: "fixed",
                    zIndex: 1,
                    width: "100%",
                    padding: "0",
                }}
            >
                <Menu
                    theme="light"
                    inlineIndent={0}
                    mode="horizontal"
                    defaultSelectedKeys={["0"]}
                >
                    <Menu.Item key="0">Search</Menu.Item>
                    <Menu.Item key="1">Trends</Menu.Item>
                </Menu>
            </Header>
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
                        <Col type="flex" align="middle" span={10}>
                            <div style={{ fontSize: "48px" }}>vibecheck</div>
                            <Search
                                style={{ padding: "20px" }}
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

class LayoutFooter extends React.Component {
    render() {
        return (
            <Footer style={{ textAlign: "center", padding: "5px" }}>
                <div>Made with &lt;3 by vibecheck Group</div>
            </Footer>
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

ReactDOM.render(<ParentLayout />, document.getElementById("root"));
