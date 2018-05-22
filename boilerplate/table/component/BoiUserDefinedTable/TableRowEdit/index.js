import React , {Component} from 'react';
import {Row, Col, Input} from 'antd';

class TableRowEdit extends Component{

  handleInputChange = (e, fieldName) => {

  }

  render(){
    const {data, columns} = this.props;
    const views = [];
    columns.forEach((item)=>{
      views.push(
        <Row style={{marginTop : 8}} key={item.key}>
          <Col span={6}>
            {item.title}
          </Col>
          <Col span={18}>
            <Input
              value={data[item.dataIndex]}
              onChange={e => this.handleInputChange(e, item.dataIndex)}
            />
          </Col>
        </Row>
      );
    });
    return(
      <div>{views}</div>
    );
  }
}

export default TableRowEdit;
