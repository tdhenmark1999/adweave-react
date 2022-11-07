import { useState } from 'react';

import _ from 'lodash';

import { useDispatch } from 'react-redux';

import { fetchOverview } from 'store/reducers/concept';

// Context
import { TaskProvider } from 'pages/Task/Context';

import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import { Modal, Zoom, Box } from '@mui/material';

import Main from 'pages/Task/views/Main';

// Styles
import { useStyles } from 'pages/Task/styles';

export default function Task() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { url } = useRouteMatch();
  const { taskId, relType } = useParams();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    !_.isEmpty(url.split('/')[2]) &&
      !_.isEmpty(url.split('/')[4]) &&
      dispatch(
        fetchOverview({
          conceptId: url.split('/')[4],
          partnerId: url.split('/')[2],
        })
      );

    // localStorage.setItem('projectLink', url.split('/task')[0]);
    history.goBack();
  };

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      className={classes.modal}
      closeAfterTransition
      BackdropProps={{
        sx: { backgroundColor: '#1a1627a3' },
      }}
    >
      <Zoom in={open}>
        <Box className={classes.paper}>
          <TaskProvider>
            <Main id={taskId} relType={relType} />
          </TaskProvider>
        </Box>
      </Zoom>
    </Modal>
  );
}
