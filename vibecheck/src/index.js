import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Input } from 'antd';
import { Row, Col} from 'antd';

const { Search } = Input; 


function getData(search){
  fetch(`/search/${search}`).then(res => res.json()).then(data => {
    console.log(data)
  });
}

const MyRow = () => (
  <Row type="flex" align="middle" style={{padding: '30% 0% 0% 0%'}}>
    <Col md={10}>
    </Col>
    <Col md={5}><div>
    <Search
placeholder="input search text"
onSearch={value => getData(value)}

/></div></Col>
<Col md={9}>
    </Col>
  </Row>
);
const rowy =  <MyRow/>
ReactDOM.render(rowy, document.getElementById('root'));