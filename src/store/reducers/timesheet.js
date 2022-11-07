import _ from 'lodash';

import {
    createSlice
} from '@reduxjs/toolkit';

// API's
import {
    requestTimesheet
} from 'services/api/timesheet';

const initialState = {
    data: [],
    fetching: false,
    error: null,
};


const timesheet = createSlice({
    name: 'timesheet',
    initialState,
    reducers: {
        initTimesheet: (state) => {
            state.fetching = true;
            state.error = null;
        },
        isSuccess: (state, { payload }) => {
            state.data = payload;
            state.fetching = false;
        },
        isError: (state, { payload }) => {
            state.error = payload;
            state.fetching = false;
        }
    },
});

export const { initTimesheet, isSuccess, isError } = timesheet.actions;

export const getTimesheet = () =>
    async (dispatch) => {
        dispatch(initTimesheet());
        const {
            success,
            message,
            data
        } = await requestTimesheet();

        if (success) {
            dispatch(isSuccess(data));
        } else {
            dispatch(isError(message));
        }
    };

export default timesheet.reducer;


