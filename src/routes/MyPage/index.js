import React from 'react';
import { Divider, Popconfirm ,Input} from 'antd';
import MyTable from '../../components/MyTable/index';

import styles from './index.less';

class MyPage extends React.Component {
  state = {
    loading: false,
  };

  rowKey = (record) => {
    return record.id;
  };

  tableRef = (name) => {
    this.userDefinedTableRef = name;
  }

  render() {
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '方法',
      dataIndex: 'request_type',
      key: 'request_type',
    }, {
      title: '请求路径',
      dataIndex: 'url',
      key: 'url',
    }, {
      title: '最后更新',
      dataIndex: 'update_time',
      key: 'update_time',
    }, {
      title: '责任人',
      dataIndex: 'owner',
      key: 'owner',
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '操作',
      key: 'actions',
      render: (record) => {
        return (
          <div>
            操作
          </div>
        );

      },
    }];

    const defaultColumns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.userDefinedTableRef.getWrappedInstance().handleFieldChange(e, 'name', record.key)}
              onKeyPress={e => this.userDefinedTableRef.getWrappedInstance().handleKeyPress(e, record.key)}
              placeholder="名称"
            />
          );
        }
        return text;
      },
    }, {
      title: '方法',
      dataIndex: 'request_type',
      key: 'request_type',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.userDefinedTableRef.getWrappedInstance().handleFieldChange(e, 'request_type', record.key)}
              onKeyPress={e => this.userDefinedTableRef.getWrappedInstance().handleKeyPress(e, record.key)}
              placeholder="名称"
            />
          );
        }
        return text;
      },
    }, {
      title: '请求路径',
      dataIndex: 'url',
      key: 'url',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.userDefinedTableRef.getWrappedInstance().handleFieldChange(e, 'url', record.key)}
              onKeyPress={e => this.userDefinedTableRef.getWrappedInstance().handleKeyPress(e, record.key)}
              placeholder="名称"
            />
          );
        }
        return text;
      },
    }, {
      title: '最后更新',
      dataIndex: 'update_time',
      key: 'update_time',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        if (!!record.editable && this.state.loading) {
          return null;
        }
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={e => this.userDefinedTableRef.getWrappedInstance().saveRow(e, record.key)}>添加</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.userDefinedTableRef.getWrappedInstance().remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.userDefinedTableRef.getWrappedInstance().saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.userDefinedTableRef.getWrappedInstance().cancel(e, record.key)}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <a onClick={e => this.userDefinedTableRef.getWrappedInstance().toggleEditable(e, record.key)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.userDefinedTableRef.getWrappedInstance().remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    }];

    const requestDataWithPage = {
      url: 'http://localhost:8000/api/interfaces',
      params: {
        currentPage: 1,
      },
    };

    const showSelfColumns = true;

    const supportPaging = true;
    const pageSize = 4;
    const showBorder = false;

    const useDirectEdit = false;

    /*
      1.是否需要自定义展示列 showSelfColumns = true
        若为true，需要定义defaultColumns的值。若未定义，table展示全量数据
      2.是否全量加载数据，或分页请求 supportPaging = true
        若为true，需要定义pageSize的值。若未定义，pageSize默认10条
      3.表格是否加边框展示 showBorder = false
        若未定义，默认不展示表格边框
      4.操作列加列编辑或modal编辑功能 useDirectEdit = true


     */

    return (
      <div className={styles.main}>
        <MyTable
          columns={columns}
          defaultColumns={defaultColumns}
          showSelfColumns={showSelfColumns}

          supportPaging={supportPaging}
          pageSize={pageSize}

          showBorder={showBorder}

          rowKey={this.rowKey}
          requestData={requestDataWithPage}

          useDirectEdit={useDirectEdit}

          ref={this.tableRef}

        />


      </div>
    );
  }
}

export default MyPage;

