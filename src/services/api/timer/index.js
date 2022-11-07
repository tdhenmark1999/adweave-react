import api from 'utils/api';

export const requestGetPresetCategories = () =>
  api.callGet(`admin/task-category/presets?limit=1000`);

export const fetchDatasourcesRequest = () => api.callGet('admin/task-timer/');

export const fetchActiveTimerRequest = () =>
  api.callGet('admin/task-timer/running');

export const fetchUserTimeLogsRequest = (userId) =>
  api.callGet(`admin/task-timer/user-timelog/${userId}`);

export const fetchPartnersRequest = () =>
  api.callGet('admin/task-timer/get-partners');

export const fetchConceptsequest = () =>
  api.callGet(`admin/task-timer/get-concepts`);

export const fetchCampaignsRequest = () =>
  api.callGet(`admin/task-timer/get-campaigns`);

export const startTimerRequest = (params) =>
  api.callPost(`admin/task-timer/start`, params);

export const playRunningTimerRequest = (params) =>
  api.callPost(`admin/task-timer/play`, params);

export const pauseRunningTimerRequest = (params) =>
  api.callPost(`admin/task-timer/pause`, params);

export const stopRunningTimerRequest = (params) =>
  api.callPost(`admin/task-timer/stop`, params);

export const updateTimerRequest = (params) =>
  api.callPost(`admin/task-timer/update`, params);
