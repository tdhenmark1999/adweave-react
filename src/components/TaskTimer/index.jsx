import { useEffect, useState, Fragment } from 'react';

import PropTypes from 'prop-types';

import { Window } from '@progress/kendo-react-dialogs';

import ListItem from './Components/ListItem';

import { useDispatch, useSelector } from 'react-redux';

import {
  fetchPresetCategories,
  fetchPresetCategories2,
  fetchUserTimeLogs,
  fetchActiveTimer,
  fetchPartners,
  fetchCampaigns,
  fetchConcepts,
  startTimerById,
  stopTimerById,
  updateTimer,
} from 'store/reducers/timer';

import { formatDate } from 'utils/date';

// Components
import Header from 'components/TaskTimer/Components/Header';
import List from './Components/List';
import ActiveTimer from './Components/ActiveTimer';

// MUI Components
import { styled, Box, Stack, IconButton } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import MinimizeIcon from '@mui/icons-material/Minimize';
import _ from 'lodash';

const StyledWindow = styled(Window)({
  position: 'absolute',
  backgroundColor: '#fff',
  border: '1px solid #5025c44f !important',
  boxShadow: 'rgb(80 37 196 / 10%) 0px 0px 10px 4px !important',
  '& .k-window-titlebar': {
    width: 'inherit',
    position: 'fixed',
    padding: '7px 6px 7px 15px',
    backgroundColor: '#25165b',
    display: 'flex',
    justifyContent: 'space-between',
    color: '#fff',
    fontWeight: 700,
    zIndex: 1,
  },
  '& .k-window-content': {
    padding: '2em',
  },
});

const TaskTimer = ({ isVisible, setVisible }) => {
  const dispatch = useDispatch();
  const [windowStage, setWindowStage] = useState('DEFAULT');
  const [selectedTaskCategory, setSelectedTaskCategory] = useState(undefined);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Redux states
  const {
    data: { id: userId },
  } = useSelector((state) => state.user);
  const {
    partners,
    campaigns,
    concepts,
    logs,
    list,
    active: activeTimer,
  } = useSelector((state) => state.timer);

  // Hooks
  useEffect(() => {
    dispatch(fetchPartners());
    dispatch(fetchCampaigns());
    dispatch(fetchConcepts());
    dispatch(fetchPresetCategories());
    dispatch(fetchPresetCategories2());
    dispatch(fetchActiveTimer());
    dispatch(fetchUserTimeLogs(userId));
  }, []);

  // Handlers
  const handleClose = () => {
    setVisible(null);
    setWindowStage('DEFAULT');
  };

  const handleNewTimerPresetsSelectionChange = (data) => {
    if (!_.isUndefined(data)) {
      setSelectedTaskCategory(data);
    }
  };

  const handleExistingLogPresetsSelectionChange = (log, task) => {
    if (!_.isUndefined(task)) {
      const { task_timer_id: id } = log;
      const { id: task_category_id, task_type_id } = task;
      dispatch(updateTimer(userId, { id, task_type_id, task_category_id }));
    }
  };

  const handleExistingPartnersSelectionChange = (log, partner) => {
    if (!_.isUndefined(partner)) {
      const { task_timer_id: id } = log;
      const { uuid } = partner;
      dispatch(updateTimer(userId, { id, partner_group_id: uuid }));
    }
  };

  const handleExistingCampaignsSelectionChange = (log, campaign) => {
    if (!_.isUndefined(campaign)) {
      const { task_timer_id: id } = log;
      const { uuid } = campaign;
      dispatch(updateTimer(userId, { id, campaign_id: uuid }));
    }
  };

  const handleExistingConceptsSelectionChange = (log, concept) => {
    if (!_.isUndefined(concept)) {
      const { task_timer_id: id } = log;
      const { uuid } = concept;
      dispatch(updateTimer(userId, { id, concept_id: uuid }));
    }
  };

  const handleStartTimer = () => {
    dispatch(
      startTimerById({
        task_type_id: selectedTaskCategory?.task_type_id ?? null,
        task_category_id: selectedTaskCategory?.id ?? null,
        partner_group_id: selectedPartner?.uuid ?? null,
        campaign_id: selectedCampaign?.uuid ?? null,
        concept_id: selectedConcept?.uuid ?? null,
      })
    );
  };

  const handleStopTimer = (activeTimer) => {
    if (canStopTimer) {
      const { task_timer_id } = activeTimer;
      dispatch(
        stopTimerById(userId, {
          id: task_timer_id,
          task_type_id:
            selectedTaskCategory?.task_type_id ??
            activeTimer.task_type.id ??
            null,
          task_category_id:
            selectedTaskCategory?.id ?? activeTimer.category?.id ?? null,
          partner_group_id:
            selectedPartner?.uuid ?? activeTimer.partner?.id ?? null,
          campaign_id:
            selectedCampaign?.uuid ?? activeTimer.campaign?.uuid ?? null,
          concept_id:
            selectedConcept?.uuid ?? activeTimer.concept?.uuid ?? null,
        })
      );
    }
  };

  const handleStartTimerPreviousLog = (log) => {
    const { task_timer_id } = log;
    dispatch(startTimerById({ task_timer_id: task_timer_id }));
  };

  const handleTimeChange = (log, start, end) => {
    if (!_.isUndefined(log)) {
      const { task_timer_id: id } = log;
      // const logStartDate = formatDate(log.start, 'YYYY-MM-DD');
      // const logEndDate = formatDate(log.end, 'YYYY-MM-DD');

      dispatch(
        updateTimer(userId, {
          id,
          time_in: start,
          time_out: end,
        })
      );
    }
  };

  const isParent = (log) => log.data?.length > 1;

  /*
  const canStopTimer =
    (!_.isNull(activeTimer?.task_type?.id) ||
      !_.isNull(selectedTaskCategory)) &&
    !_.isNull(selectedPartner) &&
    !_.isNull(selectedConcept) &&
    !_.isNull(selectedCampaign);
    */

  const canStopTimer =
    !_.isNull(activeTimer?.task_type?.id) || !_.isNull(selectedTaskCategory);

  return (
    <Fragment>
      {isVisible && (
        <StyledWindow
          title="Task Timer"
          initialHeight={500}
          initialWidth={1000}
          minimizeButton={() => (
            <IconButton
              size="small"
              sx={{ color: '#fff' }}
              onClick={() => setWindowStage('MINIMIZED')}
            >
              <MinimizeIcon />
            </IconButton>
          )}
          maximizeButton={() => (
            <IconButton
              size="small"
              sx={{ color: '#fff' }}
              onClick={() => setWindowStage('FULLSCREEN')}
            >
              <AspectRatioIcon />
            </IconButton>
          )}
          restoreButton={() => (
            <IconButton
              size="small"
              sx={{ color: '#fff' }}
              onClick={() => setWindowStage('DEFAULT')}
            >
              <FullscreenExitIcon />
            </IconButton>
          )}
          closeButton={() => (
            <IconButton
              size="small"
              sx={{ color: '#fff' }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          )}
          stage={windowStage}
          doubleClickStageChange={false}
          sx={{ overflowY: 'auto' }}
        >
          <Box
            sx={{
              height: 'inherit',
              width: '100%',
              paddingTop: '3rem',
            }}
          >
            {/* Header */}
            <Stack spacing={4}>
              <Header>
                {
                  <ActiveTimer
                    timer={activeTimer}
                    tasksDatasource={list}
                    partnersDatasource={partners}
                    campaignsDatasource={campaigns}
                    conceptsDatasource={concepts}
                    onPresetsSelectionChange={
                      handleNewTimerPresetsSelectionChange
                    }
                    onPartnersSelectionChange={(data) =>
                      setSelectedPartner(data)
                    }
                    onCampaignsSelectionChange={(data) =>
                      setSelectedCampaign(data)
                    }
                    onConceptsSelectionChange={(data) =>
                      setSelectedConcept(data)
                    }
                    onStartTimer={handleStartTimer}
                    onStopTimer={handleStopTimer}
                    inputPlaceholder="What are you working on?"
                    canStopTimer={canStopTimer}
                  ></ActiveTimer>
                }
              </Header>
              {logs.map((datasource) => (
                <List key={datasource.start_date} datasource={datasource}>
                  {!_.isEmpty(datasource.category) &&
                    datasource.category.map((log) => (
                      <ListItem
                        key={log.task_timer_id ?? log.start}
                        log={{
                          selectedTask: isParent(log)
                            ? log?.category_name
                            : log?.data
                            ? log?.data[0].category?.name
                            : log?.category_name,
                          selectedPartner: log.data
                            ? log.data[0]?.partner
                            : log.partner,
                          selectedCampaign: log.data
                            ? log.data[0]?.campaign
                            : log.campaign,
                          selectedConcept: log.data
                            ? log.data[0]?.concept
                            : log.concept,
                          total: log?.data ? log?.total_time : log?.total,
                          ...log,
                        }}
                        tasksDatasource={list}
                        partnersDatasource={partners}
                        campaignsDatasource={campaigns}
                        conceptsDatasource={concepts}
                        onPresetsSelectionChange={(_log, task) =>
                          handleExistingLogPresetsSelectionChange(
                            _log.data ? _log.data[0] : _log,
                            task
                          )
                        }
                        onPartnersSelectionChange={(_log, data) =>
                          handleExistingPartnersSelectionChange(
                            _log.data ? _log.data[0] : _log,
                            data
                          )
                        }
                        onCampaignsSelectionChange={(_log, data) =>
                          handleExistingCampaignsSelectionChange(
                            _log.data ? _log.data[0] : _log,
                            data
                          )
                        }
                        onConceptsSelectionChange={(_log, data) =>
                          handleExistingConceptsSelectionChange(
                            _log.data ? _log.data[0] : _log,
                            data
                          )
                        }
                        onStartPreviousLog={(_log) =>
                          handleStartTimerPreviousLog(
                            _log.data ? _log.data[0] : _log
                          )
                        }
                        onTimeChange={(_log, startTime, endTime) =>
                          handleTimeChange(
                            _log.data ? _log.data[0] : _log,
                            startTime,
                            endTime
                          )
                        }
                        inputPlaceholder="Add description"
                        isParent={isParent(log)}
                      />
                    ))}
                </List>
              ))}
            </Stack>
          </Box>
        </StyledWindow>
      )}
    </Fragment>
  );
};

TaskTimer.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.any,
};

export default TaskTimer;
