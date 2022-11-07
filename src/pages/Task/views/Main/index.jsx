import { useEffect, useContext, useState } from 'react';

import PropTypes from 'prop-types';

import _ from 'lodash';

import { useTimer, useStopwatch } from 'react-timer-hook';

import moment from 'moment';

import { timeDifference, timeDifferenceRange } from 'utils/date';

// Router DOM
import { useRouteMatch, useLocation } from 'react-router-dom';

// helper
import { dateChecker } from 'pages/Task/helpers';

// container splitter
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// Reducer
import {
  getTaskTimelogById,
  getTaskByid,
  getTaskFiles,
  taskComment,
  getData,
  reset,
  startTimer,
  playTimer,
  pauseTimer,
  stopTimer,
  taskTemplates,
} from 'store/reducers/tasks';

// Context
import TaskContext from 'pages/Task/Context';

// MUI Components
import {
  Stack,
  Divider,
  Box,
  Typography,
  Dialog,
  Modal,
  Zoom,
} from '@mui/material';

// local component
import Header from 'pages/Task/views/Header';
import SkeletonLoader from 'pages/Task/Components/Skeleton';
import Popup from 'pages/Task/Components/Popup';
import ListSelection from 'pages/Task/Components/ListSelection';
import ListAddSelection from 'pages/Task/Components/ListAddSelection';
import VirtualListSelection from 'pages/Task/Components/VirtualListSelection';
import DateTimerPicker from 'pages/Task/Components/DateTimePicker';
import CommentDialog from 'pages/Task/Components/CommentDialog';

// Pages
import LeftPanel from 'pages/Task/views/LeftPanel';
import RightPanel from 'pages/Task/views/RightPanel';
import { getItemByKey } from 'utils/dictionary';

import ResponseSummary from 'pages/Task/Components/ResponseSummary';
import CommentViewHistoryDialog from 'pages/Task/Components/CommentViewHistoryDialog';

// Styles
import { useStyles } from 'pages/Task/styles';

const commentViewHistoriesMock = [
  { thread: 'this is a sample content', createdDate: 'October 06 at 10:25 PM' },
  { thread: 'this is a sample content', createdDate: 'October 06 at 10:25 PM' },
  { thread: 'this is a sample content', createdDate: 'October 06 at 10:25 PM' },
  { thread: 'this is a sample content', createdDate: 'October 06 at 10:25 PM' },
  { thread: 'this is a sample content', createdDate: 'October 06 at 10:25 PM' },
];

export default function Main({ id, relType }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { path, url } = useRouteMatch();
  const classes = useStyles();

  // const subtask = location.state.subtask;

  const {
    comment,
    anchorEl,
    horizontal,
    option,
    optionType,
    selected,
    attachmentPreview,
    modalType,
    modalData,
    dialogData,
    isModalOpen,
    isParent,
    isSubtask,
    handleClose,
    handleSave,
    handleOpen,
    handleThreadOptions,
    handlePin,
    handleModal,
  } = useContext(TaskContext);

  const { data: user } = useSelector((state) => state.user);

  const {
    overview: {
      rel_type,
      status,
      status_id,
      priority_description,
      priority_id,
      assignees,
      date_created,
      due_date,
      watcher,
      tags,
      is_pinned,
      is_parent,
    },
    timelog,
    comments,
    options: {
      priorityList,
      usersList,
      statusList,
      tagsList,
      triggersList,
      isFetching,
    },
    isLoadingOverview,
  } = useSelector((state) => state.tasks);

  const {
    data: { id: userId },
  } = useSelector((state) => state.user);

  const isAssigned = !_.isEmpty(getItemByKey('id', userId, assignees));

  const latestUserLog = timelog[timelog.length - 1];
  const latestUserTimeLog =
    latestUserLog?.timelogs[latestUserLog.timelogs?.length - 1] ?? {};

  const isStopped =
    _.isEmpty(timelog) || latestUserTimeLog.status.toLowerCase() === 'stop';

  const isRunning =
    !_.isEmpty(timelog) && latestUserTimeLog.status.toLowerCase() === 'running';

  const isPaused =
    !_.isEmpty(timelog) && latestUserTimeLog.status.toLowerCase() === 'paused';

  // Timer configs
  const expiryTimestampConfigs = moment(due_date).toDate();

  const stopWatchConfigs = {
    autoStart: isRunning,
    // Add offset
    offsetTimestamp:
      !isStopped &&
      new Date(
        moment()
          .add(
            isRunning
              ? timeDifference(moment(latestUserTimeLog.start), true)
              : timeDifferenceRange(
                  moment(
                    latestUserTimeLog.timeline[
                      latestUserTimeLog?.timeline?.length - 1
                    ]?.time_in
                  ),
                  moment(
                    latestUserTimeLog.timeline[
                      latestUserTimeLog?.timeline?.length - 1
                    ]?.time_out
                  ),
                  true
                ),
            's'
          )
          .format()
      ),
  };

  // Timer progress calculation
  const currentTimeToDueDateTimeDiff =
    moment(due_date).unix() - moment().unix();

  const dateCreatedToDueDateTimeDiff =
    moment(due_date).unix() - moment(date_created).unix();

  const progress =
    (currentTimeToDueDateTimeDiff / dateCreatedToDueDateTimeDiff) * 100;

  // Hooks
  useEffect(() => {
    //localStorage.setItem('projectLink', url);
    dispatch(reset());

    dispatch(
      getTaskByid({
        taskId: id,
        isSubtask: relType === 'subtask',
      })
    );

    dispatch(getData('priority_flag'));
    dispatch(getData('users'));
    dispatch(getData('status'));
    dispatch(getData('tags', { relId: id, relType: relType }));
    dispatch(
      getData('triggers', { taskId: id, isParent: relType == 'task' ? 1 : 0 })
    );

    dispatch(getTaskTimelogById(id));
    dispatch(
      relType === 'task'
        ? taskComment('task_comment', { taskId: id })
        : taskComment('subtask_comment', { taskId: id })
    );
    dispatch(taskTemplates(id));
    dispatch(getTaskFiles({ relId: id, relType: relType }));
  }, [id]);

  useEffect(() => {
    restart(expiryTimestampConfigs);
    stopwatchReset(
      stopWatchConfigs.offsetTimestamp,
      stopWatchConfigs.autoStart
    );
  }, [due_date, date_created]);

  useEffect(() => {
    if (isRunning && !isAssigned) {
      handleStopButtonClick();
    }
  }, [assignees]);

  const {
    seconds: stopwatchSeconds,
    minutes: stopwatchMinutes,
    hours: stopwatchHours,
    start: stopwatchStart,
    pause: stopwatchPause,
    reset: stopwatchReset,
    isRunning: stopwatchIsRunning,
  } = useStopwatch(stopWatchConfigs);

  const { seconds, minutes, hours, days, restart } = useTimer({
    expiryTimestamp: expiryTimestampConfigs,
    onExpire: () => {},
  });

  // Handlers
  const handlePlayPauseButtonClick = () => {
    const activeTimeLogId = latestUserTimeLog.timelog_id;

    if (isPaused) {
      dispatch(playTimer(id, { id: activeTimeLogId }));
      stopwatchStart();
    } else if (isRunning) {
      dispatch(pauseTimer(id, { id: activeTimeLogId }));
      stopwatchPause();
    } else {
      stopwatchStart();
      dispatch(startTimer(id, { rel_id: id, rel_type: 'task', status }));
    }
  };

  const handleStopButtonClick = () => {
    const activeTimeLogId = latestUserTimeLog.timelog_id;
    dispatch(stopTimer(id, { id: activeTimeLogId }));
    stopwatchReset(_, false);
  };

  return (
    <>
      {!isLoadingOverview && !isFetching ? (
        <Stack>
          <Header
            taskId={id}
            statusId={status_id}
            priorityId={priority_id}
            relType={rel_type}
            status={status}
            priority={priority_description}
            priorityList={priorityList}
            usersList={usersList}
            watcherList={_.filter(
              watcher,
              (opt) =>
                !_.map(assignees, (assignee) =>
                  Number(assignee.user_id ?? assignee.id)
                ).includes(Number(opt.user_id))
            )}
            statusList={_.filter(statusList, (stats) =>
              _.map(
                stats?.related_to,
                (types) => types.name === 'task'
              ).includes(true)
            )}
            assigneesList={assignees}
            isPinned={is_pinned}
            isParent={is_parent}
            handleOpen={handleOpen}
            handlePin={handlePin}
            timer={{ stopwatchHours, stopwatchMinutes, stopwatchSeconds }}
          />
          {status !== 'complete' && dateChecker(due_date) !== 'track' && (
            <Box
              display="flex"
              justifyContent="center"
              backgroundColor={
                dateChecker(due_date) !== 'Critical' ? '#f26464' : '#ffb648'
              }
              sx={{ borderTop: '1px solid #0000001f' }}
            >
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ color: '#ffffff', textTransform: 'uppercase' }}
              >
                {dateChecker(due_date)}
              </Typography>
            </Box>
          )}

          <Divider />
          <Stack>
            <ReflexContainer
              orientation="vertical"
              component={Stack}
              direction="row"
            >
              <ReflexElement minSize={500}>
                <LeftPanel id={id} />
              </ReflexElement>
              <ReflexSplitter
                propagate={true}
                style={{
                  borderRight: '1px solid  #c6c6c6',
                  borderLeft: '1px solid  #c6c6c6',
                  cursor: 'col-resize',
                  width: '2px',
                }}
              ></ReflexSplitter>
              <ReflexElement minSize={500}>
                <RightPanel />
              </ReflexElement>
            </ReflexContainer>
          </Stack>
        </Stack>
      ) : (
        <SkeletonLoader />
      )}

      {/* Popup */}
      {['thread_resolve', 'thread_reject'].includes(selected) && (
        <CommentDialog
          type={selected}
          threadId={comment}
          taskId={id}
          isParent={rel_type === 'task' ? 1 : 0}
          userId={user?.id}
        />
      )}
      {['thread_history'].includes(selected) && (
        <CommentViewHistoryDialog data={dialogData} />
      )}
      <Popup
        handleClose={handleClose}
        anchorEl={anchorEl}
        horizontal={horizontal}
        content={
          ['assignees', 'watcher'].includes(optionType) ? (
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
              taskId={id}
              isParent={isParent}
              handleSave={handleSave}
            />
          ) : ['due_date', 'delivery_date'].includes(optionType) ? (
            <DateTimerPicker
              type={optionType}
              taskId={id}
              isParent={rel_type === 'task' ? 1 : 0}
              handleSave={handleSave}
              handleClose={handleClose}
            />
          ) : ['tags', 'triggers'].includes(optionType) ? (
            <ListAddSelection
              taskId={id}
              defaultData={optionType === 'tags' ? tagsList : triggersList}
              type={optionType}
              relType={relType}
              handleSave={handleSave}
            />
          ) : (
            <ListSelection
              option={option}
              type={optionType}
              selected={selected}
              taskId={isParent ? id : isSubtask}
              handleSave={handleSave}
              handleClose={handleClose}
              handleThreadOptions={handleThreadOptions}
              handlePlayPauseButtonClick={handlePlayPauseButtonClick}
              handleStopButtonClick={handleStopButtonClick}
              timer={{
                days,
                hours,
                minutes,
                seconds,
                stopwatchHours,
                stopwatchMinutes,
                stopwatchSeconds,
                progress,
              }}
              timerState={{
                isRunning,
                isPaused,
                isOverdue: dateChecker(due_date) === 'Overdue',
              }}
              isParent={isParent}
              isAssigned={isAssigned}
            />
          )
        }
      />
      <Modal
        className={classes.modal}
        open={isModalOpen}
        onClose={() => handleModal(null, false, null)}
      >
        <Zoom in={isModalOpen}>
          {['attachment_preview'].includes(modalType) ? (
            <img
              src={attachmentPreview}
              alt="attachment_preview"
              height="70%"
            />
          ) : (
            <Box className={classes.responseSummaryContainer}>
              <ResponseSummary data={modalData} />
            </Box>
          )}
        </Zoom>
      </Modal>
    </>
  );
}

Main.propTypes = {
  id: PropTypes.any,
  relType: PropTypes.any,
};
