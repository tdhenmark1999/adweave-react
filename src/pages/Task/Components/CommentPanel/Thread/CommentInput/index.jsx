import { useState, useEffect, useRef, useContext, memo } from 'react';

import _, { set } from 'lodash';

import { Editor } from '@tinymce/tinymce-react';

import PropTypes from 'prop-types';

import theme from 'theme';

import {
  Box,
  Stack,
  IconButton,
  Avatar,
  TextField,
  styled,
  InputAdornment,
  Typography,
  Button,
} from '@mui/material';

import { useFileUpload } from 'use-file-upload';

// MUI icons
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import DocumentIcon from '@mui/icons-material/Article';
import OtherFileIcon from '@mui/icons-material/InsertDriveFile';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import TaskContext from 'pages/Task/Context';
import { getFileType } from 'pages/Task/helpers';

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

function CommentInput({
  user,
  taskId,
  threadId,
  type,
  threadAttachments,
  defaultText,
  commentRef,
  handleThread,
  handleAttachments,
}) {
  const [commentText, setCommentText] = useState(null);

  const { handleModal } = useContext(TaskContext);

  // Image Uploading
  const [files, selectFiles] = useFileUpload();
  const [attachments, setAttachments] = useState(threadAttachments ?? []);

  const editorRef = useRef(null);

  useEffect(() => {
    setCommentText(defaultText);
  }, [defaultText]);

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

  const handleDeleteAttachment = (attachment) => {
    if (attachment.id) {
      // Component is in edit mode
      setAttachments([...attachments.filter((a) => a.id != attachment.id)]);
    } else {
      setAttachments([
        ...attachments.filter((a) => a.source != attachment.source),
      ]);
    }

    handleAttachments(attachment);
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      setCommentText(editorRef.current.getContent());
    }
  };

  const handleEditorButtonClick = () => {
    handleThread(taskId, type, commentText, threadId, attachments);
    setCommentText('');
    setAttachments([]);
  };

  return (
    <Stack
      sx={{ padding: '0.5em 0.5em' }}
      direction="row"
      spacing={1}
      alignItems="flex-start"
    >
      <Box sx={{ margin: '0.2em 0' }}>
        {!_.isEmpty(user?.profile_picture) &&
          user?.profile_picture?.split('/').pop() !== 'thumb_' ? (
          <Avatar
            sx={{ width: 30, height: 30 }}
            alt={user?.fullname}
            src={user?.profile_picture}
          />
        ) : (
          <Avatar
            sx={{
              border: '2px solid #25165b',
            }}
          >
            {`${user?.fullname.split(' ')[0][0]}${!_.isEmpty(user?.fullname.split(' ')[1][0])
                ? user?.fullname.split(' ')[1][0]
                : ''
              }`}
          </Avatar>
        )}
      </Box>
      <Box width="100%">
        {/* Add a comment to thread */}
        {/* <StyledTextField
          inputRef={commentRef}
          value={commentText}
          size="small"
          multiline
          placeholder="Write a comment..."
          variant="outlined"
          onChange={(e) =>
            setCommentText(
              e.target.value
                .replace(/\s/g, '')
                .replace(/(\r\n|\n|\r)/gm, '') === ''
                ? e.target.value.replace(/(\r\n|\n|\r)/gm, '')
                : e.target.value
            )
          }
          onKeyPress={(e) => {
            if (
              e.target.value
                .replace(/\s/g, '')
                .replace(/(\r\n|\n|\r)/gm, '') === ''
            ) {
              setCommentText('');
            } else {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleThread(
                  taskId,
                  type,
                  e.target.value,
                  threadId,
                  attachments
                );
                setCommentText('');
                setAttachments([]);
              }
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Stack direction="row">
                  <IconButton>
                    <TextFormatIcon />
                  </IconButton>
                  <IconButton>
                    <SentimentSatisfiedAltIcon />
                  </IconButton>
                  <IconButton>
                    <GifBoxOutlinedIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      selectFiles({ multiple: true }, (files) =>
                        setAttachments([
                          ...attachments,
                          ...files.map((f) => ({
                            ...f,
                            is_new: true,
                          })),
                        ])
                      );
                    }}
                  >
                    <FileUploadOutlinedIcon />
                  </IconButton>
                </Stack>
              </InputAdornment>
            ),
          }}
        /> */}
        <Editor
          onInit={(evt, editor) => (editorRef.current = editor)}
          apiKey=""
          initialValue={commentText}
          init={{
            height: 130,
            menubar: false,
            placeholder: 'Write a comment...',
            plugins: 'link image code fullscreen preview',
            toolbar_location: 'bottom',
            toolbar_mode: 'floating',
            toolbar:
              'undo redo | fontsize | select bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | fullscreen preview media | forecolor backcolor emoticons',
            branding: false,
            content_style:
              "@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;600&display=swap'); body { font-family: Karla; }",
          }}
          onChange={handleEditorChange}
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Stack direction="row" justifyContent="start" spacing={0.5} mt={1}>
            <Typography variant="h7" fontWeight={700} color="primary">
              Attachments
            </Typography>
            <IconButton
              color="secondary"
              variant="text"
              sx={{ fontSize: '1.2em' }}
              onClick={() => {
                selectFiles({ multiple: true }, (files) =>
                  setAttachments([
                    ...attachments,
                    ...files.map((f) => ({
                      ...f,
                      is_new: true,
                    })),
                  ])
                );
              }}
            >
              <FileUploadIcon />
            </IconButton>
          </Stack>
          <Button
            variant="contained"
            onClick={handleEditorButtonClick}
            disabled={_.isEmpty(commentText ?? '')}
          >
            {_.isUndefined(threadId) ? 'Submit' : 'Update'}
          </Button>
        </Stack>
        {!_.isEmpty(attachments) ? (
          <Stack>
            {attachments.map((attachment, index) => (
              <Stack
                key={index}
                spacing={1}
                direction="row"
                alignItems="center"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    color: theme.palette.secondary.main,
                    textDecoration: 'underline',
                  },
                  '&:hover .remove-button': {
                    display: 'inherit',
                  },
                }}
              >
                {renderIcon(attachment.name ?? attachment.file_name)}
                <Typography
                  variant="p"
                  sx={{
                    fontSize: '0.85em',
                  }}
                  onClick={() => {
                    if (
                      getFileType(attachment.name ?? attachment.file_name) ===
                      'image'
                    ) {
                      handleModal(
                        'attachment_preview',
                        true,
                        attachment.source ?? attachment.file_path
                      );
                    } else {
                      window.open(
                        attachment.source ?? attachment.file_path,
                        '_blank'
                      );
                    }
                  }}
                >
                  {attachment.name ?? attachment.file_name}
                </Typography>
                <IconButton
                  ml={2}
                  className="remove-button"
                  aria-label="remove"
                  onClick={() => handleDeleteAttachment(attachment)}
                  sx={{ display: 'none' }}
                >
                  <ClearIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography variant="span" fontWeight={400} sx={{ color: '#a8a8a8' }}>
            No files attached
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

CommentInput.propTypes = {
  user: PropTypes.object.isRequired,
  type: PropTypes.string,
  taskId: PropTypes.any,
  threadId: PropTypes.any,
  defaultText: PropTypes.any,
  commentRef: PropTypes.any,
  threadAttachments: PropTypes.any,
  handleThread: PropTypes.func,
  handleAttachments: PropTypes.func,
};

export default memo(CommentInput);
