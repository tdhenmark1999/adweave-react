import api from 'utils/api';

export const requestTimesheet = () => api.callGet('admin/task-timelog/get-all');


