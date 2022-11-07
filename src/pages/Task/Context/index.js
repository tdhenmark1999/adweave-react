import { createContext, useState } from 'react';

import _ from 'lodash';

// Redux
import { useDispatch } from 'react-redux';

// Reducer
import {
  updateTaskByKey,
  threadComment,
  updateTags,
  updateTriggers,
  deleteCommentAttachment,
} from 'store/reducers/tasks';

import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [horizontal, setHorizontal] = useState('left');
  const [option, setOption] = useState([]);
  const [optionType, setOptionType] = useState(null);
  const [selected, setSelected] = useState(null);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [dialogData, setDialogData] = useState(null);
  const [comment, setComment] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isParent, setIsParent] = useState(null);
  const [isThreadEditing, setIsThreadEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubtask, setIsSubtask] = useState(null);

  const { relType: relTypeFromParams } = useParams();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSave = (data) => {
    switch (data.key) {
      case 'tags':
        dispatch(updateTags(data));
        break;
      case 'triggers':
        dispatch(updateTriggers(data));
        break;
      case 'assignees':
        !_.find(selected, {
          id: data?.selectedArr?.id,
        })
          ? setSelected([...selected, data?.selectedArr])
          : setSelected(
              _.filter(
                selected,
                (filterSelect) => filterSelect.id !== data?.selectedArr?.id
              )
            );

        dispatch(updateTaskByKey(data));
        break;
      case 'watcher':
        !_.find(selected, {
          user_id: data?.selectedArr?.id,
        })
          ? setSelected([
              ...selected,
              { ...data?.selectedArr, user_id: data?.selectedArr?.id },
            ])
          : setSelected(
              _.filter(
                selected,
                (filterSelect) => filterSelect.user_id !== data?.selectedArr?.id
              )
            );

        dispatch(updateTaskByKey(data));
        break;
      default:
        dispatch(updateTaskByKey(data));
        break;
    }
  };

  const handleOpen = (
    event,
    position,
    type,
    data,
    select,
    relType,
    subtaskID,
    dialogData // For edit history dialog
  ) => {
    setIsParent(relType === 'task' ? 1 : 0);
    setIsSubtask(subtaskID);
    type === 'task' && setComment(select);
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelected(select);
    setHorizontal(position);
    setOptionType(type);
    setOption(data);
    setDialogData(dialogData);
  };

  const handleThreadOptions = (e, select, data) => {
    e.preventDefault();
    setSelectedThreadId(selected);
    setSelected(select);

    switch (select) {
      case 'comment_delete':
      case 'thread_delete':
        dispatch(threadComment(select, '', { id: selected }));
        break;
      case 'thread_edit':
      case 'comment_edit':
        setIsThreadEditing(true);
        break;
    }

    setIsEdit(select === 'edit_info' && true);
    setAnchorEl(null);
  };

  const handleThread = (relId, relType, comment, id, attachments) => {
    const form = new FormData();

    if (isThreadEditing) {
      const isEditingThread = selected !== 'comment_edit';

      form.append('id', isEditingThread ? id : id.commentId);
      form.append('rel_id', isEditingThread ? id : id.threadId);
      form.append('rel_type', relType);
      form.append('comment', comment);

      for (const attachment of attachments) {
        if (attachment.is_new ?? false)
          form.append('files_add[]', attachment.file);
      }

      dispatch(
        threadComment(
          isEditingThread ? 'edit_thread' : 'edit_thread_comment',
          relTypeFromParams,
          form
        )
      );
      setIsThreadEditing(false);
    } else {
      if (!_.isEmpty(attachments)) {
        for (const attachment of attachments) {
          form.append('files[]', attachment.file);
        }
      }

      form.append('rel_type', relType);
      form.append('comment', comment);

      if (_.isNumber(id)) {
        // Adding a comment to a thread
        form.append('rel_id', relId);
        form.append('comment_id', id);
        dispatch(threadComment('add_thread_comment', relTypeFromParams, form));
      } else {
        // Creating a thread
        form.append('rel_id', relId);
        dispatch(threadComment('add_thread', relTypeFromParams, form));
      }
    }
  };

  const handleAttachments = (attachment) => {
    // const ids = attachments.map((a) => `${a.id}`);
    dispatch(deleteCommentAttachment({ ids: attachment.id }));
  };

  const handlePin = (id, type, isParent) => {
    // const isPinParent = type === 'task' ? 1 : 0;

    dispatch(
      updateTaskByKey({
        is_parent: isParent,
        id: id,
        key: 'pin',
        value: '',
      })
    );
  };

  const handleModal = (type, isOpen, data) => {
    switch (type) {
      case 'attachment_preview':
        setAttachmentPreview(data);
        break;
      case 'response_summary':
        setModalData(data);
        break;
      default:
        break;
    }

    setModalType(type);
    setIsModalOpen(isOpen);
  };

  return (
    <TaskContext.Provider
      value={{
        anchorEl,
        comment,
        horizontal,
        option,
        optionType,
        selected,
        selectedThreadId,
        attachmentPreview,
        modalType,
        modalData,
        dialogData,
        isEdit,
        isParent,
        isThreadEditing,
        isModalOpen,
        isSubtask,
        handleClose,
        handleSave,
        handleOpen,
        handleThreadOptions,
        handleThread,
        handlePin,
        handleModal,
        handleAttachments,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

TaskProvider.propTypes = {
  children: PropTypes.any,
};

export default TaskContext;
