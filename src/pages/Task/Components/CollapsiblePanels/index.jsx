import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  Box,
  InputAdornment,
  OutlinedInput,
  Typography,
  IconButton,
  Collapse,
  Button,
  Grid,
  Card,
  FormGroup,
  FormControlLabel,
  Checkbox,
  styled,
} from '@mui/material';

import {
  requestAddChecklist_,
  requestUpdateChecklist_,
  requestFetchChecklist_,
  requestDestroyChecklist_,
  requestUncheckedChecklist_,
  requestCheckedChecklist_,
  requestFetchRevision_,
  requestAddRevision_,
  requestUpdateRevision_,
  requestDestroyRevision_,
  requestResolvedRevision_,
  requestFetchRefLink_,
  requestDestroyRefLink_,
  requestAddRefLink_,
  requestFetchSubTask_,
} from 'store/reducers/tasks';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import SearchIcon from '@mui/icons-material//Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// components
import Subtasks from 'pages/Task/Components/CollapsiblePanels/Subtasks';

// Colors
import { appColors } from 'theme/variables';
import { Link } from 'react-router-dom';

const StyledInputField = styled(OutlinedInput)({
  fontSize: '0.9rem',
  borderRadius: '0.2rem',
  paddingRight: '12px',
  '&.Mui-focused fieldset': {
    border: '1px solid #5025c4 !important',
    boxShadow: '0 0 0 4px rgb(80 37 196 / 10%)',
  },
});

const CollapsiblePanels = ({
  name,
  data,
  subTask,
  creatives,
  priorityList,
  usersList,
  statusList,
  handleOpen,
}) => {
  const { data_check, data_revision, isLoading, data_subtask_modal } =
    useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [expand, setExpand] = useState(false);

  const { data_reference } = useSelector((state) => state.tasks);

  // Reference Link
  const [filteredRowsReferenceLink, setFilteredRowsReferenceLink] =
    useState(data_reference);
  const [referenceLinkInput01, setReferenceLinkInput01] = useState('');
  const [referenceLinkInput02, setReferenceLinkInput02] = useState('');

  // Checklist
  const [checked, setChecked] = useState(false);
  const [checkedInput, setCheckedInput] = useState('');
  const [filteredRows, setFilteredRows] = useState(data_check);
  const [filteredRowsCount, setFilteredRowsCount] = useState('');
  const [totalLabel, setTotalLabel] = useState('COMPLETED');
  const [filteredValueUpdate, setFilteredValueUpdate] = useState('');
  const [filteredValueUpdateID, setFilteredValueUpdateID] = useState('');

  // Revision
  const [filteredRowsRevision, setFilteredRowsRevision] =
    useState(data_revision);
  const [revisionInput, setRevisionInput] = useState('');
  const [filteredRowsCountRevision, setFilteredRowsCountRevision] =
    useState('0');
  const [totalLabelRevision, setTotalLabelRevision] = useState('COMPLETED');
  const [filteredValueUpdateRevision, setFilteredValueUpdateRevision] =
    useState('');
  const [filteredValueUpdateIDrevision, setFilteredValueUpdateIDrevision] =
    useState('');

  useEffect(() => {
    // Checklist
    if (data_check != null) {
      const itemUnchecked = data_check.filter((item) => item.checked == '0');
      setFilteredRows(itemUnchecked);

      const itemChecked = data_check.filter((item) => item.checked == '1');
      setFilteredRowsCount(itemChecked.length);
    }
    // Revision

    if (data_revision != null) {
      const itemUncheckedRevision = data_revision.filter(
        (item) => item.is_resolved == false
      );
      setFilteredRowsRevision(itemUncheckedRevision);

      const itemCheckedRevision = data_revision.filter(
        (item) => item.is_resolved == true
      );
      setFilteredRowsCountRevision(itemCheckedRevision.length);
    }
  }, [data_check, data_revision]);

  useEffect(() => {
    setFilteredRowsReferenceLink(
      data_reference.filter((item) => item.rel_type == 3)
    );
  }, [data_reference]);

  useEffect(() => {
    if (data_revision != null) {
      dispatch(requestFetchRevision_(data.id));
      const itemRevision = data_revision.filter(
        (item) => item.is_resolved == true
      );
      setFilteredRowsCountRevision(itemRevision.length);
    }

    if (data_check != null) {
      dispatch(requestFetchChecklist_(data.id));
      const itemChecked = data_check.filter((item) => item.checked == '1');
      setFilteredRowsCount(itemChecked.length);
    }
  }, []);

  const handleGetDataSubLinkAccordionTrigger = (e) => {
    dispatch(requestFetchSubTask_(data.id));
  };

  // Reference Link Functionality

  const handleGetDataRefLinkAccordionTrigger = (e) => {
    if (!expand) {
      dispatch(requestFetchRefLink_(data.id));
    }
  };

  const handleDeleteRefLink = (e, id) => {
    const itemRefLink = [];
    itemRefLink.push({
      ids: id,
      rel_id: data.id,
    });

    dispatch(requestDestroyRefLink_(itemRefLink[0]));
    setFilteredRowsReferenceLink(data_reference);
  };

  const handleOnKeyUpRefLink = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      if (
        referenceLinkInput01.toString() == '' ||
        referenceLinkInput02.toString() == ''
      ) {
        alert('Please complete all fields.');
      } else {
        const itemRefLink = [];
        itemRefLink.push({
          rel_id: data.id,
          url: referenceLinkInput01,
          name: referenceLinkInput02,
          rel_type: '3',
        });

        dispatch(requestAddRefLink_(itemRefLink[0]));
        setReferenceLinkInput01('');
        setReferenceLinkInput02('');
        dispatch(requestFetchRefLink_(data.id));
        setFilteredRowsReferenceLink(data_reference);
      }
    }
  };

  // Revision Functionality

  const handleSearchRevision = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      const valueSearch = e.target.value;

      if (_.isEmpty(valueSearch)) {
        return setFilteredRowsRevision(data_revision);
      }

      setFilteredRowsRevision(
        data_revision.filter(
          (item) => item.comment.toLowerCase() == valueSearch.toLowerCase()
        )
      );
    }
  };

  const handleOnKeyUpUpdateRevision = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      const itemRevision = [];
      itemRevision.push({
        id: filteredValueUpdateIDrevision,
        comment: filteredValueUpdateRevision,
        report_link: 'www.sample.com',
        task_id: data.id,
      });
      dispatch(requestUpdateRevision_(itemRevision[0]));
      const getDataItem = data_revision.filter(
        (item) => item.id == filteredValueUpdateIDrevision
      );

      if (getDataItem[0].is_resolved == true) {
        const itemchecked = data_revision.filter(
          (item) => item.is_resolved == true
        );
        setFilteredRowsRevision(itemchecked);
      } else {
        const itemUnchecked = data_revision.filter(
          (item) => item.is_resolved == false
        );
        setFilteredRowsRevision(itemUnchecked);
      }

      setRevisionInput('');
      setFilteredValueUpdateRevision('');
      setFilteredValueUpdateIDrevision('');
      setTotalLabelRevision('COMPLETED');
    }
  };

  const handleGetDataRevisionAccordionTrigger = (e) => {
    dispatch(requestFetchRevision_(data.id));
    const itemUnchecked = data_revision.filter(
      (item) => item.is_resolved == false
    );
    setFilteredRowsRevision(itemUnchecked);

    const itemCheckedRevision = data_revision.filter(
      (item) => item.is_resolved == true
    );
    setFilteredRowsCountRevision(itemCheckedRevision.length);
  };

  const handleGetDataRevision = (e) => {
    if (totalLabelRevision == 'COMPLETED') {
      setFilteredRowsRevision(data_revision);
      setTotalLabelRevision('HIDE COMPLETED');
    } else {
      const itemUnchecked = data_revision.filter(
        (item) => item.is_resolved == false
      );
      setFilteredRowsRevision(itemUnchecked);
      setTotalLabelRevision('COMPLETED');
    }
  };

  const handleOnKeyUpRevision = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      const itemRevision = [];
      itemRevision.push({
        rel_id: data.id,
        rel_type: 'task',
        comment: e.target.value,
        report_link: 'www.sample.com',
      });
      dispatch(requestAddRevision_(itemRevision[0]));
      setRevisionInput('');
      setTotalLabelRevision('COMPLETED');
    }
  };

  const handleDeleteRevision = (e, id) => {
    const itemRevision = [];
    itemRevision.push({
      ids: id,
      task_id: data.id,
    });
    dispatch(requestDestroyRevision_(itemRevision[0]));
  };

  const handleCheckRevision = (e, id, type) => {
    if (type == true) {
      const itemRevision = [];
      itemRevision.push({
        id: id,
        task_id: data.id,
      });
      dispatch(requestResolvedRevision_(itemRevision[0]));
      const itemUnchecked = data_revision.filter(
        (item) => item.is_resolved == false
      );
      setFilteredRowsRevision(itemUnchecked);
      setTotalLabelRevision('COMPLETED');
    } else {
      const itemRevision = [];
      itemRevision.push({
        id: id,
        task_id: data.id,
      });
      dispatch(requestResolvedRevision_(itemRevision[0]));
    }
  };

  const handleUpdateRevision = (e, id) => {
    const getDataItem = data_revision.filter((item) => item.id == id);
    setFilteredValueUpdateRevision(getDataItem[0].comment);
    setFilteredValueUpdateIDrevision(id);
  };

  // Checklist Functionality

  const handleGetData = (e) => {
    if (totalLabel == 'COMPLETED') {
      setFilteredRows(data_check);
      setTotalLabel('HIDE COMPLETED');
    } else {
      const itemUnchecked = data_check.filter((item) => item.checked == '0');
      setFilteredRows(itemUnchecked);
      setTotalLabel('COMPLETED');
    }
  };

  const handleGetDataUnchecked = (e) => {
    dispatch(requestFetchChecklist_(data.id));
    const itemUnchecked = data_check.filter((item) => item.checked == '0');
    setFilteredRows(itemUnchecked);
  };

  const handleOnKeyUp = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      const itemChecklist = [];
      itemChecklist.push({
        task_id: data.id,
        description: e.target.value,
        is_parent: '1',
      });
      dispatch(requestAddChecklist_(itemChecklist[0]));
      setCheckedInput('');
      setTotalLabel('COMPLETED');
    }
  };

  const handleSearch = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      const valueSearch = e.target.value;

      if (_.isEmpty(e.target.value)) {
        return setFilteredRows(data_check);
      }

      setFilteredRows(
        data_check.filter(
          (item) =>
            item.description.toLowerCase() == e.target.value.toLowerCase()
        )
      );
    }
  };

  const handleOnKeyUpUpdate = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      const itemChecklist = [];
      itemChecklist.push({
        id: filteredValueUpdateID,
        description: filteredValueUpdate,
        task_id: data.id,
      });
      dispatch(requestUpdateChecklist_(itemChecklist[0]));
      const getDataItem = data_check.filter(
        (item) => item.id == filteredValueUpdateID
      );

      if (getDataItem[0].checked == '1') {
        const itemchecked = data_check.filter((item) => item.checked == '1');
        setFilteredRows(itemchecked);
      } else {
        const itemUnchecked = data_check.filter((item) => item.checked == '0');
        setFilteredRows(itemUnchecked);
      }

      setCheckedInput('');
      setFilteredValueUpdate('');
      setFilteredValueUpdateID('');
      setTotalLabel('COMPLETED');
    }
  };

  const handleDelete = (e, id) => {
    const itemChecklist = [];
    itemChecklist.push({
      ids: id,
      task_id: data.id,
    });
    dispatch(requestDestroyChecklist_(itemChecklist[0]));
    const itemUnchecked = data_check.filter((item) => item.checked == '0');
    setFilteredRows(itemUnchecked);
  };

  const handleUpdate = (e, id) => {
    const getDataItem = data_check.filter((item) => item.id == id);
    setFilteredValueUpdate(getDataItem[0].description);
    setFilteredValueUpdateID(id);
  };

  const handleCheck = (e, id, type) => {
    if (type == true) {
      const itemChecklist = [];
      itemChecklist.push({
        id: id,
        task_id: data.id,
      });
      dispatch(requestUncheckedChecklist_(itemChecklist[0]));
      const itemUnchecked = data_check.filter((item) => item.checked == '0');
      setFilteredRows(itemUnchecked);
      setTotalLabel('COMPLETED');
    } else {
      const itemChecklist = [];
      itemChecklist.push({
        id: id,
        task_id: data.id,
      });
      dispatch(requestCheckedChecklist_(itemChecklist[0]));
    }
  };

  switch (name.toLowerCase()) {
    case 'subtasks':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>{name}</Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? (
                  <ExpandLessIcon
                    onClick={(e) => handleGetDataSubLinkAccordionTrigger(e)}
                  />
                ) : (
                  <ExpandMoreIcon
                    onClick={(e) => handleGetDataSubLinkAccordionTrigger(e)}
                  />
                )}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            <Subtasks
              data={data}
              task_id={data.id}
              subTask={subTask}
              priorityList={priorityList}
              usersList={usersList}
              statusList={statusList}
              handleOpen={handleOpen}
            />
          </Collapse>
        </>
      );

    case 'references':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>{name}</Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? (
                  <ExpandLessIcon
                    onClick={(e) => handleGetDataRefLinkAccordionTrigger(e)}
                  />
                ) : (
                  <ExpandMoreIcon
                    onClick={(e) => handleGetDataRefLinkAccordionTrigger(e)}
                  />
                )}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            {!_.isEmpty(filteredRowsReferenceLink) ? (
              (filteredRowsReferenceLink ?? []).map((reference, index) => (
                <Stack
                  justifyContent="space-between"
                  flexDirection="row"
                  paddingRight="10px"
                  display="flex"
                  key={index}
                >
                  <Typography fontWeight={600} color="#DF3C76">
                    {reference.name}
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      padding: 0,
                      '&:hover': { background: 'transparent' },
                    }}
                    onClick={(e) =>
                      handleDeleteRefLink(e, reference.id, 'value')
                    }
                  >
                    <CloseOutlinedIcon />
                  </IconButton>
                </Stack>
              ))
            ) : (
              <Card variant="outlined" sx={{ borderStyle: 'none' }}>
                <Stack alignItems="center" p={1}>
                  <Box>
                    <IconButton
                      size="large"
                      color="error"
                      disableRipple
                      disableTouchRipple
                      disableFocusRipple
                      sx={{ backgroundColor: '#f2445c1a' }}
                    >
                      <LinkOffIcon />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography fontWeight={700} color="#999999">
                      No reference link found.
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            )}
            {/* <Button
              startIcon={<AddCircleOutlineIcon />}
              color="secondary"
              sx={{ textTransform: 'capitalize' }}
            >
              Add Reference Link
            </Button> */}
            <Grid sx={{ marginTop: '0px' }} container spacing={2}>
              <Grid item xs={6}>
                <StyledInputField
                  sx={{
                    borderRadius: '0.1em',
                    fieldset: {
                      border: '1px dashed #ececec',
                    },
                  }}
                  onChange={(event) =>
                    setReferenceLinkInput01(event.target.value)
                  }
                  value={referenceLinkInput01}
                  fullWidth
                  name="search"
                  type="text"
                  placeholder="Link Name"
                  inputProps={{
                    autoComplete: 'off',
                  }}
                  size="small"
                  required
                  onKeyUp={handleOnKeyUpRefLink}
                />
              </Grid>
              <Grid item xs={6}>
                <StyledInputField
                  sx={{
                    borderRadius: '0.1em',
                    fieldset: {
                      border: '1px dashed #ececec',
                    },
                  }}
                  onChange={(event) =>
                    setReferenceLinkInput02(event.target.value)
                  }
                  value={referenceLinkInput02}
                  fullWidth
                  name="search"
                  type="text"
                  placeholder="Url"
                  inputProps={{
                    autoComplete: 'off',
                  }}
                  size="small"
                  required
                  onKeyUp={handleOnKeyUpRefLink}
                />
              </Grid>
            </Grid>
          </Collapse>
        </>
      );

    case 'checklist':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>{name}</Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? (
                  <ExpandLessIcon onClick={(e) => handleGetDataUnchecked(e)} />
                ) : (
                  <ExpandMoreIcon onClick={(e) => handleGetDataUnchecked(e)} />
                )}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            <Stack direction="row" justifyContent="flex-start">
              <Box>
                <StyledInputField
                  name="search"
                  // onChange={(e) => handleSearch(e)}
                  onKeyUp={handleSearch}
                  type="text"
                  placeholder="Search..."
                  inputProps={{
                    autoComplete: 'off',
                  }}
                  size="small"
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{
                          width: '1em !important',
                          height: '1em !important',
                          color: '#484964',
                        }}
                      />
                    </InputAdornment>
                  }
                  required
                />
              </Box>
            </Stack>
            {_.isEmpty(filteredRows) ? (
              <Card variant="outlined" sx={{ borderStyle: 'none' }}>
                <Stack alignItems="center" p={1}>
                  <Box>
                    <IconButton
                      size="large"
                      color="error"
                      disableRipple
                      disableTouchRipple
                      disableFocusRipple
                      sx={{ backgroundColor: '#f2445c1a' }}
                    >
                      <RemoveDoneIcon />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography fontWeight={700} color="#999999">
                      No checklist found.
                    </Typography>
                  </Box>
                </Stack>
                <Box>
                  <StyledInputField
                    sx={{
                      borderRadius: '0.1em',
                      fieldset: {
                        border: '1px dashed #ececec',
                      },
                    }}
                    onChange={(event) => setCheckedInput(event.target.value)}
                    value={checkedInput}
                    fullWidth
                    name="search"
                    type="text"
                    placeholder="Add New"
                    inputProps={{
                      autoComplete: 'off',
                    }}
                    size="small"
                    required
                    onKeyUp={handleOnKeyUp}
                  />
                </Box>
              </Card>
            ) : (
              <Box py={1.5}>
                <FormGroup>
                  {(filteredRows ?? []).map((row) => (
                    <Stack
                      key={row.id}
                      px={1.5}
                      direction="row"
                      justifyContent={'space-between'}
                      sx={{
                        border: '1px solid #ececec',
                        marginBottom: '0.2em',
                        marginLeft: 0,
                        marginRight: 0,
                        '&:hover': {
                          boxShadow: '0 3px 15px rgb(80 37 196 / 40%)',
                        },
                      }}
                    >
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onClick={(e) =>
                                handleCheck(
                                  e,
                                  row.id,
                                  row.checked == '1' ? true : false,
                                  'value'
                                )
                              }
                              defaultChecked={row.checked == '1' ? true : false}
                            />
                          }
                          label={row.description}
                        />
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          sx={{
                            padding: 0,
                            '&:hover': { background: 'transparent' },
                          }}
                          onClick={(e) => handleUpdate(e, row.id, 'value')}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            padding: 0,
                            '&:hover': { background: 'transparent' },
                          }}
                          onClick={(e) => handleDelete(e, row.id, 'value')}
                        >
                          <CloseOutlinedIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  ))}
                </FormGroup>

                {_.isEmpty(filteredValueUpdate) ? (
                  <Box>
                    <StyledInputField
                      sx={{
                        borderRadius: '0.1em',
                        fieldset: {
                          border: '1px dashed #ececec',
                        },
                      }}
                      onChange={(event) => setCheckedInput(event.target.value)}
                      value={checkedInput}
                      fullWidth
                      name="search"
                      type="text"
                      placeholder="Add New"
                      inputProps={{
                        autoComplete: 'off',
                      }}
                      size="small"
                      required
                      onKeyUp={handleOnKeyUp}
                    />
                  </Box>
                ) : (
                  <Box>
                    <StyledInputField
                      sx={{
                        borderRadius: '0.1em',
                        fieldset: {
                          border: '1px dashed #ececec',
                        },
                      }}
                      onChange={(event) =>
                        setFilteredValueUpdate(event.target.value)
                      }
                      fullWidth
                      value={filteredValueUpdate}
                      name="search"
                      type="text"
                      placeholder="Add New"
                      inputProps={{
                        autoComplete: 'off',
                      }}
                      size="small"
                      required
                      onKeyUp={handleOnKeyUpUpdate}
                    />
                  </Box>
                )}

                <Box mt={1}>
                  <Button onClick={handleGetData} color="secondary">
                    {filteredRowsCount} {totalLabel}
                  </Button>
                </Box>
              </Box>
            )}
          </Collapse>
        </>
      );

    case 'templates':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>{name}</Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            {!_.isEmpty(creatives?.templates) ? (
              creatives?.templates?.map((template, index) => (
                <Stack key={index} mb={1}>
                  <Card variant="outlined">
                    <Stack p={1}>
                      <Typography
                        fontWeight={700}
                        color={appColors.lightViolet}
                        component={Link}
                        to={{
                          pathname: `https://app.ad-lib.io/concepts/${data?.concept_id}/templates/${template?.template_id}`,
                        }}
                        target="_blank"
                        sx={{
                          textDecoration: 'none',
                          '&:hover': { color: '#25165B' },
                        }}
                      >
                        {template?.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color="secondary"
                      >
                        {template?.size}
                      </Typography>
                    </Stack>
                  </Card>
                </Stack>
              ))
            ) : (
              <Card variant="outlined" sx={{ borderStyle: 'none' }}>
                <Stack alignItems="center" p={1}>
                  <Box>
                    <IconButton
                      size="large"
                      color="error"
                      disableRipple
                      disableTouchRipple
                      disableFocusRipple
                      sx={{ backgroundColor: '#f2445c1a' }}
                    >
                      <DashboardIcon />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography fontWeight={700} color="#999999">
                      No templates found.
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            )}
          </Collapse>
        </>
      );

    case 'revisions':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>{name}</Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? (
                  <ExpandLessIcon
                    onClick={(e) => handleGetDataRevisionAccordionTrigger(e)}
                  />
                ) : (
                  <ExpandMoreIcon
                    onClick={(e) => handleGetDataRevisionAccordionTrigger(e)}
                  />
                )}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            <Stack direction="row" justifyContent="flex-start">
              <Box>
                <StyledInputField
                  name="search"
                  onChange={(e) => handleSearchRevision(e)}
                  onKeyUp={handleSearchRevision}
                  type="text"
                  placeholder="Search..."
                  inputProps={{
                    autoComplete: 'off',
                  }}
                  size="small"
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{
                          width: '1em !important',
                          height: '1em !important',
                          color: '#484964',
                        }}
                      />
                    </InputAdornment>
                  }
                  required
                />
              </Box>
            </Stack>
            {_.isEmpty(filteredRowsRevision) ? (
              <Card variant="outlined" sx={{ borderStyle: 'none' }}>
                <Stack alignItems="center" p={1}>
                  <Box>
                    <IconButton
                      size="large"
                      color="error"
                      disableRipple
                      disableTouchRipple
                      disableFocusRipple
                      sx={{ backgroundColor: '#f2445c1a' }}
                    >
                      <RemoveDoneIcon />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography fontWeight={700} color="#999999">
                      No revision found.
                    </Typography>
                  </Box>
                </Stack>
                <Box>
                  <StyledInputField
                    sx={{
                      borderRadius: '0.1em',
                      fieldset: {
                        border: '1px dashed #ececec',
                      },
                    }}
                    onChange={(event) => setRevisionInput(event.target.value)}
                    value={revisionInput}
                    fullWidth
                    name="search"
                    type="text"
                    placeholder="Add New"
                    inputProps={{
                      autoComplete: 'off',
                    }}
                    size="small"
                    required
                    onKeyUp={handleOnKeyUpRevision}
                  />
                </Box>
              </Card>
            ) : (
              <Box py={1.5}>
                <FormGroup>
                  {(filteredRowsRevision ?? []).map((item, index) => (
                    <Stack
                      key={index}
                      px={1.5}
                      direction="row"
                      justifyContent={'space-between'}
                      sx={{
                        border: '1px solid #ececec',
                        marginBottom: '0.2em',
                        marginLeft: 0,
                        marginRight: 0,
                        '&:hover': {
                          boxShadow: '0 3px 15px rgb(80 37 196 / 40%)',
                        },
                      }}
                    >
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onClick={(e) =>
                                handleCheckRevision(
                                  e,
                                  item.id,
                                  item.is_resolved,
                                  'value'
                                )
                              }
                              defaultChecked={item.is_resolved}
                            />
                          }
                          label={item.comment}
                        />
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          sx={{
                            padding: 0,
                            '&:hover': { background: 'transparent' },
                          }}
                          onClick={(e) =>
                            handleUpdateRevision(e, item.id, 'value')
                          }
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            padding: 0,
                            '&:hover': { background: 'transparent' },
                          }}
                          onClick={(e) =>
                            handleDeleteRevision(e, item.id, 'value')
                          }
                        >
                          <CloseOutlinedIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  ))}
                </FormGroup>

                {_.isEmpty(filteredValueUpdateRevision) ? (
                  <Box>
                    <StyledInputField
                      sx={{
                        borderRadius: '0.1em',
                        fieldset: {
                          border: '1px dashed #ececec',
                        },
                      }}
                      onChange={(event) => setRevisionInput(event.target.value)}
                      value={revisionInput}
                      fullWidth
                      name="search"
                      type="text"
                      placeholder="Add New"
                      inputProps={{
                        autoComplete: 'off',
                      }}
                      size="small"
                      required
                      onKeyUp={handleOnKeyUpRevision}
                    />
                  </Box>
                ) : (
                  <Box>
                    <StyledInputField
                      sx={{
                        borderRadius: '0.1em',
                        fieldset: {
                          border: '1px dashed #ececec',
                        },
                      }}
                      onChange={(event) =>
                        setFilteredValueUpdateRevision(event.target.value)
                      }
                      fullWidth
                      value={filteredValueUpdateRevision}
                      name="search"
                      type="text"
                      placeholder="Add New"
                      inputProps={{
                        autoComplete: 'off',
                      }}
                      size="small"
                      required
                      onKeyUp={handleOnKeyUpUpdateRevision}
                    />
                  </Box>
                )}

                <Box mt={1}>
                  <Button onClick={handleGetDataRevision} color="secondary">
                    {filteredRowsCountRevision} {totalLabelRevision}
                  </Button>
                </Box>
              </Box>
            )}
          </Collapse>
        </>
      );

    // case 'revisions':
    //   return (
    //     <>
    //       <Stack
    //         mt={2}
    //         direction="row"
    //         alignItems="center"
    //         justifyContent="space-between"
    //         spacing={2}
    //       >
    //         <Box>
    //           <Typography fontWeight={700}>{name}</Typography>
    //         </Box>
    //         <Box
    //           borderBottom="1px solid #ececec"
    //           borderColor="#0000000a"
    //           width="100%"
    //         ></Box>
    //         <Box>
    //           <IconButton onClick={() => setExpand(!expand)}>
    //             {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    //           </IconButton>
    //         </Box>
    //       </Stack>
    //       <Collapse in={expand}>
    //         <Button
    //           startIcon={<AddCircleOutlineIcon />}
    //           color="secondary"
    //           sx={{ textTransform: 'capitalize' }}
    //         >
    //           Add Revision
    //         </Button>
    //         {!_.isEmpty(data?.checklist) ? (
    //           data?.checklist?.map((checklist, index) => (
    //             <Stack key={index}>hello</Stack>
    //           ))
    //         ) : (
    //           <Card variant="outlined" sx={{ borderStyle: 'none' }}>
    //             <Stack alignItems="center" p={1}>
    //               <Box>
    //                 <IconButton
    //                   size="large"
    //                   color="error"
    //                   disableRipple
    //                   disableTouchRipple
    //                   disableFocusRipple
    //                   sx={{ backgroundColor: '#f2445c1a' }}
    //                 >
    //                   <ThumbDownOffAltIcon />
    //                 </IconButton>
    //               </Box>
    //               <Box>
    //                 <Typography fontWeight={700} color="#999999">
    //                   No Revisions found.
    //                 </Typography>
    //               </Box>
    //             </Stack>
    //           </Card>
    //         )}
    //       </Collapse>
    //     </>
    //   );
  }
};

CollapsiblePanels.propTypes = {
  name: PropTypes.string,
  data: PropTypes.any,
  subTask: PropTypes.any,
  creatives: PropTypes.any,
  priorityList: PropTypes.any,
  usersList: PropTypes.any,
  statusList: PropTypes.any,
  handleOpen: PropTypes.func,
};

export default CollapsiblePanels;
