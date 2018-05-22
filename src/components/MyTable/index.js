import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Transfer, Button, Modal, message, Input } from 'antd';
import TableRowEdit from './TableRowEdit/index';
import styles from './index.less';

const DEFAULT_PAGESIZE = 10;

class MyTable extends PureComponent {
  constructor(props) {
    super(props);

    const transferData = [];
    const defaultColumns = this.props.defaultColumns || [];
    const columns = this.props.columns || [];
    this.url = this.props.requestData.url;
    this.pageSize = this.props.pageSize || DEFAULT_PAGESIZE;
    this.supportPaging = this.props.supportPaging;
    this.showBorder = this.props.showBorder;

    this.props.dispatchAction({
      type:'myTable/setNewColumnsAction',
      payload:defaultColumns.length > 0 ? defaultColumns : columns,
    });

    // 根据columns props生成穿梭框的数据源
    if (columns.length > 0) {
      columns.forEach((item) => {
        transferData.push({
          key: item.key,
          title: item.title,
        });
      });
    }

    // 根据defaultColumns props生成穿梭框右边已选择的列
    // 若没有defaultColumns，取columns全量数据
    const targetKeys = [];
    if (defaultColumns.length > 0) {
      defaultColumns.forEach((item) => {
        targetKeys.push(item.key);
      });
    } else {
      columns.forEach((item) => {
        targetKeys.push(item.key);
      });
    }

    this.state = {
      // 穿梭框状态
      selectedKeys: [],
      targetKeys,
      transferData,

      // 远程加载数据
      data: [],

      // 编辑table的modal
      tableModalVisible: false,
      tableModalRowData: [],
    };
  }

  index = 0;
  cacheOriginData = {};

  componentDidMount() {
    this.fetchDataSource(this.props.requestData);

  }

  getRowByKey(key, newData) {
    return (newData || this.props.data).filter(item => item.key === key)[0];
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.props.dispatchAction({
        type:'myTable/setTableDataAction',
        payload:newData,
      });
    }
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.props.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.props.dispatchAction({
      type:'myTable/setTableDataAction',
      payload:newData,
    });
    this.clickedCancel = false;
  }

  onSelectColumns = () => {
    const { targetKeys } = this.state;
    if (targetKeys.length === 0) {
      message.error('请选择需要展示的列');
      return;
    }
    // 根据trandfer选择的列更新table中的columns
    const newColumnsTmp = this.props.columns.filter(item => targetKeys.indexOf(item.key) !== -1);

    this.props.dispatchAction({
      type:'myTable/setTransferModalAction',
      payload:false,
    });

    this.props.dispatchAction({
      type:'myTable/setNewColumns',
      payload:newColumnsTmp,
    });


  };

  settingColumns = () => {
    this.props.dispatchAction({
      type:'myTable/setTransferModalAction',
      payload:true,
    })
  };

  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.props.dispatchAction({
      type:'myTable/setTableDataAction',
      payload:newData,
    });
    // todo your delete data action
  }

  fetchDataSource = (requestData) => {
    this.props.dispatchAction({
      type:'myTable/setTableLoadingAction',
      payload:true,
    });
    const params = this.supportPaging ? {
      ...requestData.params,
      pageSize: this.pageSize,
    } : {};
    // 根据props初始化pagination
    let paginationInit = {};
    if (this.supportPaging) {
      paginationInit = {
        current: 1,
        pageSize: this.pageSize,
        showQuickJumper: true,
        showTotal: total => `总计 ${total} 条`,
      };
    }
    this.props.dispatchAction({
      type:'myTable/fetchTableDataAction',
      payload:{
        url:this.url,
        params,
        supportPaging:this.supportPaging,
        pagination:paginationInit,
      },
    });
  };

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({
      targetKeys: nextTargetKeys,
    });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({
      selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys],
    });
  };

  hideModal = () => {
    this.props.dispatchAction({
      type:'myTable/setTransferModal',
      payload:false,
    })
  };

  hideTableModal = () => {
    this.setState({
      tableModalVisible: false,
    });
  };

  saveTableRow = () => {

  };

  handleTableChange = (pagination, filters, sorter) => {
    if (!this.supportPaging) {
      return;
    }

    this.props.dispatchAction({
      type:'myTable/setTableLoadingAction',
      payload:true,
    });

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.props.dispatchAction({
      type:'myTable/fetchTableDataAction',
      payload:{
        url:this.url,
        params,
        supportPaging:this.supportPaging,
        pagination,
      },
    });

  };

  toggleEditable = (e, key) => {
    if (this.props.useDirectEdit) {
      e.preventDefault();
      const newData = this.props.data.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      if (target) {
        // 进入编辑状态时保存原始数据
        if (!target.editable) {
          this.cacheOriginData[key] = { ...target };
        }
        target.editable = !target.editable;
        this.props.dispatchAction({
          type:'myTable/setTableDataAction',
          payload:newData,
        });
      }
    } else {
      const newData = this.props.data.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      debugger;
      this.setState({
        tableModalVisible: true,
        tableModalRowData: target,
      });
    }

  };

  saveRow(e, key) {
    e.persist();
    this.props.dispatchAction({
      type:'myTable/setTableLoadingAction',
      payload:true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.name || !target.request_type || !target.url) {
        message.error('请填写完整。');
        e.target.focus();
        this.props.dispatchAction({
          type:'myTable/setTableLoadingAction',
          payload:false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      // todo save data action
      this.props.dispatchAction({
        type:'myTable/setTableLoadingAction',
        payload:false,
      });
    }, 500);
  }

  render() {
    const { targetKeys, selectedKeys, transferData, tableModalVisible, tableModalRowData } = this.state;
    const { rowKey, showSelfColumns ,modalVisible, newColumns, loading ,data, pagination} = this.props;

    const buttonClass = showSelfColumns ? styles['button-show'] : styles['button-hide'];

    return (
      <div className={styles.userDefinedTable}>
        <Button className={buttonClass} icon="setting" size="small" onClick={this.settingColumns}>选择需要展示的列</Button>
        <Table
          style={{ 'marginTop': '10px' }}
          rowKey={rowKey || 'key'}
          columns={newColumns}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={this.handleTableChange}
          locale={{ 'emptyText': '暂无数据', 'filterConfirm': '确定', 'filterReset': '重置' }}
          bordered={this.showBorder}
        />
        <Modal
          title="选择显示列"
          visible={modalVisible}
          onOk={this.onSelectColumns}
          onCancel={this.hideModal}
          okText="确定"
          cancelText="取消"
        >
          <Transfer
            dataSource={transferData}
            titles={['Source', 'Target']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            render={item => item.title}
          />
        </Modal>
        <Modal
          title="编辑表格内容"
          visible={tableModalVisible}
          destroyOnClose
          onOk={this.saveTableRow}
          onCancel={this.hideTableModal}
          okText="确定"
          cancelText="取消"
        >
          <TableRowEdit data={tableModalRowData} columns={this.props.columns} />
        </Modal>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatchAction:(params)=>{
      dispatch({
        type:params.type,
        payload:params.payload,
      })
    },

  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(({ myTable }) => ({
  modalVisible: myTable.modalVisible,
  loading:myTable.loading,
  data:myTable.data,
  tableModalVisible:myTable.tableModalVisible,
  newColumns:myTable.newColumns,
  pagination:myTable.pagination,
}),mapDispatchToProps,mergeProps,{ withRef: true })(MyTable);
