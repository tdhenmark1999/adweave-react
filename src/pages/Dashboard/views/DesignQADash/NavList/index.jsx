import React, { useState, useEffect } from 'react';

import * as queryString from 'query-string';

import { useHistory } from 'react-router-dom';

import _ from 'lodash';

import PropTypes from 'prop-types';

import {
  Stack,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
  IconButton,
  Collapse,
} from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { appColors } from 'theme/variables';

let queue = '',
  status = [],
  taskTypes = [];

export default function NavList({
  title,
  options,
  user,
  queueCount,
  filterQueues,
}) {
  const history = useHistory();
  const [isCollapse, setCollpase] = useState(false);

  useEffect(() => {
    queue = !_.isEmpty(queryString.parse(location.search)?.queue)
      ? queryString.parse(location.search)?.queue
      : '';

    status = !_.isEmpty(queryString.parse(location.search)?.statuses)
      ? queryString.parse(location.search)?.statuses.split(',')
      : [];
    taskTypes = !_.isEmpty(queryString.parse(location.search)?.taskTypes)
      ? queryString.parse(location.search)?.taskTypes.split(',')
      : [];
  }, [queue, status, taskTypes]);

  const queueFilters = (type, name) => {
    const searchParams = new URLSearchParams(history.location.search);

    switch (type) {
      case 'status':
        !status.includes(name.toLowerCase())
          ? status.push(name.toLowerCase())
          : (status = _.filter(
              status,
              (selStat) => selStat !== name.toLowerCase()
            ));

        _.isEmpty(status)
          ? searchParams.delete('statuses')
          : searchParams.set('statuses', status);

        break;
      case 'queue':
        searchParams.set('queue', name);
        queue = name;
        break;
      default:
        !taskTypes.includes(name.toLowerCase())
          ? taskTypes.push(name.toLowerCase())
          : (taskTypes = _.filter(
              taskTypes,
              (selTypes) => selTypes !== name.toLowerCase()
            ));

        _.isEmpty(taskTypes)
          ? searchParams.delete('taskTypes')
          : searchParams.set('taskTypes', taskTypes);
        break;
    }

    history.push({
      pathname: '/dashboard',
      search: searchParams.toString(),
    });

    filterQueues(queue, status, taskTypes);
  };

  switch (title.toLowerCase().replace(/ /g, '_')) {
    case 'statuses':
      return (
        <Stack pr={2} py={1}>
          <Stack
            pl={3}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" spacing={2.5}>
              <Typography
                fontWeight={800}
                variant="button"
                color={appColors.lightViolet}
                lineHeight="inherit"
              >
                {title}
              </Typography>
              <Badge
                color="primary"
                badgeContent={status.length}
                sx={{
                  marginRight: '0.5em',
                  marginTop: '-0.2em',
                  '.MuiBadge-badge': {
                    fontSize: '0.5em',
                    fontWeight: 800,
                    height: '1.7em',
                  },
                }}
              />
            </Stack>
            <Box>
              <IconButton
                sx={{ marginTop: '-0.2em' }}
                size="small"
                onClick={() => setCollpase(!isCollapse)}
              >
                {!isCollapse ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowUpIcon />
                )}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={isCollapse}>
            <Box>
              <List component="nav" dense sx={{ padding: 0 }}>
                {_.filter(options, (stats) =>
                  _.map(
                    stats?.related_to,
                    (types) => types.name === 'task'
                  ).includes(true)
                ).map((stats, index) => (
                  <ListItem
                    sx={{ padding: 0 }}
                    key={index}
                    secondaryAction={
                      status.includes(stats?.name?.toLowerCase()) && (
                        <CheckIcon color="secondary" />
                      )
                    }
                  >
                    <ListItemButton
                      sx={{
                        paddingLeft: 0,
                        borderRadius: '0 0.3em 0.3em 0',
                        marginBottom: '0.15em',
                      }}
                      onClick={() => queueFilters('status', stats?.name)}
                      selected={status.includes(stats?.name?.toLowerCase())}
                    >
                      <ListItemText
                        sx={{
                          '.MuiTypography-root': {
                            fontWeight: 700,
                            paddingLeft: '2em',
                          },
                        }}
                      >
                        {stats?.name}
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Collapse>
        </Stack>
      );

    case 'task_types':
      return (
        <Stack pr={2} py={1}>
          <Stack
            pl={3}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" spacing={2.5}>
              <Typography
                fontWeight={800}
                variant="button"
                color={appColors.lightViolet}
                lineHeight="inherit"
              >
                {title}
              </Typography>
              <Badge
                color="primary"
                badgeContent={taskTypes.length}
                sx={{
                  marginRight: '0.5em',
                  marginTop: '-0.2em',
                  '.MuiBadge-badge': {
                    fontSize: '0.5em',
                    fontWeight: 800,
                    height: '1.7em',
                  },
                }}
              />
            </Stack>

            <Box>
              <IconButton
                sx={{ marginTop: '-0.2em' }}
                size="small"
                onClick={() => setCollpase(!isCollapse)}
              >
                {!isCollapse ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowUpIcon />
                )}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={isCollapse}>
            <Box>
              <List component="nav" dense sx={{ padding: 0 }}>
                {_.filter(
                  _.filter(options, (dataList) => !_.isEmpty(dataList?.name)),
                  (dataAuth) =>
                    [3, 5].includes(user?.team_id) &&
                    user?.admin_role?.toLowerCase() !== 'admin'
                      ? dataAuth?.team_id === user?.team_id
                      : dataAuth
                ).map((taskType, index) => (
                  <ListItem
                    sx={{ padding: 0 }}
                    key={index}
                    secondaryAction={
                      taskTypes.includes(taskType?.name?.toLowerCase()) && (
                        <CheckIcon color="secondary" />
                      )
                    }
                  >
                    <ListItemButton
                      sx={{
                        paddingLeft: 0,
                        borderRadius: '0 0.3em 0.3em 0',
                        marginBottom: '0.15em',
                      }}
                      onClick={() => queueFilters('taskType', taskType?.name)}
                      selected={taskTypes.includes(
                        taskType?.name?.toLowerCase()
                      )}
                    >
                      <ListItemText
                        sx={{
                          '.MuiTypography-root': {
                            fontWeight: 700,
                            paddingLeft: '2em',
                          },
                        }}
                      >
                        {taskType?.name}
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Collapse>
        </Stack>
      );
    default:
      return (
        <Stack pr={2} py={1}>
          <Box pl={3}>
            <Typography
              fontWeight={800}
              variant="button"
              color={appColors.lightViolet}
            >
              {title}
            </Typography>
          </Box>
          <Box>
            <List component="nav" dense sx={{ padding: 0 }}>
              {options.map((option, index) => (
                <ListItem
                  sx={{ padding: 0 }}
                  secondaryAction={
                    <Badge
                      color={queue === option?.slug ? 'primary' : 'secondary'}
                      badgeContent={queueCount[option?.slug]}
                      max={999}
                      sx={{
                        marginRight: '0.5em',
                        marginTop: '-0.2em',
                      }}
                      showZero
                    />
                  }
                  key={index}
                >
                  <ListItemButton
                    sx={{
                      paddingLeft: 0,
                      borderRadius: '0 0.3em 0.3em 0',
                      '&.Mui-selected': {
                        background: '#f220763d',
                        '&:hover': {
                          background: '#5025c41f',
                        },
                      },
                    }}
                    selected={queue === option?.slug}
                    onClick={() => queueFilters('queue', option?.slug)}
                  >
                    <ListItemText
                      sx={{
                        '.MuiTypography-root': {
                          fontWeight: 700,
                          paddingLeft: '2em',
                        },
                      }}
                    >
                      {option?.name}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Stack>
      );
  }
}

NavList.propTypes = {
  title: PropTypes.string,
  options: PropTypes.any,
  user: PropTypes.any,
  queueCount: PropTypes.any,
  filterQueues: PropTypes.func,
};
