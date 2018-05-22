import { message } from 'antd';
import { getRequest } from '../services/api';

export default {
  namespace: '${lowerTableName}',

  state: {
    modalVisible: false,
    loading:true,

    data:[],
    tableModalVisible:false,

    newColumns:[],
    pagination:{},

  },

  effects: {
    * setTransferModalAction({ payload }, { put }) {
      yield put({
        type: 'setTransferModal',
        payload,
      });
    },

    * setNewColumnsAction({payload}, {put}) {
      yield put({
        type: 'setNewColumns',
        payload,
      })
    },

    * setTableLoadingAction({payload}, {put}) {
      yield put({
        type: 'setTableLoading',
        payload,
      })
    },

    * setPaginationAction({payload}, {put}) {
      yield put({
        type: 'setPagination',
        payload,
      });
    },

    * setTableDataAction({payload}, {put}) {
      yield put({
        type: 'setTableData',
        payload,
      })
    },

    * fetchTableDataAction({payload}, {put, call}) {
      const data = yield call(getRequest, payload.url, payload.params);
      if(data.code === 200){
        if (payload.supportPaging) {
          const pagination = { ...payload.pagination };
          pagination.total = data.total;
          yield put({
            type: 'setPagination',
            payload: pagination,
          });
        }
        yield put({
          type: 'setTableData',
          payload: data.list,
        });
      } else {
        message.error('获取table列表失败，请稍后重试');
      }
      yield put({
        type: 'setTableLoading',
        payload:false,
      })
    },

  },

  reducers: {
    setTransferModal(state, { payload }) {
      return {
        ...state,
        modalVisible: payload,
      };
    },

    setNewColumns(state, {payload}) {
      return {
        ...state,
        newColumns: payload,
      }
    },

    setTableLoading(state, {payload}) {
      return {
        ...state,
        loading: payload,
      }
    },

    setTableData(state, {payload}) {
      return {
        ...state,
        data:payload,
      }
    },

    setPagination(state, {payload}) {
      return {
        ...state,
        pagination:payload,
      }
    },

  },
};
