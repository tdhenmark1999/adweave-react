import { useState, useRef, useContext } from 'react';
import _ from 'lodash';

import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';

import theme from 'theme';

import {
  Box,
  Card,
  Divider,
  Stack,
  Button,
  Avatar,
  Tooltip,
  Collapse,
  TextField,
  styled,
  IconButton,
  Typography,
} from '@mui/material';

// helper
import { dateFormatter, getFileType } from 'pages/Task/helpers';
import TaskContext from 'pages/Task/Context';

// constant
import {
  thread_options,
  thread_options_normal,
  comment_options,
  subtask_options,
} from 'pages/Task/constant';

import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';

// local component
import CommentHeader from 'pages/Task/Components/CommentHeader';
import ThreadInput from '../ThreadInput';
import CommentInput from './CommentInput';
import ThreadComment from './ThreadComment';

// MUI Icons
import ClearIcon from '@mui/icons-material/Clear';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import DocumentIcon from '@mui/icons-material/Article';
import OtherFileIcon from '@mui/icons-material/InsertDriveFile';

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

const Thread = ({
  thread,
  threadComment,
  key,
  type,
  user,
  taskId,
  handleThread,
  handleAttachments,
}) => {
  const {
    overview: { assignees, watcher },
  } = useSelector((state) => state.tasks);

  const [collapseComment, setCollapseComment] = useState(false);
  const [collapseThreadAttachments, setCollapseThreadAttachments] =
    useState(false);
  const [commentText, setCommentText] = useState(null);
  const commentRef = useRef(null);

  const { isThreadEditing, selectedThreadId, handleModal } =
    useContext(TaskContext);

  const renderIcon = (fileName) => {
    if (getFileType(fileName) === 'image') {
      return <ImageIcon color="secondary" sx={{ marginTop: '2px' }} />;
    } else if (getFileType(fileName) === 'document') {
      return <DocumentIcon color="secondary" sx={{ marginTop: '2px' }} />;
    } else if (getFileType(fileName) === 'video') {
      return <VideoFileIcon color="secondary" sx={{ marginTop: '2px' }} />;
    } else {
      return <OtherFileIcon color="secondary" sx={{ marginTop: '2px' }} />;
    }
  };

  const handleFocusCommentReply = () => {
    // if (!collapseComment) {
    //   setCollapseComment(true);
    //   setTimeout(() => {
    //     commentRef.current.focus();
    //     clearTimeout();
    //   }, 500);
    // } else {
    //   commentRef.current.focus();
    // }
    setCollapseComment(!collapseComment); // Temporary
  };

  const handleCollapseComment = () => {
    setCollapseComment(!collapseComment);
  };

  const isAssignee =
    _.filter(assignees ?? [], (assign) => assign?.id === user?.id)?.length > 0;

  const isWatcher =
    _.filter(watcher ?? [], (w) => w?.user_id === user?.id)?.length > 0;

  const isMyThread = user?.id === thread?.user_id;

  const hasEditHistory = !_.isEmpty(thread?.edit_history ?? []);

  return (
    <>
      {isThreadEditing && thread?.id === selectedThreadId ? (
        <Box my={2} mx={1}>
          <ThreadInput
            user={user}
            type={type}
            taskId={taskId}
            threadId={thread?.id}
            threadAttachments={thread?.attachment}
            defaultText={thread?.thread}
            handleThread={handleThread}
            handleAttachments={handleAttachments}
          />
        </Box>
      ) : (
        <Card key={thread?.id} variant="outlined" sx={{ margin: '0.5em' }}>
          <CommentHeader
            user={{ name: thread?.username, avatar: thread?.avatar }}
            createdDate={dateFormatter(
              _.isEmpty(thread?.date_created)
                ? thread?.date
                : thread?.date_created
            )}
            type={type}
            options={
              type === 'task'
                ? isAssignee || isWatcher
                  ? _.filter(thread_options, (tOptions) =>
                      !isMyThread
                        ? tOptions.key !== 'thread_delete' &&
                          tOptions.key !== 'thread_edit' &&
                          (hasEditHistory
                            ? true
                            : tOptions.key !== 'thread_history')
                        : threadComment?.length > 0
                        ? tOptions.key !== 'thread_delete' &&
                          (hasEditHistory
                            ? true
                            : tOptions.key !== 'thread_history')
                        : hasEditHistory
                        ? tOptions
                        : _.filter(
                            tOptions,
                            (tOption) => tOption.key !== 'thread_history'
                          )
                    )
                  : hasEditHistory
                  ? _.filter(
                      thread_options_normal,
                      (tOptions) =>
                        tOptions.key !== 'thread_delete' &&
                        tOptions.key !== 'thread_edit'
                    )
                  : []
                : subtask_options
            }
            isEdited={thread?.is_edited}
            status={thread?.status}
            threadId={thread?.id}
            thread={thread}
          />

          {/*  Thread Info */}
          <Box
            px={2}
            pb={2}
            lineHeight="initial"
            whiteSpace="pre-line"
            dangerouslySetInnerHTML={{ __html: thread?.thread }}
          />

          {/* Thread Attachments */}
          {!_.isEmpty(thread?.attachment) && (
            <Box px={2} mb={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AttachFileIcon color="secondary" />
                <Typography
                  color="secondary"
                  variant="body2"
                  onClick={() =>
                    setCollapseThreadAttachments(!collapseThreadAttachments)
                  }
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      // color: theme.palette.secondary.main,
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Attachments
                </Typography>
              </Stack>
              <Collapse in={collapseThreadAttachments}>
                <Stack mt={1}>
                  {thread?.attachment?.map((attachment, index) => (
                    <Stack
                      key={index}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          color: theme.palette.secondary.main,
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      <Stack
                        key={index}
                        spacing={1}
                        direction="row"
                        alignItems="center"
                      >
                        {renderIcon(attachment.file_name)}
                        <Typography
                          variant="p"
                          sx={{
                            fontSize: '0.85em',
                          }}
                          onClick={() => {
                            if (getFileType(attachment.file_name) === 'image') {
                              handleModal(
                                'attachment_preview',
                                true,
                                attachment.file_path
                              );
                            } else {
                              window.open(attachment.file_path, '_blank');
                            }
                          }}
                        >
                          {attachment.file_name}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Collapse>
            </Box>
          )}

          {!_.isEmpty(thread?.status?.voters) && (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                p={1}
                alignItems="center"
              >
                <Tooltip title="Report Summary" arrow>
                  <IconButton
                    color="secondary"
                    size="small"
                    onClick={() =>
                      handleModal(
                        'response_summary',
                        true,
                        thread?.status?.voters ?? []
                      )
                    }
                  >
                    <AssessmentOutlinedIcon />
                  </IconButton>
                </Tooltip>

                {/* Approve Assigned Thread */}
                <Stack direction="Row" justifyContent="flex-end">
                  {thread?.status?.voters.map((voter, index) => (
                    <Tooltip title={voter?.user_name} key={index} arrow>
                      <Avatar
                        sx={{
                          width: 15,
                          height: 15,
                          border: '2px solid',
                          borderColor:
                            voter.status?.toLowerCase() === 'rejected'
                              ? '#ff4a4a'
                              : '#1ABC00',
                          marginRight: 0.1,
                          fontSize: '9px',
                          textTransform: 'capitalize',
                        }}
                        alt={voter?.user_name}
                        src={voter?.avatar}
                      />
                    </Tooltip>
                  ))}
                </Stack>
              </Stack>
            </>
          )}

          <Divider />
          <Stack direction="row" justifyContent="space-between">
            {type !== 'subtask' && (isAssignee || isWatcher) && (
              <Box flex={1}>
                <Button
                  sx={{
                    width: '-webkit-fill-available',
                    borderRadius: 0,
                  }}
                  onClick={handleFocusCommentReply}
                >
                  Reply
                </Button>
              </Box>
            )}
            <Divider orientation="vertical" flexItem />
            <Box flex={1}>
              <Button
                sx={{
                  width: '-webkit-fill-available',
                  borderRadius: 0,
                }}
                onClick={handleCollapseComment}
              >
                {`${
                  !_.isUndefined(thread?.comment?.length)
                    ? thread?.comment?.length
                    : 0
                } Comments`}
              </Button>
            </Box>
          </Stack>
          <Divider />

          {/* Comment */}
          <Collapse in={collapseComment}>
            <Box>
              {!_.isEmpty(threadComment)
                ? threadComment?.map((data, index) =>
                    isThreadEditing && selectedThreadId === data?.id ? (
                      <Box my={2} mx={1}>
                        <CommentInput
                          user={user}
                          type={type}
                          taskId={taskId}
                          threadId={{
                            threadId: thread?.id,
                            commentId: data?.id,
                          }}
                          threadAttachments={data?.attachment}
                          defaultText={data?.comment}
                          handleThread={handleThread}
                          handleAttachments={handleAttachments}
                        />
                      </Box>
                    ) : (
                      <ThreadComment
                        key={index}
                        taskId={taskId}
                        data={data}
                        user={user}
                        assignees={assignees}
                        isThreadEditing={
                          isThreadEditing && selectedThreadId === data?.id
                        }
                        handleModal={handleModal}
                      />
                    )
                  )
                : null}

              {type !== 'subtask' && (isAssignee || isWatcher) && (
                <Stack>
                  <Divider />
                  <CommentInput
                    commentRef={commentRef}
                    user={user}
                    type={type}
                    taskId={taskId}
                    threadId={thread?.id}
                    // defaultText={thread?.thread}
                    handleThread={handleThread}
                  />
                </Stack>
              )}
            </Box>
          </Collapse>
        </Card>
      )}
    </>
  );
};

Thread.propTypes = {
  thread: PropTypes.any,
  threadComment: PropTypes.any,
  key: PropTypes.any,
  type: PropTypes.any,
  user: PropTypes.any,
  taskId: PropTypes.any,
  handleThread: PropTypes.func,
  handleAttachments: PropTypes.func,
};

export default Thread;
