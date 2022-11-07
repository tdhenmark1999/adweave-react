import * as React from 'react';

import PropTypes from 'prop-types';

import moment from 'moment';

import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

export default function DateTimerPicker({
  type,
  taskId,
  isParent,
  defaultValue,
  handleSave,
  handleClose,
}) {
  const [value, setValue] = React.useState(new Date());

  const handleClosePicker = () => {
    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDateTimePicker
        displayStaticWrapperAs="desktop"
        value={defaultValue ?? value}
        closeOnSelect={true}
        onClose={handleClosePicker}
        onChange={(newValue) => {
          handleSave({
            is_parent: isParent,
            id: taskId,
            key: type,
            value: moment(newValue).format('MM/DD/YYYY hh:mm A'),
          });
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

DateTimerPicker.propTypes = {
  type: PropTypes.string,
  taskId: PropTypes.any,
  isParent: PropTypes.any,
  defaultValue: PropTypes.any,
  handleSave: PropTypes.func,
  handleClose: PropTypes.func,
};
