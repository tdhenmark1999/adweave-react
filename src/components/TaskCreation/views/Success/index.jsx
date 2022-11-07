import PropTypes from 'prop-types';

import { useHistory, useLocation } from 'react-router-dom';

import { Box, Stack, Typography, Button, IconButton } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

import cover from 'assets/cover.svg';

Success.propTypes = {
  onClose: PropTypes.func.isRequired,
  task: PropTypes.any,
  isSubtask: PropTypes.any,
};

export default function Success({ onClose, task, isSubtask }) {
  const history = useHistory();
  const location = useLocation();

  const handleTaskView = () => {
    history.push({
      pathname: `${history.location.pathname}/m/${
        isSubtask ? `subtask` : `task`
      }/${task}`,
      state: {
        background: location,
        type: isSubtask ? 'subtask' : 'task',
        subtask: isSubtask,
      },
    });

    onClose();
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: '100vh',
        backgroundImage: `url(${cover})`,
        backgroundSize: 'cover',
        backgroundPositionX: 'center',
      }}
    >
      <Box mb={3}>
        <IconButton
          size="large"
          sx={{
            width: '4em',
            height: '4em',
            backgroundColor: '#52c41a',
            '&:hover': { backgroundColor: '#52c41a' },
          }}
        >
          <DoneIcon sx={{ width: 'auto', height: 'auto', color: '#fff' }} />
        </IconButton>
      </Box>
      <Typography variant="h4" color="#fff" fontWeight={700}>
        Task Created Successfully!
      </Typography>
      <Typography color="#a3a3a4">
        Updating of details will be done in the task.
      </Typography>
      <Stack mt={2} direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ textTransform: 'none', fontWeight: 700 }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleTaskView}
          sx={{ textTransform: 'none', fontWeight: 700 }}
        >
          Go to task
        </Button>
      </Stack>
    </Stack>
  );
}
