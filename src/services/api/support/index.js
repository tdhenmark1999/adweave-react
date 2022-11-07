import api from 'utils/api';
import _ from 'lodash';
import { apiUrl } from 'config';

export const requestGetTickets = (id) =>
  api.callGet(
    !_.isNull(id) || !_.isEmpty(id)
      ? `admin/tickets/tickets-list?userid=${id}`
      : `admin/tickets/tickets-list`
  );

export const requestSaveTicket = (params) =>
  api.callPost(
    `admin/tickets/add??csrf_token_name=9df1fac5caccfc1962a12c0888f1aa38&subject=test subject&contactid=22&userid=22&name=ad-weave administrator&email=ad-weave@ad-lib.io&department=5&cc=kristian@ad-lib.io&assigned=24&service=7&message=test message 123 456 789&tags`
  );

export const requestTicketCount = (id) =>
  api.callGet(`admin/tickets/ticket-status-count?userid=${id}`);

export const requestTicketOptions = () =>
  api.callGet(`admin/tickets/ticket-form-list`);
