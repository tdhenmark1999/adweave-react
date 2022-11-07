import { Link, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import {
  getNotification,
  getNotificationMarkAsRead,
  getNotificationAllRead,
  getNotificationById,
} from 'store/reducers/notifications';

//MUI Components
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Typography,
  Avatar,
  Badge,
  Stack,
} from '@mui/material';

const NotificationList = ({ item, list, listItemClass, descriptionClass }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { list_data: notifications, isLoading } = useSelector(
    (state) => state.notifications
  );

  const handleMarkNotif = (item) => {
    dispatch(getNotificationById(item.rel_type, item.rel_id));
    console.log('id', item.id, item.rel_type, notifications);
    dispatch(getNotificationMarkAsRead(item.id));
    console.log(
      'list_data',
      notifications.concept_id,
      notifications.partner_id
    );
    const concept_id = notifications.concept_id;
    const partner_id = notifications.partner_id;

    // setListData(grouping(notifications))
    history.push(
      `/projects/${concept_id}/concept/${partner_id}/m/${item.rel_type}/${item.rel_id}`
    );
  };

  return (
    <div style={{ margin: '0.5em 0' }}>
      <Typography variant="subtitle1" color="secondary">
        <Moment format="dddd, MMMM D, YYYY">{item.date}</Moment>
      </Typography>
      <List>
        {list.map((obj, i) => (
          <ListItem
            key={i}
            disablePadding
            className={listItemClass}
            component={Link}
            to={obj.url}
            onClick={(e) => handleMarkNotif(obj)}
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar alt={obj.create_by.toUpperCase()} src={obj.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        fontWeight={700}
                        color="primary"
                        className={descriptionClass}
                      >
                        {obj.create_by}
                      </Typography>
                      <Typography variant="body2">
                        {obj.action.toLowerCase() === 'update'
                          ? `updated a ${_.lowerCase(obj.rel_type)}`
                          : obj.action.toLowerCase() === 'create'
                          ? `created a new ${_.lowerCase(obj.rel_type)}`
                          : obj.action.toLowerCase().includes('status')
                          ? `updated the ${_.lowerCase(obj.rel_type)} status`
                          : null}
                      </Typography>
                    </Stack>
                    <Box display="flex" alignItems="center">
                      <Typography variant="caption" sx={{ minWidth: '4.5em' }}>
                        <Moment format="hh:mm A">{obj.created}</Moment>
                      </Typography>
                      <Box ml={'9px'}>
                        {obj.status === 'unread' ? (
                          <Badge
                            sx={{ display: 'flex' }}
                            color="secondary"
                            badgeContent=" "
                            variant="dot"
                            overlap="circular"
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                          />
                        ) : null}
                      </Box>
                    </Box>
                  </Box>
                }
                secondary={
                  <Typography
                    variant="caption"
                    className={descriptionClass}
                    color="#202020"
                  >
                    {obj.rel_name}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

NotificationList.propTypes = {
  list: PropTypes.array,
  listItemClass: PropTypes.any,
  descriptionClass: PropTypes.any,
  item: PropTypes.object,
  onClick: PropTypes.func,
};

export default NotificationList;
