// React
import { useEffect } from 'react';
// Redux
import { useSelector, useDispatch } from 'react-redux';
// Router
import { useHistory, useLocation } from 'react-router-dom';
// Reducers
import { logout } from 'store/reducers/auth';
// Utilities
import _ from 'lodash';
import { getToken } from 'utils/session';

export default () => {
  const accessToken = getToken();
  const history = useHistory();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { data: user, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (
      (pathname !== '/login' ||
        pathname !== '/forgot-password' ||
        !pathname.includes('/password-reset')) &&
      !accessToken
    ) {
      history.replace(
        pathname === '/login' ||
          pathname === '/forgot-password' ||
          pathname.includes('/password-reset')
          ? pathname
          : '/login'
      );
      dispatch(logout());
    } else if (!_.isEmpty(user)) {
      if (!user.is_approved) {
        history.replace('/pending-approval');
      } else if (accessToken && user.first_login && user.is_approved) {
        history.replace('/profile');
      } else if (
        (pathname === '/login' ||
          pathname === '/forgot-password' ||
          pathname.includes('/password-reset')) &&
        accessToken &&
        !user.first_login &&
        user.is_approved
      ) {
        history.replace('/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, pathname, accessToken, user, error]);
};
