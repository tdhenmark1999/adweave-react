// Redux
import { createSlice } from '@reduxjs/toolkit';

import {
  fetchCampaignsSpecific,
  requestUpdateCampaignBykey,
  fetchTimelog,
} from 'services/api/campaign';
import {
  requestUpdateTaskByKey,
  requestUpdateTask as requestUpdateStatus,
} from 'services/api/tasks';

const initialState = {
  list: [],
  timelog: [],
  isFetching: false,
  error: null,
};

const campaign = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    initCampaign: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    validateCampaign: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    isSuccess: (state, { payload }) => {
      state.list = payload;
      state.isFetching = false;
    },
    isSuccessTimelog: (state, { payload }) => {
      state.timelog = payload;
      state.isFetching = false;
    },
    isError: (state, { payload }) => {
      state.error = payload;
      state.isFetching = false;
    },
    errorTask: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
    successUpdateByKey: (state, { payload }) => {
      return { ...state, list: { ...state.list, ...payload.data } };
    },
  },
});

export const {
  initCampaign,
  isSuccessTimelog,
  validateCampaign,
  isSuccess,
  isError,
  successUpdateByKey,
  errorTask,
} = campaign.actions;

export const fetchCampaignsList = (id) => async (dispatch) => {
  dispatch(initCampaign());

  const { success, data, message } = await fetchCampaignsSpecific(id);

  if (success) {
    dispatch(isSuccess(data));
  } else {
    dispatch(isError(message));
  }
};

export const fetchTimelogList = (id) => async (dispatch) => {
  dispatch(initCampaign());

  const { success, data, message } = await fetchTimelog(id);

  if (success) {
    dispatch(isSuccessTimelog(data));
  } else {
    dispatch(isError(message));
  }
};

export const updateCampaignByKey = (params) => async (dispatch) => {
  const { success, data, message } = await requestUpdateCampaignBykey(params);

  success ? dispatch(validateCampaign()) : dispatch(errorTask(message));
};

export const updateCampaignByKey2 = (params) => async (dispatch) => {
  const { success, data, message } = await requestUpdateTaskByKey(params);

  success
    ? dispatch(updateData(params.key, data))
    : dispatch(errorTask(message));
};

export const updateCampaignStatus = (params) => async (dispatch) => {
  const { success, data, message } = await requestUpdateStatus(params);

  success
    ? dispatch(updateData(params.key, data))
    : dispatch(errorTask(message));
};

const updateData = (type, data) => {
  switch (type) {
    case 'status':
      return successUpdateByKey({
        id: data.id,
        isParent: data.is_parent,
        data: {
          status: data.status,
          status_id: data.status_id,
        },
      });

    case 'priority':
      return successUpdateByKey({
        id: data.id,
        isParent: data.is_parent,
        data: {
          priority_description: data.priority_description,
          priority_id: data.priority_id,
        },
      });

    case 'assignees':
      return successUpdateByKey({
        id: data.id,
        isParent: data.is_parent,
        data: { assignees: data.assignees },
      });

    case 'watcher':
      return successUpdateByKey({
        id: data.id,
        isParent: data.is_parent,
        data: { watcher: data.watcher },
      });

    case 'due_date':
      return successUpdateByKey({
        id: data.id,
        isParent: data.is_parent,
        data: { due_date: data.due_date },
      });

    case 'delivery_date':
      return successUpdateByKey({
        id: data.id,
        isParent: data.is_parent,
        data: { delivery_date: data.delivery_date },
      });
    case 'pin':
      return successUpdateByKey({
        id: data.id,
        isParent: data.is_parent,
        data: { is_pinned: data.is_pinned },
      });
  }
};

export default campaign.reducer;
