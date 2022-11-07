import { createSlice } from '@reduxjs/toolkit';

import {
  requestGetPresetCategories,
  fetchUserTimeLogsRequest,
  fetchActiveTimerRequest,
  fetchPartnersRequest,
  fetchCampaignsRequest,
  fetchConceptsequest,
  fetchDatasourcesRequest,
  startTimerRequest,
  playRunningTimerRequest,
  stopRunningTimerRequest,
  updateTimerRequest,
} from 'services/api/timer';

const initialState = {
  list: [],
  logs: [],
  active: {},
  partners: [],
  campaigns: [],
  concepts: [],
  isFetching: false,
  isUpdatingTimer: false,
  error: null,
};

const timer = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    initPresetCategories: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    initTimeLogs: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    initActiveTimer: () => {},
    startTimerStart: (state) => {
      state.isUpdatingTimer = true;
    },
    stopTimerStart: (state) => {
      state.isUpdatingTimer = true;
    },
    initPresetCategoriesSuccess: (state, { payload }) => {
      state.list = payload;
      state.isFetching = false;
    },
    initTimelogSuccess: (state, { payload }) => {
      state.isFetching = false;
      state.logs = payload;
      state.error = null;
    },
    initActiveTimerSuccess: (state, { payload }) => {
      state.active = payload;
      state.error = null;
    },
    initPartnersSuccess: (state, { payload }) => {
      state.partners = payload;
      state.error = null;
    },
    initCampaignsSuccess: (state, { payload }) => {
      state.campaigns = payload;
      state.error = null;
    },
    initConceptsSuccess: (state, { payload }) => {
      state.concepts = payload;
      state.error = null;
    },
    startTimerSuccess: (state, { payload }) => {
      state.isUpdatingTimer = false;
      state.active = payload;
    },
    stopTimerSuccess: (state) => {
      state.isUpdatingTimer = false;
      state.active = {};
    },
    initPresetCategoriesFailed: (state, { payload }) => {
      state.error = payload;
      state.isFetching = false;
      state.list = [];
    },
    initTimelogsFailed: (state, { payload }) => {
      state.error = payload;
      state.isFetching = false;
    },
    initActiveTimerFailed: (state, { payload }) => {
      state.error = payload;
      state.isFetching = false;
    },
    initPartnersFailed: (state, { payload }) => {
      state.error = payload;
    },
    initCampaignsFailed: (state, { payload }) => {
      state.error = payload;
    },
    initConceptsFailed: (state, { payload }) => {
      state.error = payload;
    },
    startTimerFailed: (state, { payload }) => {
      state.isUpdatingTimer = false;
      state.error = payload;
    },
    stopTimerFailed: (state, { payload }) => {
      state.isUpdatingTimer = false;
      state.error = payload;
    },
    updateTimerFailed: (state, { payload }) => {
      state.isUpdatingTimer = false;
      state.error = payload;
    },
  },
});

export const {
  initPresetCategories,
  initTimeLogs,
  initActiveTimer,
  initPresetCategoriesSuccess,
  startTimerStart,
  stopTimerStart,
  initTimelogSuccess,
  initActiveTimerSuccess,
  initPartnersSuccess,
  initCampaignsSuccess,
  initConceptsSuccess,
  startTimerSuccess,
  stopTimerSuccess,
  initPresetCategoriesFailed,
  initTimelogsFailed,
  initActiveTimerFailed,
  initPartnersFailed,
  initCampaignsFailed,
  initConceptsFailed,
  startTimerFailed,
  stopTimerFailed,
  updateTimerFailed,
} = timer.actions;

// fetch task datasource
export const fetchPresetCategories = () => async (dispatch) => {
  dispatch(initPresetCategories());

  const { success, data, message } = await requestGetPresetCategories();

  success
    ? dispatch(initPresetCategoriesSuccess(data.data))
    : dispatch(initPresetCategoriesFailed(message));
};

export const fetchPresetCategories2 = () => async (dispatch) => {
  dispatch(initPresetCategories());

  const { success, data, message } = await fetchDatasourcesRequest();

  // success
  //   ? dispatch(initPresetCategoriesSuccess(data.data))
  //   : dispatch(initPresetCategoriesFailed(message));
};

// fetch user time logs
export const fetchUserTimeLogs = (userId) => async (dispatch) => {
  dispatch(initTimeLogs());

  const { success, data, message } = await fetchUserTimeLogsRequest(userId);

  success
    ? dispatch(initTimelogSuccess(data))
    : dispatch(initTimelogsFailed(message));
};

// fetch active timer
export const fetchActiveTimer = () => async (dispatch) => {
  dispatch(initActiveTimer());

  const { success, data, message } = await fetchActiveTimerRequest();

  success
    ? dispatch(initActiveTimerSuccess(data))
    : dispatch(initActiveTimerFailed(message));
};

// fetch partners
export const fetchPartners = () => async (dispatch) => {
  const { success, data, message } = await fetchPartnersRequest();

  success
    ? dispatch(initPartnersSuccess(data))
    : dispatch(initPartnersFailed(message));
};

// fetch campaigns
export const fetchCampaigns = () => async (dispatch) => {
  const { success, data, message } = await fetchCampaignsRequest();

  success
    ? dispatch(initCampaignsSuccess(data))
    : dispatch(initCampaignsFailed(message));
};

// fetch concepts
export const fetchConcepts = () => async (dispatch) => {
  const { success, data, message } = await fetchConceptsequest();

  success
    ? dispatch(initConceptsSuccess(data))
    : dispatch(initConceptsFailed(message));
};

// start timer
export const startTimerById = (params) => async (dispatch) => {
  dispatch(startTimerStart());

  const { success, data, message } = await startTimerRequest(params);

  success
    ? dispatch(startTimerSuccess(data))
    : dispatch(startTimerFailed(message));
};

// play timer
export const playTimerById = (userId, params) => async (dispatch) => {
  dispatch(startTimerStart());

  const { success, data, message } = await playRunningTimerRequest(params);

  if (success) {
    dispatch(startTimerSuccess(data));
    dispatch(fetchUserTimeLogs(userId));
  } else {
    dispatch(startTimerFailed(message));
  }
};

// stop timer
export const stopTimerById = (userId, params) => async (dispatch) => {
  dispatch(stopTimerStart());

  const { success, _, message } = await stopRunningTimerRequest(params);

  if (success) {
    dispatch(stopTimerSuccess());
    dispatch(fetchUserTimeLogs(userId));
  } else {
    dispatch(startTimerFailed(message));
  }
};

// update timer
export const updateTimer = (userId, params) => async (dispatch) => {
  const { success, _, message } = await updateTimerRequest(params);

  if (success) {
    dispatch(fetchUserTimeLogs(userId));
  } else {
    dispatch(updateTimerFailed(message));
  }
};

export default timer.reducer;
