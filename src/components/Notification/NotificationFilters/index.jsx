import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
//MUI Components
import {
  Button,
  ToggleButtonGroup,
  Grid,
  ToggleButton,
  styled,
  Typography,
} from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { getNotification, getNotificationMarkAsRead, getNotificationUnread, getNotificationAllRead, getNotificationById } from 'store/reducers/notifications';


const StyledToggleButton = styled(ToggleButton)({
  minWidth: '64px',
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white',
    backgroundColor: '#25175a',
  },
});

const NotificationFilters = ({ navClass, dataFilter, onChange, onClick }) => {
  const { list_all, list_read, list_unread } = useSelector(
    (state) => state.notifications
  );

  return (
    <Grid container className={navClass}>
      <Grid item>
        <ToggleButtonGroup
          value={dataFilter}
          exclusive
          onChange={onChange}
          size="small"
          aria-label="text alignment"
        >
          <StyledToggleButton
            color="primary"
            value="all"
            aria-label="all aligned"
          >
            All {list_all.total}
          </StyledToggleButton>
          <StyledToggleButton value={'unread'} aria-label="unread aligned">
            Unread {list_unread.total}
          </StyledToggleButton>
          <StyledToggleButton value={'read'} aria-label="read aligned">
            Read {list_read.total}
          </StyledToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item>
        <Button onClick={onClick} variant="text">Read All</Button>
      </Grid>
    </Grid>
  );
};

NotificationFilters.propTypes = {
  navClass: PropTypes.any,
  dataFilter: PropTypes.any,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
};

export default NotificationFilters;
