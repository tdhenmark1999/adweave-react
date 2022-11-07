import { useState, useEffect } from 'react';
import {
  Stack,
  Box,
  Card,
  Divider,
  Typography,
  IconButton,
  Button,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  ListItem,
} from '@mui/material';
import SkeletonLoader from 'components/Project/Header/skeleton';
import Fade from 'components/Common/Fade';
import { fetchDashboardFilter } from 'store/reducers/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { appColors } from 'theme/variables';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';

const Counter = ({ color, count, options, name, icon }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterDateLabel, setfilterDateLabel] = useState('This Week');
  const [filterLabel, setfilterLabel] = useState('');
  const { data_filter, fetching } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  useEffect(() => {
    const itemDashboardFilter1 = [];

    dispatch(fetchDashboardFilter(itemDashboardFilter1));
    setfilterLabel(count);
  }, []);

  useEffect(() => {
    setfilterLabel(count);
  }, [count]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // setfilterLabel(data_filter);
  };

  const handleClickBtn = (data) => {
    setAnchorEl(null);
    setfilterDateLabel(data);
    const itemDashboardFilter = [];

    if (name == 'Open Tickets') {
      itemDashboardFilter.push({
        filter: {
          open_ticket: data.replace(/ /g, '_').toLowerCase(),
        },
      });
    } else if (name == 'Task with Revision') {
      itemDashboardFilter.push({
        filter: {
          task_with_revision: data.replace(/ /g, '_').toLowerCase(),
        },
      });
    } else if (name == 'Task Approved') {
      itemDashboardFilter.push({
        filter: {
          task_approved: data.replace(/ /g, '_').toLowerCase(),
        },
      });
    } else if (name == 'Task Completed') {
      itemDashboardFilter.push({
        filter: {
          task_completed: data.replace(/ /g, '_').toLowerCase(),
        },
      });
    }

    dispatch(fetchDashboardFilter(itemDashboardFilter[0]));
    setfilterLabel(data_filter);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return count == null ? (
    <SkeletonLoader />
  ) : (
    <Fade in={count != null}>
      <>
        {' '}
        <Card
          variant="outlined"
          sx={{ overflow: 'visible', borderRadius: '9px' }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <IconButton
                size="large"
                sx={{
                  backgroundColor: appColors.dashboard[color],
                  marginTop: '-1em',
                  marginLeft: '0.5em',
                  '&:hover': {
                    backgroundColor: appColors.dashboard[color],
                  },
                  borderRadius: '8px',
                  cursor: 'initial',
                }}
                disableRipple
              >
                {icon}
              </IconButton>
            </Box>
            <Stack py={1} px={2} alignItems="flex-end">
              <Box>
                <Button
                  onClick={handleClick}
                  startIcon={<ExpandMoreIcon />}
                  size="small"
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 700,
                    padding: '0.2em 0.6em 0.2em 0.4em',
                    '&:hover': {
                      backgroundColor: appColors.dashboard[color],
                      color: '#fff',
                    },
                  }}
                >
                  {filterDateLabel}
                </Button>
              </Box>
              <Typography
                variant="h6"
                fontWeight={700}
                color={appColors.dashboard[color]}
                sx={{ paddingRight: '0.5em' }}
              >
                {filterLabel}
              </Typography>
            </Stack>
          </Stack>

          <Divider />
          <Box px={2} py={1}>
            <Typography fontWeight={700} color={appColors.dashboard[color]}>
              {name}
            </Typography>
          </Box>
        </Card>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <List dense={true}>
            {options.map((data, index) => (
              <ListItem
                onClick={() => handleClickBtn(data)}
                key={index}
                secondaryAction={
                  <IconButton size="small" edge="end" color="secondary">
                    {filterDateLabel == data ? <CheckIcon /> : ''}
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton role={undefined} dense>
                  <ListItemText primary={data} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Popover>
      </>
    </Fade>
  );
};

Counter.propTypes = {
  color: PropTypes.string,
  count: PropTypes.number,
  options: PropTypes.array,
  name: PropTypes.string,
  icon: PropTypes.any,
};

export default Counter;
