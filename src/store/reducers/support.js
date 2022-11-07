import { createSlice } from '@reduxjs/toolkit';

import {
  requestGetTickets,
  requestSaveTicket,
  requestTicketCount,
  requestTicketOptions,
} from 'services/api/support';

const initialState = {
  data: [],
  count: {},
  options: {},
  fetching: false,
  error: null,
};

const support = createSlice({
  name: 'support',
  initialState,
  reducers: {
    initSupport: (state) => {
      state.fetching = true;
      state.error = null;
    },
    SupportSuccess: (state, { payload }) => {
      state.data = payload;
      state.fetching = false;
    },
    NewTicketSuccess: (state, { payload }) => {
      state.data = payload;
      state.fetching = false;
    },
    CountSuccess: (state, { payload }) => {
      state.count = payload;
      state.fetching = false;
    },
    OptionSuccess: (state, { payload }) => {
      state.options = payload;
      state.fetching = false;
    },
    SupportError: (state, { payload }) => {
      state.error = payload;
      state.fetching = false;
    },
  },
});

export const {
  initSupport,
  SupportSuccess,
  NewTicketSuccess,
  CountSuccess,
  SupportError,
  OptionSuccess,
} = support.actions;

export const getTickets = (id) => async (dispatch) => {
  dispatch(initSupport());
  const { success, message, data } = await requestGetTickets(id);

  console.log(id);

  if (success) {
    dispatch(SupportSuccess(data));
  } else {
    dispatch(SupportError(message));
  }
};

export const saveTicket = (params) => async (dispatch) => {
  dispatch(initSupport());
  const { success, message, data } = await requestSaveTicket(params);

  if (success) {
    dispatch(NewTicketSuccess(data));
  } else {
    dispatch(SupportError(message));
  }
};

export const getTicketCount = (id) => async (dispatch) => {
  dispatch(initSupport());

  const { success, message, data } = await requestTicketCount(id);

  if (success) {
    dispatch(CountSuccess(data.data[0]));
  } else {
    dispatch(SupportError(message));
  }
};

export const getTicketOptions = () => async (dispatch) => {
  dispatch(initSupport);

  const { success, message, data } = await requestTicketOptions();

  if (success) {
    dispatch(OptionSuccess(data));
  } else {
    dispatch(SupportError(message));
  }
};

export default support.reducer;
