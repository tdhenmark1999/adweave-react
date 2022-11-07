import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { DateRange } from 'react-date-range';

import {
  Box,
  Typography,
  Card,
  Stack,
  Checkbox,
  TextField,
  FormGroup,
  Autocomplete,
  Button,
  FormControlLabel,
} from '@mui/material';
import { filterLinkList_ } from 'store/reducers/concept';
import PropTypes from 'prop-types';

import { appColors } from 'theme/variables';
import { useDispatch, useSelector } from 'react-redux';
// import AutoComplete from 'pages/Dashboard/Components/AutoComplete';

import Color from 'color';
import theme from 'theme';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { formatDate, getDatesInRange } from 'utils/date';
import { ConstructionOutlined } from '@mui/icons-material';

const selectedDatesInitial = [
  {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  },
];

export default function FilterList({
  _id,
  filter,
  channel,
  options,
  categories,
  taskType,
  setChannel,
  selectedFilterOptions,
  setFilterOptions,
  setSelectedFilterOptions,
}) {
  const [selectedDates, setSelectedDates] = useState(selectedDatesInitial);
  const [taskTypeListData, setTaskTypeListData] = useState('');
  const [categoryListData, setCategoryListData] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [taskTypeInput, setTaskTypeInput] = useState('');
  const dispatch = useDispatch();

  const handleSelect = async (slug, e) => {
    e.target.checked
      ? await setChannel((prev) => [...prev, e.target.value])
      : await setChannel(_.filter(channel, (ch) => ch !== e.target.value));

    const item = [];
    item.push({
      filter: {
        channel: channel,
      },
    });
    dispatch(filterLinkList_(_id, item[0]));
  };

  const handleOptionsSelect = async (values, optionType) => {
    await setFilterOptions((prev) => ({
      ...prev,
      [optionType]: [...values.map((v) => v.id)],
    }));
    await setSelectedFilterOptions((prev) => ({
      ...prev,
      [optionType]: values,
    }));
  };

  useEffect(() => {
    const itemTaskType = taskType.map((item) => ({
      id: item.id,
      label: item.name,
    }));

    setTaskTypeListData(itemTaskType);

    const itemCategory = categories.map((item) => ({
      id: item.id,
      label: item.name,
    }));

    setCategoryListData(itemCategory);
  }, []);

  const handleChangeFilterCategories = (value) => {
    const item = [];
    const itemArray = value.map((item) => ({
      id: item.id,
    }));
    setCategoryInput(itemArray);

    const commaSep = itemArray.map((item) => item.id).join(',');
    const myArray = commaSep.split(',');

    item.push({
      filter: {
        categories: myArray,
      },
    });
    dispatch(filterLinkList_(_id, item[0]));
  };

  const handleChangeFilterTaskType = (value) => {
    const item = [];
    const itemArray = value.map((item) => ({
      id: item.id,
    }));
    setTaskTypeInput(itemArray);

    const commaSep = itemArray.map((item) => item.id).join(',');
    const myArray = commaSep.split(',');

    item.push({
      filter: {
        task_type: myArray,
      },
    });
    dispatch(filterLinkList_(_id, item[0]));
  };

  const handleDateRangeChange = async (ranges, optionType) => {
    setSelectedDates([ranges.selection]);
    await setFilterOptions((prev) => ({
      ...prev,
      [optionType]: [
        formatDate(ranges.selection.startDate, 'YYYY-MM-DD'),
        formatDate(ranges.selection.endDate, 'YYYY-MM-DD'),
      ],
    }));
    await setSelectedFilterOptions((prev) => ({
      ...prev,
      [optionType]: [ranges.selection],
    }));
  };

  switch (filter?.slug) {
    case 'channel':
      return (
        <Box p={2}>
          <Typography fontWeight={700} color={appColors.lightViolet}>
            {filter?.name}
          </Typography>
          <Card variant="outlined">
            <Stack p={2}>
              <FormGroup>
                {filter?.options?.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option?.value}
                    control={
                      <Checkbox
                        onChange={(e) => handleSelect(filter?.slug, e)}
                        checked={channel?.includes(option.value.toString())}
                      />
                    }
                    label={option?.name}
                    labelPlacement="end"
                  />
                ))}
              </FormGroup>
            </Stack>
          </Card>
        </Box>
      );

    case 'categories':
      return (
        <Box p={2}>
          <Typography fontWeight={700} color={appColors.lightViolet}>
            {filter?.name}
          </Typography>
          <Stack>
            <Autocomplete
              multiple
              options={categoryListData}
              onChange={(event, value) => handleChangeFilterCategories(value)}
              getOptionLabel={(option) => (option ? option.label : '')}
              // onChange={(event, value) => setCategoryInput(value)}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.label}
                  </li>
                );
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </Box>
      );
    case 'taskType':
      return (
        <Box p={2}>
          <Typography fontWeight={700} color={appColors.lightViolet}>
            {filter?.name}
          </Typography>
          <Stack>
            <Autocomplete
              multiple
              disablePortal
              onChange={(event, value) => handleChangeFilterTaskType(value)}
              id="combo-box-demo"
              options={taskTypeListData}
              getOptionLabel={(option) => (option ? option.label : '')}
              sx={{ width: '100%' }}
              // value={taskTypeInput}
              // onChange={(event, value) => setTaskTypeInput(value)}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.label}
                  </li>
                );
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </Box>
      );

    default:
      return (
        <Box p={2}>
          <Typography fontWeight={700} color={appColors.lightViolet}>
            {filter?.name}
          </Typography>
          <Card variant="outlined">
            <Stack p={2}></Stack>
          </Card>
        </Box>
      );
  }
}

FilterList.propTypes = {
  _id: PropTypes.any,
  filter: PropTypes.any,
  channel: PropTypes.any,
  categories: PropTypes.any,
  taskType: PropTypes.any,
  options: PropTypes.any,
  selectedFilterOptions: PropTypes.any,
  setChannel: PropTypes.any,
  setFilterOptions: PropTypes.any,
  setSelectedFilterOptions: PropTypes.any,
};
