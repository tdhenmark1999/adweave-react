import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getNotification,
  getNotificationRead,
  getNotificationUnread,
  getNotificationAllRead,
} from 'store/reducers/notifications';

//MUI Components
import {
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

// Components
import NotificationList from 'components/Notification/NotificationList';
import NotificationFilters from 'components/Notification/NotificationFilters';

import _ from 'lodash';

//styles
import { useStyles } from './styles';

// group by date
const grouping = (data) => {
  const groups = _.groupBy(data, (element) => element.created.substring(0, 10));
  return _.map(groups, (items, date) => ({
    date: date,
    lists: items,
  }));
};

const Notification = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { list: notifications, isLoading } = useSelector(
    (state) => state.notifications
  );
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(getNotification());
  }, []);

  const handleAlignment = (e, value) => {
    // setFilterValue(e.target.value);
    // if (e.target.value == 'read') {
    //   dispatch(getNotificationRead());
    //   setList(grouping(notifications.data));
    //   setFilter('read');
    // } else if (e.target.value == 'unread') {
    //   dispatch(getNotificationUnread());
    //   setList(grouping(notifications.data));
    //   setFilter('unread');
    // } else {
    //   dispatch(getNotification());
    //   setList(grouping(notifications.data));
    //   setFilter('all');
    // }
  };

  const handleAlignmentReadAll = () => {
    // dispatch(getNotificationAllRead());
    // setList(grouping(notifications.data));
  };

  const handleAlignmentMarkRead = () => {
    console.log('click');
  };

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Card square className={classes.wrapper}>
        <CardHeader
          disableTypography={true}
          title="Notifications"
          className={classes.header}
        />
        <CardContent className={classes.content}>
          {_.isEmpty(notifications?.data) ? (
            <Stack p={2}>
              <Stack
                sx={{
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  boxShadow: '0 0 0 1px rgb(0 0 0 / 12%)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px',
                    borderBottom: '1px solid #e4e4e4',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '18px',
                      color: '#999',
                    }}
                  >
                    Why so empty?
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '10px',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#3f464b',
                      margin: 0,
                      fontSize: '12px',
                      lineHeight: '18px',
                      textAlign: 'left',
                    }}
                  >
                    In the near future, this space will be filled with
                    notifications about new task, updates in concept and
                    campaigns, and more. An indicator in the notification bell
                    will let you know when it&apos;s time to check back.
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          ) : (
            <Grid container direction="column" spacing={1}>
              <Grid item xs={12}>
                <NotificationFilters
                  navClass={classes.contentWrapper}
                  dataFilter={filter}
                  onChange={handleAlignment}
                  onClick={handleAlignmentReadAll}
                />
              </Grid>
              <Grid item xs={12}>
                <Box className={`scroll-shadows ${classes.box}`}>
                  {grouping(notifications?.data).map((item, index) => (
                    <NotificationList
                      item={item}
                      key={index}
                      list={item.lists}
                      onClick={handleAlignmentMarkRead}
                      listItemClass={classes.notificationList}
                      descriptionClass={classes.multiLineEllipsis}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Notification;
