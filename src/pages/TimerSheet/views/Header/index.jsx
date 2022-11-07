import { useState } from 'react';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';

// MUI Components
import {
  OutlinedInput,
  Stack,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Button,
  Switch,
  Checkbox,
  TextField,
  Autocomplete,
} from '@mui/material';

// MUI Icons
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// Styles
import { useStyles } from 'pages/Task/styles';

// Utilities
import PropTypes from 'prop-types';

// Dummy Datasource
const staffList = [
  { name: 'Marvin Sebastian' },
  { name: 'Marvin Sebastian' },
  { name: 'Marvin Sebastian' },
  { name: 'Marvin Sebastian' },
];
const campaignList = [
  { name: 'Campaign 1' },
  { name: 'Campaign 2' },
  { name: 'Campaign 3' },
  { name: 'Campaign 4' },
  { name: 'Campaign 5' },
  { name: 'Campaign 6' },
];

export default function Header({ onSearch, onFilter }) {
  const [filterByDate, setFilterByDate] = useState('');
  const [filterByStaff, setFilterByStaff] = useState([]);
  const [filterByCustomer, setFilterByCustomer] = useState('');
  const [filterByCampaign, setFilterByCampaign] = useState([]);

  const classes = useStyles();

  const handleOnClickApply = () => {
    const filters = {
      date: filterByDate,
      customer: filterByCustomer,
      staffs: filterByStaff.map((x) => x.name.toLowerCase()),
      campaigns: filterByCampaign.map((x) => x.name.toLowerCase()),
    };
    onFilter(filters);
  };

  return (
    <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-start' }}>
      {/* Filter by Search */}
      <OutlinedInput
        size="small"
        placeholder="Search"
        onChange={(event) => {
          onSearch(event.target.value);
        }}
        sx={{
          flex: 1.2,
          '& .MuiOutlinedInput-input': {
            height: 36,
          },
        }}
        endAdornment={
          <SearchIcon
            sx={{
              width: '20px !important',
              height: '20px !important',
              color: '#484964',
            }}
          />
        }
      />
      <Stack
        direction="row"
        spacing={1}
        sx={{ flex: 5, pr: 10, alignItems: 'flex-start' }}
      >
        {/* Filter by Date */}
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Date</InputLabel>
          <Select
            label="Date"
            value={filterByDate}
            onChange={(event) => {
              setFilterByDate(event.target.value);
            }}
          >
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Last Month">Last Month</MenuItem>
          </Select>
        </FormControl>

        {/* Filter by Staff Member */}
        <Autocomplete
          sx={{
            flex: 1,
            // '& .MuiOutlinedInput-root': {
            //   maxHeight: 52,
            //   overflowX: 'hidden',
            // },
          }}
          limitTags={2}
          options={staffList}
          noOptionsText="No results."
          getOptionLabel={(option) => option.name}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                sx={{ marginRight: 1 }}
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                checked={selected}
              />
              {option.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="All Staff Member" />
          )}
          onChange={(_, value) => {
            setFilterByStaff(value);
          }}
          multiple
          openOnFocus
          disableCloseOnSelect
          disableListWrap
        />

        {/* Filter by Customer */}
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Customer</InputLabel>
          <Select
            label="Customer"
            value={filterByCustomer}
            onChange={(event) => {
              setFilterByCustomer(event.target.value);
            }}
          >
            <MenuItem value="Customer 1">Customer 1</MenuItem>
          </Select>
        </FormControl>

        {/* Filter by Campaign */}
        <Autocomplete
          sx={{
            flex: 1,
            // '& .MuiOutlinedInput-root': {
            //   maxHeight: 52,
            //   overflow: 'hidden',
            // },
          }}
          limitTags={2}
          options={campaignList}
          noOptionsText="No results."
          getOptionLabel={(option) => option.name}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                sx={{ marginRight: 1 }}
                checked={selected}
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
              />
              {option.name}
            </li>
          )}
          renderInput={(params) => <TextField {...params} label="Campaign" />}
          onChange={(_, value) => {
            setFilterByCampaign(value);
          }}
          multiple
          openOnFocus
          disableCloseOnSelect
          disableListWrap
        />

        {/* CTA */}
        <Button
          sx={{ width: 110, height: 52 }}
          variant="contained"
          color="secondary"
          onClick={handleOnClickApply}
        >
          Apply
        </Button>
      </Stack>
      {/* Switch */}
      <Stack flexDirection="row" alignItems="center" sx={{ flex: 1 }}>
        <p className={classes.toggleText}>Group by Task</p>
        <Switch
          {...{ inputProps: { 'aria-label': 'Switch demo' } }}
          defaultChecked
        />
      </Stack>
    </Stack>
  );
}

Header.propTypes = {
  onSearch: PropTypes.func,
  onFilter: PropTypes.func,
};
