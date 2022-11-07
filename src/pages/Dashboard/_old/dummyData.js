const taskAssignedFilters = [
    { label: 'All', node: [], color: 'warning', type: 'all' },
    {
        label: 'New',
        node: [{ date_created: '05-22-2022', time_logged: 0 }],
        color: 'secondary',
        type: 'filter',
    },
    {
        label: 'Reopened',
        node: [{ reopen_count: 0 }],
        color: 'info',
        type: 'greater_than',
    },
];

const taskAssignedData = [
    {
        name: 'Concept Design - Specsavers NER 2022 - Display',
        url: '/data1',
        date_created: '05-22-2022',
        time_logged: 10,
        reopen_count: 0,
    },
    {
        name: 'Concept Build - Nestle UK Q2 2022 - Social',
        url: '/data2',
        time_logged: 0,
        date_created: '05-22-2022',
        reopen_count: 2,
    },
];

const userLists = [
    {
        fullname: 'Bonifacio Vista',
        team: 'Designer'
    },
    {
        fullname: 'Dhen Mark',
        team: 'Frontend Developer'
    },
    {
        fullname: 'Markwil master',
        team: 'Backend Developer'
    },
    {
        fullname: 'Kristian Nabus',
        team: 'Backend Developer'
    },
    {
        fullname: 'Joshua Chua',
        team: 'Master Developer'
    }
]

export { taskAssignedFilters, taskAssignedData, userLists };