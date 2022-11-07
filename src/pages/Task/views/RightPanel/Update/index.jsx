import { useContext } from 'react';

import _ from 'lodash';

import { useSelector } from 'react-redux';

// Context
import TaskContext from 'pages/Task/Context';

import { Stack } from '@mui/material';

// local component
import CommentPanel from 'pages/Task/Components/CommentPanel';

export default function Update() {
  const { handleThread, handleAttachments } = useContext(TaskContext);
  // Redux State
  const {
    overview: { name, id: taskId, task_type, rel_type },
    comments,
  } = useSelector((state) => state.tasks);

  const {
    data: { id, fullname, profile_picture },
  } = useSelector((state) => state.user);

  const isTask = rel_type === 'task';

  return (
    !_.isUndefined(rel_type) && (
      <Stack>
        {/* Thread Comment */}
        {isTask ? (
          <>
            {!_.isEmpty(comments) ? (
              <CommentPanel
                user={{ id, fullname, profile_picture }}
                section={task_type}
                comment={comments?.task?.comments}
                type={rel_type}
                taskId={taskId}
                handleThread={handleThread}
                handleAttachments={handleAttachments}
                isCollapseEnabled={true}
              />
            ) : null}
            {!_.isEmpty(comments)
              ? comments?.subtask?.map((subtask, index) => (
                  <CommentPanel
                    key={subtask?.subtask_id}
                    user={{ id, fullname, profile_picture }}
                    section={subtask?.subtask_name}
                    comment={subtask?.comments}
                    type={'subtask'}
                    taskId={subtask?.subtask_id}
                    handleThread={handleThread}
                    handleAttachments={handleAttachments}
                    isCollapseEnabled={true}
                  />
                ))
              : null}
          </>
        ) : (
          // comments?.subtask?.map((subtask, index) => (
          <CommentPanel
            // key={subtask?.subtask_id}
            user={{ id, fullname, profile_picture }}
            section={name}
            comment={comments?.subtask}
            type={'subtask'}
            taskId={taskId}
            handleThread={handleThread}
            handleAttachments={handleAttachments}
            isCollapseEnabled={false}
          />
          // ))
        )}
      </Stack>
    )
  );
}
