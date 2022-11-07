import { useEffect, useState } from 'react';
import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';

import { useParams, useHistory, useRouteMatch } from 'react-router-dom';

// Reducers
import { fetchCampaignsList, fetchTimelogList } from 'store/reducers/campaign';
import { updateStatus } from 'store/reducers/concept';
import Timelog from 'pages/Campaign/views/Timelog';
import ActivityLog from 'pages/Campaign/views/ActivityLog';

// Predefined Variables
import { overview } from 'pages/Campaign/helpers/constant';

import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
// Components
import Header from 'pages/Campaign/Components/Header';
import ResponsiveDrawer from 'components/Common/ResponsiveDrawer';
import CollapsibleTable from 'components/Common/CollapsibleTable';

// Views
import List from 'pages/Campaign/views/List';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { appColors } from 'theme/variables';
import {
  Stack,
  Box,
  IconButton,
  Typography,
  Collapse,
  AvatarGroup,
  Avatar,
  styled,
  Divider,
  Tabs,
  Tab,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  OutlinedInput,
  Card,
  Tooltip,
} from '@mui/material';

// Reducer
import {
  getTaskByid,
  getData,
  updateTaskByKey,
  requestFetchRefLink_,
  requestDestroyRefLink_,
  requestAddRefLink_,
  requestAddRefLinkCampaign_,
  requestDestroyRefLinkCampaign_,
  fetchReferenceLinkCampaign_,
} from 'store/reducers/tasks';
import { updateCampaignByKey } from 'store/reducers/campaign';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import Popup from 'pages/Task/Components/Popup';
import VirtualListSelection from 'pages/Task/Components/VirtualListSelection';
// MUI Icons
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import SkeletonLoader from 'pages/Campaign/Components/Skeleton';

import PropTypes from 'prop-types';

import { channelIcons } from 'constants/widgets';

import { transformCampaignTasks } from 'utils/dictionary';

const StyledInputField = styled(OutlinedInput)({
  fontSize: '0.9rem',
  borderRadius: '0.2rem',
  paddingRight: '12px',
  '&.Mui-focused fieldset': {
    border: '1px solid #5025c4 !important',
    boxShadow: '0 0 0 4px rgb(80 37 196 / 10%)',
  },
});

const StyledAccordionButton = styled(IconButton)({
  color: `${appColors.darkGray}`,
  '&:hover': {
    backgroundColor: 'transparent',
  },
});

const StyledAvatarGroup = styled(AvatarGroup)({
  width: 24,
  height: 24,
  '&.MuiAvatarGroup': {
    width: 24,
    height: 24,
  },
});

const StyledAvatar = styled(Avatar)({
  width: 24,
  height: 24,
});

const StyledAccordion = styled(Accordion)({
  boxShadow: 'none',
});

const StyledAccordionSummary = styled(AccordionSummary)({
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  padding: '0px',
});

const StyledAccordionDetails = styled(AccordionDetails)({
  padding: '10px 0px',
});

const StyledTypographyReferenceLink = styled(Typography)({
  marginBottom: '5px',
});

const StyledLinksReferenceLink = styled(Link)({
  color: '#F22076',
  marginBottom: '5px',
  textDecoration: 'none',
  textTransform: 'capitalize',
});

const Campaign = () => {
  const {
    overview: { creatives, assignees, data_reference },
    options: { priorityList, usersList, statusList },
    isLoading,
  } = useSelector((state) => state.tasks);

  const { url } = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();
  const { campaignId } = useParams();
  //
  const [anchorEl, setAnchorEl] = useState(null);
  const [horizontal, setHorizontal] = useState('left');
  const [option, setOption] = useState([]);
  const [optionType, setOptionType] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [comment, setComment] = useState(null);
  const [isParent, setIsParent] = useState(null);
  const [expand, setExpand] = useState(false);

  const { data_reference_campaign } = useSelector((state) => state.tasks);

  //
  // States
  const [isCollapsed, setCollapse] = useState(true);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [campaignTasks, setCampaignTasks] = useState({});

  const [filteredRowsReferenceLink, setFilteredRowsReferenceLink] = useState(
    data_reference_campaign
  );
  const [referenceLinkInput01, setReferenceLinkInput01] = useState('');
  const [referenceLinkInput02, setReferenceLinkInput02] = useState('');

  // Redux
  const {
    list: campaign,
    isFetching,
    timelog,
  } = useSelector((state) => state.campaign);

  const { list: maintenanceTaskStatus } = useSelector(
    (state) => state.maintenanceTaskStatus
  );

  const handleOpen = (event, position, type, data, select, relType) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelected(select);
    setHorizontal(position);
    setOptionType(type);
    setOption(data);
    setIsParent(1);
  };

  const handleSave = (data) => {
    if (!_.isEmpty(data?.selectedArr)) {
      !_.find(selected, { id: data?.selectedArr?.id })
        ? setSelected([...selected, data?.selectedArr])
        : setSelected(
            _.filter(
              selected,
              (filterSelect) => filterSelect.id !== data?.selectedArr?.id
            )
          );
    } else {
      setSelected(data.value);
    }

    dispatch(updateCampaignByKey(data));
  };

  // Hooks
  useEffect(() => {
    setFilteredRowsReferenceLink(data_reference_campaign);
    dispatch(fetchCampaignsList(campaignId));
    dispatch(fetchTimelogList(campaignId));
    setOpen(true);
    dispatch(getData('status'));
  }, [campaignId, data_reference_campaign]);

  useEffect(() => {
    if (_.isEmpty(campaign)) {
      return;
    }

    dispatch(getData('users'));

    setCampaignTasks(
      transformCampaignTasks(campaign.task, maintenanceTaskStatus)[0]
    );
  }, [campaign]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setOpen(false);

    setTimeout(
      () =>
        history.replace(
          `/projects/${campaign.partner_id}/concept/${campaign.concept_id}`
        ),
      500
    );
  };

  // task status
  const handleTaskStatusChange = (e, taskId) => {
    const {
      target: { value: statusId },
    } = e;

    dispatch(
      updateStatus({
        type: 'task',
        id: _.toString(taskId),
        status: statusId,
      })
    );
  };

  // Reference Link Functionality

  const handleGetDataRefLinkAccordionTrigger = (e) => {
    dispatch(requestFetchRefLink_(campaign.id));
    setFilteredRowsReferenceLink(data_reference_campaign);
  };

  const handleDeleteRefLink = (e, id) => {
    const itemRefLink = [];
    itemRefLink.push({
      ids: id,
      rel_id: campaign.id,
    });
    dispatch(requestDestroyRefLinkCampaign_(id, campaign.id));
    setFilteredRowsReferenceLink(data_reference_campaign);
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
          rel_id: campaign.id,
          url: referenceLinkInput01,
          name: referenceLinkInput02,
          rel_type: '2',
        });

        dispatch(requestAddRefLinkCampaign_(itemRefLink[0]));

        setReferenceLinkInput01('');
        setReferenceLinkInput02('');
        dispatch(fetchReferenceLinkCampaign_(campaign.id));
        setFilteredRowsReferenceLink(data_reference_campaign);
      }
    }
  };

  return (
    <ResponsiveDrawer
      isOpen={open}
      handleClose={handleClose}
      content={
        <Stack py={2}>
          <Box ml={5} mb={1}>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {!isFetching && !_.isEmpty(campaign) ? (
            <>
              <Header
                taskId={campaign.id}
                statusId={campaign.status_id}
                status={campaign.status}
                isPinned={campaign.is_pinned}
                name={campaign.name}
                channel={channelIcons[campaign.channel]}
                statusList={_.filter(statusList, (stats) =>
                  _.map(
                    stats?.related_to,
                    (types) => types.name === 'campaign'
                  ).includes(true)
                )}
              />

              <Stack
                px={5}
                pt={3}
                direction="row"
                justifyContent="space-between"
              >
                <Tabs value={value} onChange={handleChange}>
                  <Tab label="Overview" disableRipple />
                  <Tab label="Timelog" disableRipple />
                  <Tab label="Activity Log" disableRipple />
                </Tabs>

                {/* <Stack direction="row" alignItems="center">
                  {_.isEmpty(campaign.members) ? (
                    <IconButton color="secondary" size="small">
                      <GroupAddOutlinedIcon />
                    </IconButton>
                  ) : (
                    <StyledAvatarGroup spacing="medium">
                      <StyledAvatar
                        sx={{ width: 24, height: 24 }}
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                    </StyledAvatarGroup>
                  )}
                  <StyledAccordionButton
                    size="small"
                    onClick={() => setCollapse(!isCollapsed)}
                  >
                    <ArrowDropDownCircleOutlinedIcon
                      sx={{
                        transform: isCollapsed
                          ? 'rotate(180deg)'
                          : 'rotate(0deg)',
                      }}
                    />
                  </StyledAccordionButton>
                </Stack> */}
                <Box display="flex">
                  <Tooltip title="Assignee" arrow>
                    <Box
                      onClick={(e) =>
                        handleOpen(
                          e,
                          'left',
                          'assignees',
                          usersList,
                          campaign.assignees,
                          'campaign'
                        )
                      }
                      sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {!_.isEmpty(assignees) ? (
                        <AvatarGroup
                          max={3}
                          sx={{
                            '& .MuiAvatar-root': {
                              width: 24,
                              height: 24,
                              fontSize: 15,
                            },
                          }}
                        >
                          {usersList?.map((data, index) => {
                            return data?.avatar?.split('/').pop() !==
                              'thumb_' || !_.isEmpty(data?.avatar) ? (
                              <Avatar
                                sx={{ width: 24, height: 24 }}
                                alt={data?.name.toUpperCase()}
                                src={data?.avatar}
                                key={index}
                              />
                            ) : (
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  fontSize: '1em',
                                }}
                                key={index}
                              >
                                {`${data.name.toUpperCase().split(' ')[0][0]}${
                                  data.name.toUpperCase().split(' ')[1][0]
                                }`}
                              </Avatar>
                            );
                          })}
                        </AvatarGroup>
                      ) : (
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            backgroundColor: '#ffffff',
                            border: '1px dashed #25165b',
                            color: '#25165b',
                          }}
                        >
                          <PersonAddAltIcon />
                        </Avatar>
                      )}
                    </Box>
                  </Tooltip>
                </Box>
              </Stack>
              <Divider />
              {value === 0 && (
                <>
                  <Collapse
                    in={isCollapsed}
                    timeout="auto"
                    orientation="vertical"
                    unmountOnExit
                  >
                    <Stack px={5} py={2}>
                      {overview.map((item, index) => {
                        return (
                          <Grid container key={index} spacing={3} mb={1}>
                            <Grid item md={4}>
                              <Typography color="primary" fontWeight={700}>
                                {item.name}
                              </Typography>
                            </Grid>
                            <Grid item md={8}>
                              <List item={item.key} data={campaign} />
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Stack>

                    <Stack px={5} py={2}>
                      <StyledAccordion>
                        <StyledAccordionSummary
                          expandIcon={
                            <ExpandMoreIcon
                              onClick={(e) =>
                                handleGetDataRefLinkAccordionTrigger(e)
                              }
                            />
                          }
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography fontWeight={700} color="primary">
                            {' '}
                            Reference Links
                          </Typography>
                        </StyledAccordionSummary>

                        <StyledAccordionDetails>
                          {!_.isEmpty(filteredRowsReferenceLink) ? (
                            (filteredRowsReferenceLink ?? []).map(
                              (reference, index) => (
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
                                      handleDeleteRefLink(
                                        e,
                                        reference.id,
                                        'value'
                                      )
                                    }
                                  >
                                    <CloseOutlinedIcon />
                                  </IconButton>
                                </Stack>
                              )
                            )
                          ) : (
                            <Card
                              variant="outlined"
                              sx={{ borderStyle: 'none' }}
                            >
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
                        </StyledAccordionDetails>
                      </StyledAccordion>
                    </Stack>

                    <Stack px={5} py={2}>
                      <StyledAccordion>
                        <StyledAccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography fontWeight={700} color="primary">
                            {' '}
                            Templates
                          </Typography>
                        </StyledAccordionSummary>

                        <StyledAccordionDetails>
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
                                        pathname: `https://app.ad-lib.io/concepts/${campaign.id}/templates/${template?.template_id}`,
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
                            <Card
                              variant="outlined"
                              sx={{ borderStyle: 'none' }}
                            >
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
                        </StyledAccordionDetails>
                      </StyledAccordion>
                    </Stack>
                  </Collapse>
                </>
              )}
              {value === 1 && (
                <Stack px={5} py={2}>
                  <Timelog timelogData={timelog} />
                </Stack>
              )}
              {value === 2 && (
                <Stack px={5} py={2}>
                  <ActivityLog campaignId={campaign.id} />
                </Stack>
              )}
            </>
          ) : (
            <Stack px={5}>
              <SkeletonLoader />
            </Stack>
          )}
          <Popup
            handleClose={handleClose}
            anchorEl={anchorEl}
            horizontal={horizontal}
            content={
              <VirtualListSelection
                option={
                  optionType === 'watcher'
                    ? _.filter(
                        option,
                        (opt) =>
                          !_.map(assignees, (assignee) =>
                            Number(assignee.user_id ?? assignee.id)
                          ).includes(opt.id)
                      )
                    : option
                }
                type={optionType}
                selected={selected}
                taskId={campaign.id}
                isParent={isParent}
                handleSave={handleSave}
              />
            }
          />
        </Stack>
      }
    />
  );
};

Campaign.propTypes = {
  data: PropTypes.any,
  timelogData: PropTypes.any,
  handleClose: PropTypes.func,
};

export default Campaign;
