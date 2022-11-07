import { memo, useState } from 'react';

import { Box, Tabs, Tab } from '@mui/material';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import { requestFetchRevisionList_ } from 'store/reducers/tasks';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
// Pages
import Overview from 'pages/Task/views/LeftPanel/Overview';
import TimelogTask from 'pages/Task/views/LeftPanel/TimelogTask';
import Revisions from 'pages/Task/views/LeftPanel/Revisions';
import Escalation from 'pages/Task/views/LeftPanel//Escalation';

const LeftPanel = (id) => {
  const [value, setValue] = useState(0);
  const { url } = useRouteMatch();
  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };

  // const handleRevision = () => {
  //   dispatch(requestFetchRevisionList_(url.split('/')[7]));
  // };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', padding: '0 1em' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Overview" disableRipple />
          <Tab label="Time log" disableRipple />
          <Tab label="Revisions" disableRipple />
        </Tabs>
      </Box>
      <Box height="calc(100% - 49px)" overflow="auto" px={2} pb={2}>
        {value === 0 && <Overview />}
        {value === 1 && <TimelogTask />}
        {value === 2 && <Revisions />}
        {value === 3 && <Escalation />}
      </Box>
    </Box>
  );
};

LeftPanel.propTypes = {
  id: PropTypes.any,
};

export default memo(LeftPanel);
