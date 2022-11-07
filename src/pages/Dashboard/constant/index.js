import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
export const counter_options = [
  'This Week',
  'This Month',
  'This Year',
  'Custom',
];

export const inprogress_options = ['All', 'On Track', 'Critical', 'Overdue'];

export const open_options = ['All', 'New', 'Re-opened'];

export const my_tasks_options = [];

export const queues_options = [
  {
    name: 'All Tasks',
    slug: 'all_task',
  },
  {
    name: 'Unassigned',
    slug: 'unassigned',
  },
  {
    name: 'Unresponded',
    slug: 'unresponded',
  },
  {
    name: 'Due Today',
    slug: 'due_today',
  },
  {
    name: 'My Tasks',
    slug: 'my_tasks',
  },
];

export const sort_options = [
  {
    name: 'Name',
    slug: 'name',
    sortKey: 'name',
    sortType: '',
  },
  {
    name: 'Created',
    slug: 'created',
    sortKey: 'created_at',
    sortType: '',
  },
  {
    name: 'Submitted',
    slug: 'submitted',
    sortKey: 'date_submitted',
    sortType: '',
  },
  {
    name: 'Due',
    slug: 'due',
    sortKey: 'due_date',
    sortType: '',
  },
  {
    name: 'Delivery',
    slug: 'delivery',
    sortKey: 'delivery_date',
    sortType: 'delivery_date',
  },
];

export const more_options = [
  // {
  //   name: 'EOD Report',
  //   slug: 'eod_report',
  // },
  {
    name: 'Resources',
    slug: 'resources',
  },
  {
    name: 'Dev Dash',
    slug: 'dev_dash',
  },
];

export const summary_devdash = [
  {
    name: 'On Track',
    slug: 'onTrack',
  },
  {
    name: 'Critical',
    slug: 'critical',
  },
  {
    name: 'Overdue',
    slug: 'overdue',
  },
  {
    name: 'Completed',
    slug: 'completed',
  },
];

export const filter_list = [
  {
    name: 'Channel',
    slug: 'channel',
    options: [
      {
        name: 'Google Display',
        value: 1,
      },
      {
        name: 'Google Video',
        value: 2,
      },
      {
        name: 'Meta Static',
        value: 3,
      },
      {
        name: 'Meta Video',
        value: 4,
      },
      {
        name: 'Youtube',
        value: 5,
      },
    ],
  },
  {
    name: 'Partner Group',
    slug: 'partner_group',
  },
  {
    name: 'Priority',
    slug: 'priority',
  },
  {
    name: 'Team',
    slug: 'team',
  },
  {
    name: 'Assignees',
    slug: 'assignees',
  },
  {
    name: 'Watchers',
    slug: 'watchers',
  },
  {
    name: 'Due Date',
    slug: 'due_date',
  },
  {
    name: 'Date Created',
    slug: 'date_created',
  },
  {
    name: 'Date Submitted',
    slug: 'date_submitted',
  },
  {
    name: 'Delivery Date',
    slug: 'delivery_date',
  },
  {
    name: 'Task Health',
    slug: 'task_health',
    options: [
      {
        name: 'On Track',
        value: 'on_track',
      },
      {
        name: 'Critical',
        value: 'critical',
      },
      {
        name: 'Overdue',
        value: 'overdue',
      },
    ],
  },
  {
    name: 'Others',
    slug: 'others',
    options: [
      {
        name: 'Favorites',
        value: 'favorites',
      },
      {
        name: 'Subtask',
        value: 'subtask',
      },
      {
        name: 'Reopen',
        value: 'reopen',
      },
      {
        name: 'Refresh',
        value: 'refresh',
      },
    ],
  },
];

export const profile = [
  {
    name: 'Manage Profile',
    slug: 'profile',
    icon: <AccountBoxOutlinedIcon />,
  },
  {
    name: 'Sign out',
    slug: 'signout',
    icon: <ExitToAppOutlinedIcon />,
  },
];
