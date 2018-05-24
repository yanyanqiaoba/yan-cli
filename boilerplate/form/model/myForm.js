import { message } from 'antd';
import { fakeSubmitForm } from '../services/api';

export default {
  namespace: '${lowerFormName}',

  state: {
    submitting:false,
  },

  effects: {
    *submitBasicForm({ payload }, { put, call }) {
      yield put({
        type:'setSubmitting',
        payload:true,
      });
      const data = yield call(fakeSubmitForm, payload);
      if (data.message === 'Ok'){
        message.success('提交成功');
      } else {
        message.error('提交失败');
      }
      yield put({
        type:'setSubmitting',
        payload:false,
      });
    },

  },

  reducers: {
    setSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
