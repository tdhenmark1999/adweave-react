import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import _ from 'lodash';

import PropTypes from 'prop-types';

import {
  Box,
  Stack,
  Typography,
  IconButton,
  Collapse,
  Card,
  Divider,
  Button,
  Avatar,
  TextField,
  styled,
  InputAdornment,
} from '@mui/material';

// MUI icons
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';

// children
import Thread from 'pages/Task/Components/CommentPanel/Thread';
import ThreadInput from './ThreadInput';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f0f2f5',
    borderRadius: '1em',
    '&.Mui-focused fieldset': {
      borderColor: '#5025c4',
      boxShadow: '0 0 0 4px rgb(80 37 196 / 10%)',
    },
  },
});

const StyleCard = styled(Card)({
  boxShadow: '0 0 5px 4px rgb(134 134 134 / 10%)',
  border: '1px solid rgb(134 134 134 / 10%)',
});

const CommentPanel = ({
  user,
  section,
  comment,
  type,
  taskId,
  handleThread,
  handleAttachments,
  isCollapseEnabled,
}) => {
  const threadRef = useRef(null);

  const [collapseThread, setCollapseThread] = useState(
    isCollapseEnabled ? true : !isCollapseEnabled
  );

  const {
    overview: { assignees, watcher },
  } = useSelector((state) => state.tasks);

  const handleFocusCreateThread = () => {
    threadRef.current.focus();
  };

  const handleCollapseThread = () => {
    setCollapseThread(!collapseThread);
  };

  const isAssignee =
    _.filter(assignees ?? [], (assign) => assign?.id === user?.id)?.length > 0;

  const isWatcher =
    _.filter(watcher ?? [], (w) => w?.user_id === user?.id)?.length > 0;

  const isTask = type !== 'subtask';

  return (
    <Stack mt={2}>
      {isCollapseEnabled && (
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography fontWeight={700} color="primary">
              {section}
            </Typography>
          </Box>

          <Box>
            <IconButton size="small" onClick={handleCollapseThread}>
              {!collapseThread ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Box>
        </Stack>
      )}
      <Collapse in={collapseThread}>
        <StyleCard>
          <Stack justifyContent="space-between">
            {!_.isEmpty(comment) ? (
              comment.map((thread) => (
                <Thread
                  thread={thread}
                  threadComment={thread?.comment}
                  key={thread.id}
                  type={type}
                  user={user}
                  taskId={taskId}
                  handleThread={handleThread}
                  handleAttachments={handleAttachments}
                />
              ))
            ) : (
              <Card variant="outlined" sx={{ margin: '0.5em' }}>
                <Stack alignItems="center" p={2}>
                  <IconButton>
                    <CommentsDisabledIcon />
                  </IconButton>
                  <Typography variant="caption">
                    No thread found for this task.
                  </Typography>
                  {/* {type !== 'subtask' && (isAssignee || isWatcher) && (
                    <Button size="small" onClick={handleFocusCreateThread}>
                      Create a thread
                    </Button>
                  )} */}
                </Stack>
              </Card>
            )}

            {/* {type !== 'subtask' &&
              _.isEmpty(comment) &&
              !_.isNull(_.last(comment)?.status?.status) && (
                
              )} */}

            <Stack mt={2}>
              <Divider />
              {/* Create a thread */}
              {(isAssignee || isWatcher) && (
                <ThreadInput
                  threadRef={threadRef}
                  user={user}
                  type={type}
                  taskId={taskId}
                  handleThread={handleThread}
                  handleAttachments={handleAttachments}
                />
              )}
            </Stack>
          </Stack>
        </StyleCard>
      </Collapse>
      {!collapseThread && <Divider />}
    </Stack>
  );
};

CommentPanel.propTypes = {
  user: PropTypes.object.isRequired,
  section: PropTypes.any,
  comment: PropTypes.any,
  type: PropTypes.string,
  taskId: PropTypes.any,
  handleThread: PropTypes.func,
  handleAttachments: PropTypes.func,
  isCollapseEnabled: PropTypes.bool,
};

export default CommentPanel;
