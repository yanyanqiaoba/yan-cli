import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, DatePicker, Select, Button, Card } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@Form.create()
class ${upperFormName} extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type:'${lowerFormName}/submitBasicForm',
          payload:values,
        });
      }
    });
  }
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 3 },
      },
    };

    return (
      <div style={{ marginTop: 20 }}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 24 }}>
            <FormItem
              {...formItemLayout}
              label="Select"
              hasFeedback
            >
              {getFieldDecorator('Select', {
                rules: [{
                  required: true, message: 'select type is required',
                }],
              })(
                <Select placeholder="Select type">
                  <Option value="type1">angular</Option>
                  <Option value="type2">react</Option>
                  <Option value="type3">vue</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="input"
              hasFeedback
            >
              {getFieldDecorator('input', {
                rules: [{
                  required: true, message: 'input name is required',
                }],
              })(
                <Input placeholder="input name" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="input with check"
              hasFeedback
            >
              {getFieldDecorator('regular', {
                rules: [
                  { required: true, message: 'regular check name is required' },
                  { pattern: /^[a-zA-Z0-9-]+$/, message: 'only english, number and _' },
                ],
              })(
                <Input placeholder="only english, number and _" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Date"
            >
              {getFieldDecorator('dateRange', {
                rules: [{ type: 'array', required: true, message: 'date is required' }],
              })(
                <RangePicker
                  format="YYYY-MM-DD"
                  placeholder={['begin', 'end']}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="input with prefix"
            >
              {getFieldDecorator('domain', {
                rules: [{ required: true, message: 'domain is required' }],
              })(
                <Input addonBefore="http://" addonAfter=".com" placeholder="facebook" style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 40 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

export default connect(({ ${lowerFormName} }) => ({
  submitting:${lowerFormName}.submitting,
}))(${upperFormName});
