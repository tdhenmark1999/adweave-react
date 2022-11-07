import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DataGrid } from '@mui/x-data-grid';

// MUI Components
import { Box, Stack, IconButton } from '@mui/material';
import { formatDate } from 'utils/date';
import { getTimesheet } from 'store/reducers/timesheet';

// App Components
import SkeletonLoader from 'pages/Maintenance/Components/Skeleton';
import Header from 'pages/TimerSheet/views/Header';

// Utilities
import _ from 'lodash';
// import PropTypes from 'prop-types';

const columns = [
  { field: 'staffMember', headerName: 'Staff Member', width: 250 },
  { field: 'task', headerName: 'Task', width: 250 },
  { field: 'timesheetTags', headerName: 'Timesheet Tags', width: 150 },
  { field: 'startTime', headerName: 'Start Time', width: 150 },
  { field: 'endTime', headerName: 'End Time', width: 150 },
  { field: 'note', headerName: 'Note', width: 200, color: 'red' },
  { field: 'related', headerName: 'Related', width: 250 },
  { field: 'timeH', headerName: 'Time (h)', width: 150 },
  { field: 'timeD', headerName: 'Time (decimal)', width: 150 },
];

const rows = [
  {
    id: 12,
    staffMember: 'Marvin Sebastian',
    task: 'Campaign/Concept Management',
    timesheetTags: 'In Progress',
    startTime: '23-06-2022 00:42',
    endTime: '23-06-2022 00:24',
    note: 'On it',
    related: '#5329 - Noon DCO - UAE EN - Noon',
    timeH: '00:11	',
    timeD: '0.19',
  },
  {
    id: 13,
    staffMember: 'Marvin Sebastian',
    task: 'Campaign/Concept Management',
    timesheetTags: 'In Progress',
    startTime: '23-06-2022 00:42',
    endTime: '23-06-2022 00:24',
    note: 'On it',
    related: '#5329 - Noon DCO - UAE EN - Noon',
    timeH: '00:11	',
    timeD: '0.19',
  },
  {
    id: 14,
    staffMember: 'Marvin Sebastian',
    task: 'Campaign/Concept Management',
    timesheetTags: 'In Progress',
    startTime: '23-06-2022 00:42',
    endTime: '23-06-2022 00:24',
    note: 'On it',
    related: '#5329 - Noon DCO - UAE EN - Noon',
    timeH: '00:11	',
    timeD: '0.19',
  },
  {
    id: 15,
    staffMember: 'Marvin Sebastian',
    task: 'Campaign/Concept Management',
    timesheetTags: 'In Progress',
    startTime: '23-06-2022 00:42',
    endTime: '23-06-2022 00:24',
    note: 'On it',
    related: '#5329 - Noon DCO - UAE EN - Noon',
    timeH: '00:11	',
    timeD: '0.19',
  },
  {
    id: 16,
    staffMember: 'Marvin Sebastian',
    task: 'Campaign/Concept Management',
    timesheetTags: 'In Progress',
    startTime: '23-06-2022 00:42',
    endTime: '23-06-2022 00:24',
    note: 'On it',
    related: '#5329 - Noon DCO - UAE EN - Noon',
    timeH: '00:11	',
    timeD: '0.19',
  },
];

const Main = () => {
  // React State
  const dispatch = useDispatch();
  const { data, fetching } = useSelector((state) => state.timesheet);
  // const timesheetData = data?.data ?? [];

  const timesheetList = (data?.data ?? []).map((item) => ({
    id: item.timelog_id,
    staffMember: item.user,
    task: item.task_name,
    timesheetTags: item.status,
    startTime: item.start,
    endTime: item.end,
    note: item.note,
    related: item.related,
    timeH: item.start,
    timeD: item.end,
  }));

  const [filteredRows, setFilteredRows] = useState(timesheetList);

  useEffect(() => {
    // dispatch(getTimesheet());
    setFilteredRows(timesheetList);
  }, [data]);

  useEffect(() => {
    dispatch(getTimesheet());
  }, []);

  const handleSearch = (query) => {
    if (_.isEmpty(query)) {
      return setFilteredRows(timesheetList);
    }

    setFilteredRows(
      timesheetList.filter((x) => {
        return x.staffMember.toLowerCase().includes(query.toLowerCase());
      })
    );
  };

  const handleFilter = (filters) => {
    if (_.isEmpty(filters) || _.isEmpty(filters.staffs)) {
      return setFilteredRows(timesheetList);
    }

    setFilteredRows(
      timesheetList.filter((x) => {
        return filters.staffs.includes(x.staffMember.toLowerCase());
      })
    );
  };

  return (
    <Stack>
      <Box>
        {/* {fetching ? (
          <Stack py={1} px={2}>
            <SkeletonLoader />
          </Stack>
        ) : ( */}
        <Stack py={2.5} px={2}>
          {/* Controls */}
          <Header onSearch={handleSearch} onFilter={handleFilter} />
          {/* Table */}
          <Box sx={{ mt: 3, height: 'calc(100vh - 12rem)' }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={50}
              rowsPerPageOptions={[50]}
            />
          </Box>
        </Stack>
        {/* )} */}
      </Box>
    </Stack>
  );
};

export default Main;
