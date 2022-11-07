import React, { memo, useState, useRef } from 'react';

import PropTypes from 'prop-types';

import { Editor } from '@tinymce/tinymce-react';

import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  TextField,
  Paper,
  Button,
  Avatar,
  styled,
  Typography,
  Autocomplete,
  Stack,
  Container,
  Divider,
  IconButton,
} from '@mui/material';

import _, { set } from 'lodash';

import { useFileUpload } from 'use-file-upload';
import MUIRichTextEditor from 'mui-rte';

import appTheme from 'theme';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import ClearIcon from '@mui/icons-material/Clear';

const theme = createTheme({
  overrides: {
    MUIRichTextEditor: {
      root: {
        borderRadius: '1em',
        border: '1px solid #ececec',
      },
      container: {
        display: 'flex',
        flexDirection: 'column-reverse',
        height: '26em',
      },
      toolbar: {
        display: 'flex',
        justifyContent: 'space-evenly',
        borderTop: '1px solid #ececec',
        padding: '0.2em 0.5em',
      },
      placeHolder: {
        position: 'absolute',
        height: 'inherit',
        padding: '0.5em 1em',
        top: '14em',
        width: '38em',
      },
      editor: {
        padding: '0 1em',
        height: '-webkit-fill-available',
        overflow: 'auto',
      },
      editorContainer: {
        height: '-webkit-fill-available',
      },
    },
    DraftEditor: {
      root: {
        height: '-webkit-fill-available',
      },
      editorContainer: {
        height: '-webkit-fill-available',
      },
    },
  },
});

function NewTicket({ options }) {
  const editorRef = useRef(null);
  const [files, selectFiles] = useFileUpload();
  const [attachments, setAttachments] = useState([]);

  const { data: user } = useSelector((state) => state.user);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <Container maxWidth="lg">
      <Stack mt={4} mb={4} mx={3}>
        <Grid container spacing={3}>
          <Grid item mb={1} xs={8}>
            <Typography variant="h4" fontWeight={800} color="primary">
              New Ticket
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Subject" variant="outlined" value={null} />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              freeSolo
              value={null}
              options={[]}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Tag" required />
              )}
              onChange={() => { }}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              freeSolo
              value={null}
              options={options?.services}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Services" required />
              )}
              onChange={() => { }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Name"
              variant="outlined"
              value={user?.fullname ?? ''}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email Address"
              variant="outlined"
              value={user?.email ?? ''}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              freeSolo
              value={null}
              options={options?.users}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Assign" required />
              )}
              onChange={() => { }}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              freeSolo
              value={null}
              options={options?.users}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="CC" required />
              )}
              onChange={() => { }}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              freeSolo
              value={null}
              options={options?.departments}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Department" required />
              )}
              onChange={() => { }}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              freeSolo
              value={null}
              options={options?.priorities}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Priority" required />
              )}
              onChange={() => { }}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider
              sx={{
                backgroundColor: 'rgb(176 174 174 / 12%)',
                borderColor: 'rgb(243 243 243 / 12%)',
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              freeSolo
              value={null}
              options={options?.predefined_replies}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Insert Predefined Text"
                  required
                />
              )}
              onChange={() => { }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Insert knowledge base link"
              variant="outlined"
              value={null}
            />
          </Grid>
          <Grid item xs={12}>
            <Editor
              apiKey=""
              initialValue="<p></p>"
              init={{
                plugins: 'link image code fullscreen preview',
                toolbar:
                  'undo redo | bold italic | alignleft aligncenter alignright | code ',
                branding: false,
              }}
              onChange={log}
            />
          </Grid>
          <Grid item mb={1} xs={12}>
            <Stack>
              <Stack direction="row" justifyContent="start" spacing={1}>
                <Typography variant="h7" fontWeight={700} color="primary">
                  Attachments
                </Typography>
                <IconButton
                  color="secondary"
                  variant="text"
                  sx={{ fontSize: '1.2em' }}
                  onClick={() => {
                    selectFiles({ multiple: true }, (files) =>
                      setAttachments([...attachments, ...files])
                    );
                  }}
                >
                  <FileUploadIcon />
                </IconButton>
              </Stack>
              {_.isEmpty(attachments) ? (
                <Typography
                  variant="span"
                  fontWeight={400}
                  sx={{ color: '#a8a8a8' }}
                >
                  No files attached
                </Typography>
              ) : (
                attachments?.map((attachment, index) => (
                  <Stack
                    key={index}
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        color: appTheme.palette.secondary.main,
                        textDecoration: 'underline',
                      },
                      '&:hover .remove-button': {
                        display: 'inherit',
                      },
                    }}
                  >
                    <Typography
                      variant="p"
                      sx={{
                        fontSize: '0.85em',
                      }}
                    // onClick={() => {
                    //   if (
                    //     getFileType(attachment.name ?? attachment.file_name) ===
                    //     'image'
                    //   ) {
                    //     handleModal(
                    //       'attachment_preview',
                    //       true,
                    //       attachment.source ?? attachment.file_path
                    //     );
                    //   } else {
                    //     window.open(
                    //       attachment.source ?? attachment.file_path,
                    //       '_blank'
                    //     );
                    //   }
                    // }}
                    >
                      {attachment.name ?? attachment.file_name}
                    </Typography>
                    <IconButton
                      ml={2}
                      className="remove-button"
                      aria-label="remove"
                      onClick={() =>
                        setAttachments([
                          ...attachments.filter(
                            (a) => a.source != attachment.source
                          ),
                        ])
                      }
                      sx={{ display: 'none' }}
                    >
                      <ClearIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                  </Stack>
                ))
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} justifyContent="flex-end" display="flex">
            <Button variant="contained">Create</Button>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}

NewTicket.propTypes = {
  options: PropTypes.any,
};
export default memo(NewTicket);
