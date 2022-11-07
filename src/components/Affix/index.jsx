import React, { useState, Fragment } from 'react';

// MUI Components
import { Stack, Button, Backdrop } from '@mui/material';

// Components
import SpeedDialTooltip from 'components/Common/SpeedDial';
import GlobalDrawer from 'components/Common/Drawer';
import TaskCreation from 'components/TaskCreation';
import TaskTimer from 'components/TaskTimer/index';

// Icons
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

// Styles
import { useStyles } from 'components/Affix/styles';

function Affix() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openTimer, setOpenTimer] = useState('');

  function handleClick() {
    setOpen((prev) => !prev);
  }

  return (
    <Fragment>
      <Stack className={classes.actions}>
        <Stack>
          <Button
            color="primary"
            variant="contained"
            className={classes.button}
            startIcon={<AddOutlinedIcon />}
            size="small"
            disableElevation
            onClick={handleClick}
          >
            Task
          </Button>
        </Stack>
        <Stack>
          <SpeedDialTooltip setSelected={setOpenTimer} />
        </Stack>
      </Stack>
      {/* Task Timer */}
      <TaskTimer
        isVisible={openTimer === 'Task Timer'}
        setVisible={setOpenTimer}
      />
      {/* Drawer */}
      <Backdrop sx={{ background: '#25175aa3', zIndex: 2 }} open={open} />
      <GlobalDrawer
        content={<TaskCreation onClose={handleClick} />}
        transitionDuration={{ enter: 300, exit: 0 }}
        name="search"
        width={700}
        isOpen={open}
        className={classes.drawer}
        anchor="left"
        BackdropProps={{
          invisible: true,
          sx: { backgroundColor: '#25175aa3' },
        }}
        hideBackdrop={true}
      />
    </Fragment>
  );
}

export default Affix;
